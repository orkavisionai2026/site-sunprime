#!/usr/bin/env node
/**
 * Seed do Sanity a partir dos JSONs da Fase 1.
 *
 * Entrada:
 *   _extracao/empreendimentos-detalhados.json
 *   _extracao/sobre.json
 *   public/extracted-images/...
 *
 * Saída: documentos criados/atualizados no dataset configurado.
 *
 * Uso:
 *   npm run seed                (normal)
 *   npm run seed -- --dry-run   (valida sem subir nada)
 *
 * Env necessárias:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET   (default: production)
 *   SANITY_API_WRITE_TOKEN       (token com permissão Editor)
 */

import { createClient } from '@sanity/client';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';

// ——— setup ————————————————————————————————————————————————————————————————

const DRY_RUN = process.argv.includes('--dry-run');
const REPO_ROOT = resolve(import.meta.dirname, '..');
const EXTRACAO_DIR = join(REPO_ROOT, '_extracao');
const IMAGES_DIR = join(REPO_ROOT, 'public', 'extracted-images');

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!DRY_RUN) {
  if (!projectId) die('Falta NEXT_PUBLIC_SANITY_PROJECT_ID (rode npx sanity init ou crie projeto em sanity.io/manage)');
  if (!token) die('Falta SANITY_API_WRITE_TOKEN (gere token Editor em sanity.io/manage → API → Tokens)');
}

const client = DRY_RUN
  ? null
  : createClient({
      projectId,
      dataset,
      apiVersion: '2026-04-24',
      token,
      useCdn: false,
    });

// ——— helpers ——————————————————————————————————————————————————————————————

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Converte os 3 status do JSON ("Entregues", "Em construção", "Pré-lançamento") em docs determinísticos. */
function statusDocId(label) {
  return `status-${slugify(label)}`;
}

function empreendimentoDocId(slug) {
  return `empreendimento-${slug}`;
}

function firstFileIn(dir) {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  return files.length ? join(dir, files[0]) : null;
}

function allFilesIn(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map((f) => join(dir, f));
}

function resolveCapa(slugDir) {
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = join(slugDir, `capa.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

/** Extrai o id do arquivo de arquiteto a partir da URL (.../site_arquiteto/2.jpg → _arquitetos/2.jpg). */
function resolveArquitetoImage(url) {
  if (!url) return null;
  const m = url.match(/site_arquiteto\/(\d+)\.(png|jpg|jpeg)/i);
  if (!m) return null;
  const candidate = join(IMAGES_DIR, '_arquitetos', `${m[1]}.${m[2].toLowerCase()}`);
  return existsSync(candidate) ? candidate : null;
}

// ——— upload de assets com cache local ————————————————————————————————————

const assetCache = new Map(); // absPath → { _type: 'image', asset: { _ref } }

async function uploadImage(absPath) {
  if (!absPath) return null;
  if (assetCache.has(absPath)) return assetCache.get(absPath);

  if (DRY_RUN) {
    const fake = { _type: 'image', asset: { _ref: `image-DRYRUN-${basenameHash(absPath)}` } };
    assetCache.set(absPath, fake);
    return fake;
  }

  const buffer = readFileSync(absPath);
  const ext = extname(absPath).slice(1).toLowerCase();
  const filename = absPath.replace(IMAGES_DIR + '/', '').replace(/\//g, '_');
  const asset = await client.assets.upload('image', buffer, {
    filename,
    contentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
  });
  const ref = { _type: 'image', asset: { _ref: asset._id } };
  assetCache.set(absPath, ref);
  return ref;
}

function basenameHash(p) {
  return createHash('sha1').update(p).digest('hex').slice(0, 8);
}

// ——— portable text a partir de string ————————————————————————————————————

function textToBlocks(text) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para, i) => ({
      _type: 'block',
      _key: `p${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `s${i}`, text: para, marks: [] }],
    }));
}

// ——— ficha técnica: parser pragmático do texto livre ——————————————————————

function parseFichaTecnica(raw) {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linha, i) => {
      const idx = linha.indexOf(':');
      if (idx === -1) return { _key: `f${i}`, _type: 'item', rotulo: linha, valor: '' };
      return {
        _key: `f${i}`,
        _type: 'item',
        rotulo: linha.slice(0, idx).trim(),
        valor: linha.slice(idx + 1).trim(),
      };
    })
    .filter((item) => item.valor);
}

// ——— transformações por tipo ——————————————————————————————————————————————

async function buildStatusDocs(empreendimentos) {
  const labels = [...new Set(empreendimentos.map((e) => e.status).filter(Boolean))];
  const ordemMap = { 'Pré-lançamentos': 0, 'Em construção': 1, 'Entregues': 2 };
  const corMap = { 'Pré-lançamentos': 'gold-500', 'Em construção': 'ocean-500', 'Entregues': 'ink-500' };
  return labels.map((label) => ({
    _id: statusDocId(label),
    _type: 'statusEmpreendimento',
    titulo: label,
    slug: { _type: 'slug', current: slugify(label) },
    ordem: ordemMap[label] ?? 99,
    cor: corMap[label] ?? 'ink-500',
  }));
}

async function buildEmpreendimentoDoc(emp, index) {
  const slugDir = join(IMAGES_DIR, emp.slug);

  const capa = await uploadImage(resolveCapa(slugDir));
  const render = await uploadImage(firstFileIn(join(slugDir, 'render')));
  const logo = await uploadImage(firstFileIn(join(slugDir, 'logo')));
  const adicional = await uploadImage(firstFileIn(join(slugDir, 'adicional')));

  const galeriaFiles = allFilesIn(join(slugDir, 'galeria'));
  const galeria = [];
  for (let i = 0; i < galeriaFiles.length; i++) {
    const ref = await uploadImage(galeriaFiles[i]);
    if (ref) galeria.push({ ...ref, _key: `g${i}` });
  }

  const arquitetos = [];
  for (let i = 0; i < (emp.arquitetos_e_parceiros || []).length; i++) {
    const a = emp.arquitetos_e_parceiros[i];
    const foto = await uploadImage(resolveArquitetoImage(a.imagem));
    arquitetos.push({
      _key: `a${i}`,
      _type: 'arquiteto',
      nome: a.nome || '—',
      descricao: a.descricao || undefined,
      quote: a.quote || undefined,
      foto: foto ?? undefined,
    });
  }

  const loc = emp.localizacao || {};
  return {
    _id: empreendimentoDocId(emp.slug),
    _type: 'empreendimento',
    nome: titleFromSlug(emp.slug),
    slug: { _type: 'slug', current: emp.slug },
    status: { _type: 'reference', _ref: statusDocId(emp.status) },
    ordemDestaque: index * 10,
    hotsiteUrl: emp.hotsite || undefined,
    descricao: textToBlocks(emp.descricao),
    disclaimer: emp.disclaimer || undefined,
    arquitetos: arquitetos.length ? arquitetos : undefined,
    capa: capa ?? undefined,
    render: render ?? undefined,
    logo: logo ?? undefined,
    fotoAdicional: adicional ?? undefined,
    galeria: galeria.length ? galeria : undefined,
    fichaTecnica: parseFichaTecnica(emp.ficha_tecnica_texto),
    localizacao: {
      cidade: 'Itapema',
      uf: 'SC',
      geo:
        loc.lat != null && loc.lon != null
          ? { _type: 'geopoint', lat: loc.lat, lng: loc.lon }
          : undefined,
    },
  };
}

function titleFromSlug(slug) {
  return slug
    .split('-')
    .map((w) => (w === 'by' ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

async function buildInstitucionalDoc(sobre) {
  const s = sobre.secoes;
  const missaoImagem = await uploadImage(
    join(IMAGES_DIR, '_institucional', 'missao.png'),
  );
  const ceoFoto = await uploadImage(
    join(IMAGES_DIR, '_institucional', 'ceo-eduardo-pastor.png'),
  );
  const quoteImg = await uploadImage(
    join(IMAGES_DIR, '_institucional', 'quote-dna.png'),
  );

  return {
    _id: 'institucional',
    _type: 'institucional',
    manifestoTitulo: s.manifesto.titulo,
    manifestoVersos: s.manifesto.paragrafos,
    missaoTitulo: s.missao.titulo,
    missaoTexto: s.missao.texto,
    missaoImagem: missaoImagem ?? undefined,
    valores: s.valores.lista.map((v, i) => ({
      _key: `v${i}`,
      _type: 'valor',
      nome: v.nome,
      descricao: v.descricao,
    })),
    anoFundacao: s.quemSomos.fundacao_ano,
    ceo: {
      nome: s.quemSomos.ceo.nome,
      cargo: s.quemSomos.ceo.cargo,
      foto: ceoFoto ?? undefined,
      headline: s.quemSomos.ceo.headline_1,
      paragrafos: s.quemSomos.ceo.paragrafos,
    },
    quoteDna: {
      texto: s.quemSomos.quote_dna.texto,
      autor: s.quemSomos.ceo.nome,
      imagem: quoteImg ?? undefined,
    },
    taglineFinal: s.quemSomos.tagline_final,
  };
}

function buildConfiguracaoSiteDoc(sobre) {
  const r = sobre.rodape;
  const a = sobre.analytics_detectados || {};
  return {
    _id: 'configuracaoSite',
    _type: 'configuracaoSite',
    tagline: r.tagline,
    endereco: r.endereco,
    telefone: r.telefone,
    whatsapp: r.whatsapp,
    whatsappUrl: r.whatsapp_url,
    email: r.email,
    horarioAtendimento: r.horario,
    redesSociais: Object.entries(r.redes_sociais || {}).map(([plataforma, url], i) => ({
      _key: `r${i}`,
      _type: 'rede',
      plataforma,
      url,
    })),
    menuPrincipal: [
      { _key: 'm1', _type: 'item', label: 'Empreendimentos', url: '/empreendimentos', externo: false },
      { _key: 'm2', _type: 'item', label: 'Sobre', url: '/sobre', externo: false },
      { _key: 'm3', _type: 'item', label: 'Contato', url: '/contato', externo: false },
    ],
    ga4Id: a.ga4 || undefined,
    recaptchaSiteKey: a.recaptcha_site_key || undefined,
    rdStationToken: a.rd_station_loader || undefined,
  };
}

// ——— runner ——————————————————————————————————————————————————————————————

async function main() {
  const empreendimentos = JSON.parse(
    readFileSync(join(EXTRACAO_DIR, 'empreendimentos-detalhados.json'), 'utf8'),
  );
  const sobre = JSON.parse(readFileSync(join(EXTRACAO_DIR, 'sobre.json'), 'utf8'));

  console.log(`${DRY_RUN ? '⟳ DRY-RUN' : '⟳ SEED'}  (${empreendimentos.length} empreendimentos)`);
  console.log(`  dataset: ${dataset}  projectId: ${projectId || '(dry)'}`);

  const docs = [];

  console.log('→ status…');
  docs.push(...(await buildStatusDocs(empreendimentos)));

  console.log('→ empreendimentos (upload de imagens)…');
  for (let i = 0; i < empreendimentos.length; i++) {
    const emp = empreendimentos[i];
    process.stdout.write(`  [${i + 1}/${empreendimentos.length}] ${emp.slug}…`);
    const doc = await buildEmpreendimentoDoc(emp, i);
    docs.push(doc);
    process.stdout.write(' ok\n');
  }

  console.log('→ institucional…');
  docs.push(await buildInstitucionalDoc(sobre));

  console.log('→ configuracaoSite…');
  docs.push(buildConfiguracaoSiteDoc(sobre));

  console.log(`\n${docs.length} docs prontos, ${assetCache.size} assets únicos.`);

  if (DRY_RUN) {
    console.log('\n(dry-run) preview dos _ids gerados:');
    for (const d of docs) console.log(`  ${d._type.padEnd(25)} ${d._id}`);
    return;
  }

  console.log('\n→ gravando no Sanity (createOrReplace)…');
  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d);
  await tx.commit();
  console.log(`✓ ${docs.length} docs gravados.`);
}

main().catch((err) => {
  console.error('\n✗ seed falhou:', err);
  process.exit(1);
});

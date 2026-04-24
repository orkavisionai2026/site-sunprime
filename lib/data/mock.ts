/**
 * Mock adapter — lê os JSONs da Fase 1 e as imagens locais em /public/extracted-images.
 * Mesma assinatura do futuro Sanity adapter.
 *
 * Só usado em server components (lê do filesystem).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type {
  ConfiguracaoSite,
  Empreendimento,
  ImageRef,
  Institucional,
  StatusEmpreendimento,
} from './types';

const REPO_ROOT = resolve(process.cwd());
const IMAGES_FS_ROOT = join(REPO_ROOT, 'public', 'extracted-images');
const IMAGES_PUBLIC_ROOT = '/extracted-images';
const EXTRACAO_DIR = join(REPO_ROOT, '_extracao');

const STATUS_META: Record<string, Omit<StatusEmpreendimento, 'titulo'>> = {
  'Pré-lançamentos': { slug: 'pre-lancamentos', ordem: 0, cor: 'gold-500' },
  'Em construção': { slug: 'em-construcao', ordem: 1, cor: 'ocean-500' },
  Entregues: { slug: 'entregues', ordem: 2, cor: 'ink-500' },
};

// ——— helpers de filesystem → URL pública ———————————————————————————————————

function toPublicUrl(absPath: string): string {
  return absPath.replace(IMAGES_FS_ROOT, IMAGES_PUBLIC_ROOT).replaceAll('\\', '/');
}

function firstFileIn(dir: string): string | null {
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  return files.length ? join(dir, files[0]) : null;
}

function allFilesIn(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .map((f) => join(dir, f));
}

function resolveCapa(slug: string): string | null {
  const base = join(IMAGES_FS_ROOT, slug);
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = join(base, `capa.${ext}`);
    if (existsSync(p)) return p;
  }
  return null;
}

function toImageRef(absPath: string | null, alt?: string): ImageRef | undefined {
  if (!absPath) return undefined;
  return { src: toPublicUrl(absPath), alt };
}

function resolveArquitetoImage(url: string | null | undefined): string | null {
  if (!url) return null;
  const m = url.match(/site_arquiteto\/(\d+)\.(png|jpg|jpeg)/i);
  if (!m) return null;
  const candidate = join(IMAGES_FS_ROOT, '_arquitetos', `${m[1]}.${m[2].toLowerCase()}`);
  return existsSync(candidate) ? candidate : null;
}

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((w) => (w === 'by' ? w : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
}

function parseFichaTecnica(raw: string | null | undefined) {
  if (!raw) return [];
  return raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((linha) => {
      const idx = linha.indexOf(':');
      if (idx === -1) return { rotulo: linha, valor: '' };
      return { rotulo: linha.slice(0, idx).trim(), valor: linha.slice(idx + 1).trim() };
    })
    .filter((i) => i.valor);
}

function paragraphs(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split(/\n{1,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

// ——— API pública ——————————————————————————————————————————————————————————

type EmpreendimentoRaw = {
  slug: string;
  status: string;
  hotsite: string | null;
  descricao: string;
  disclaimer: string | null;
  ficha_tecnica_texto: string;
  arquitetos_e_parceiros: Array<{
    nome: string;
    descricao: string | null;
    imagem: string;
    quote: string | null;
  }>;
  localizacao: {
    endereco: string | null;
    lat: number | null;
    lon: number | null;
    iframe_src: string | null;
  };
};

let empreendimentosCache: Empreendimento[] | null = null;

export function getEmpreendimentos(): Empreendimento[] {
  if (empreendimentosCache) return empreendimentosCache;

  const raw: EmpreendimentoRaw[] = JSON.parse(
    readFileSync(join(EXTRACAO_DIR, 'empreendimentos-detalhados.json'), 'utf8'),
  );

  empreendimentosCache = raw.map((emp, i) => {
    const slugDir = join(IMAGES_FS_ROOT, emp.slug);
    const statusMeta = STATUS_META[emp.status] ?? STATUS_META.Entregues;

    return {
      slug: emp.slug,
      nome: titleFromSlug(emp.slug),
      status: { titulo: emp.status, ...statusMeta },
      ordemDestaque: statusMeta.ordem * 100 + i,
      hotsiteUrl: emp.hotsite ?? undefined,
      descricao: paragraphs(emp.descricao),
      disclaimer: emp.disclaimer ?? undefined,
      capa: toImageRef(resolveCapa(emp.slug), `${titleFromSlug(emp.slug)} — capa`)!,
      render: toImageRef(firstFileIn(join(slugDir, 'render')), `${titleFromSlug(emp.slug)} — render`),
      logo: toImageRef(firstFileIn(join(slugDir, 'logo')), `${titleFromSlug(emp.slug)} — logo`),
      fotoAdicional: toImageRef(
        firstFileIn(join(slugDir, 'adicional')),
        `${titleFromSlug(emp.slug)} — atmosfera`,
      ),
      galeria: allFilesIn(join(slugDir, 'galeria'))
        .map((p, gi) => toImageRef(p, `${titleFromSlug(emp.slug)} — galeria ${gi + 1}`)!)
        .filter(Boolean),
      fichaTecnica: parseFichaTecnica(emp.ficha_tecnica_texto),
      tipologias: [],
      arquitetos: (emp.arquitetos_e_parceiros ?? []).map((a) => ({
        nome: a.nome,
        descricao: a.descricao ?? undefined,
        quote: a.quote ?? undefined,
        foto: toImageRef(resolveArquitetoImage(a.imagem), a.nome),
      })),
      localizacao: {
        endereco: emp.localizacao?.endereco ?? undefined,
        cidade: 'Itapema',
        uf: 'SC',
        lat: emp.localizacao?.lat ?? undefined,
        lng: emp.localizacao?.lon ?? undefined,
        iframeSrc: emp.localizacao?.iframe_src ?? undefined,
      },
    } satisfies Empreendimento;
  });

  empreendimentosCache.sort((a, b) => a.ordemDestaque - b.ordemDestaque);
  return empreendimentosCache;
}

export function getEmpreendimento(slug: string): Empreendimento | null {
  return getEmpreendimentos().find((e) => e.slug === slug) ?? null;
}

export function getAllSlugs(): string[] {
  return getEmpreendimentos().map((e) => e.slug);
}

// ——— institucional ———————————————————————————————————————————————————————

let institucionalCache: Institucional | null = null;

export function getInstitucional(): Institucional {
  if (institucionalCache) return institucionalCache;

  const sobre = JSON.parse(readFileSync(join(EXTRACAO_DIR, 'sobre.json'), 'utf8'));
  const s = sobre.secoes;

  institucionalCache = {
    manifestoTitulo: s.manifesto.titulo,
    manifestoVersos: s.manifesto.paragrafos,
    missaoTitulo: s.missao.titulo,
    missaoTexto: s.missao.texto,
    missaoImagem: {
      src: `${IMAGES_PUBLIC_ROOT}/_institucional/missao.png`,
      alt: 'Missão Sunprime',
    },
    valores: s.valores.lista,
    anoFundacao: s.quemSomos.fundacao_ano,
    ceo: {
      nome: s.quemSomos.ceo.nome,
      cargo: s.quemSomos.ceo.cargo,
      foto: {
        src: `${IMAGES_PUBLIC_ROOT}/_institucional/ceo-eduardo-pastor.png`,
        alt: s.quemSomos.ceo.nome,
      },
      headline: s.quemSomos.ceo.headline_1,
      paragrafos: s.quemSomos.ceo.paragrafos,
    },
    quoteDna: {
      texto: s.quemSomos.quote_dna.texto,
      autor: s.quemSomos.ceo.nome,
      imagem: {
        src: `${IMAGES_PUBLIC_ROOT}/_institucional/quote-dna.png`,
        alt: 'DNA Sunprime',
      },
    },
    taglineFinal: s.quemSomos.tagline_final,
  };

  return institucionalCache;
}

// ——— configuração do site ————————————————————————————————————————————————

let configCache: ConfiguracaoSite | null = null;

export function getConfiguracaoSite(): ConfiguracaoSite {
  if (configCache) return configCache;

  const sobre = JSON.parse(readFileSync(join(EXTRACAO_DIR, 'sobre.json'), 'utf8'));
  const r = sobre.rodape;

  configCache = {
    tagline: r.tagline,
    endereco: r.endereco,
    telefone: r.telefone,
    whatsapp: r.whatsapp,
    whatsappUrl: r.whatsapp_url,
    email: r.email,
    horarioAtendimento: r.horario,
    redesSociais: Object.entries(r.redes_sociais ?? {}).map(([plataforma, url]) => ({
      plataforma,
      url: url as string,
    })),
    menuPrincipal: [
      { label: 'Empreendimentos', url: '/empreendimentos' },
      { label: 'Sobre', url: '/sobre' },
      { label: 'Contato', url: '/contato' },
    ],
  };

  return configCache;
}

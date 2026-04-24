# Relatório — Fase 1: Extração de conteúdo do site atual

**Data:** 2026-04-24
**Fonte:** https://www.sunprime.com.br/

## 1. Imagens baixadas

| Categoria | Arquivos | Tamanho |
|---|---|---|
| Capas dos 11 empreendimentos | 11 | ~3,1 MB |
| Galeria + render + adicional + logo por empreendimento | 155 | ~95 MB |
| Imagens de arquitetos/parceiros (biblioteca compartilhada) | 10 | ~4,4 MB |
| Institucional (/sobre: missão, CEO, quote DNA) | 3 | ~1,8 MB |
| **TOTAL** | **178** | **~100 MB** |

Detalhamento por empreendimento (capa + render + logo + adicional + galeria):
| Empreendimento | Arquivos | Status |
|---|---|---|
| Orgânica | 20 | Pré-lançamento |
| Sion | 23 | Pré-lançamento |
| Era | 27 | Em construção |
| Plural | 20 | Em construção |
| Futura | 10 | Em construção |
| Sunstar Ocean Tower | 12 | Em construção |
| Sunhaus Tower | 12 | Em construção |
| Sunsky Tower | 13 | Entregue |
| Sunview Tower | 10 | Entregue |
| Suncool Tower | 10 | Entregue |
| Château Excellence | 8 | Entregue |

> ⚠️ **Observação sobre qualidade:** imagens são PNG/JPG sem otimização, em 72dpi, algumas em resoluções modestas. Na Fase 2 converterei tudo para WebP com qualidade 85% e carregamento progressivo via Sanity Image Pipeline. **Flag no checklist final:** pedir fotos em alta resolução originais ao marketing da Sunprime.

## 2. /sobre — conteúdo extraído (ver `sobre.json`)

Conteúdo muito mais rico do que o documento-briefing sugeria. Descobertas:

- **Manifesto** (7 versos): "Somos um organismo efervescente..."
- **Missão**: "Impactar a vida das pessoas através do design e da arquitetura, proporcionando experiências únicas."
- **4 valores**: Fé, Criatividade, Integridade, Autenticidade (com descrições)
- **CEO identificado**: **Eduardo Pastor** (foto disponível)
- **Ano de fundação**: **2012**
- **Quote marcante**: *"Eu carrego no meu DNA o empreendedorismo. A inquietação de sair do status quo e buscar aquilo que tem mais atual e autêntico."* — Eduardo Pastor
- **Tagline de fechamento**: "Nunca é apenas um prédio vindo da Sunprime."
- **Headline CEO**: "Cada projeto da Sunprime conta uma história."

### Analytics/integrações detectadas (pra replicar/substituir):
- GA4: `G-R6LH1NWWC0`
- reCAPTCHA v3 site-key: `6LcJA_IrAAAAAHh8PuKFz0R4Fo4wTXMkfbJFyL3v`
- RD Station loader: `759da3b0-1053-45b6-a92b-e9b3ac7e2ffb`

> **Flag:** perguntar à Sunprime se querem manter essas integrações (GA4/RD Station) ou trocar por GA4 novo + Resend/HubSpot.

## 3. /blog — SITUAÇÃO (ver `blog.json`)

**A página /blog retorna 404 real.** Achados:

- O menu desktop tem o `<li>` do Blog **comentado** no HTML (desativado manualmente).
- O rodapé ainda lista "Blog" como link ativo — link quebrado.
- Não há sitemap.xml (404).
- Robots.txt não bloqueia nada útil, mas também não revela URLs de posts.

**Recomendação:** implementar schema `postBlog` no Sanity conforme planejado, mas deixar rota `/blog` **oculta** no menu principal até a Sunprime decidir retomar. Se existir arquivo de posts antigos no backend, pedir export.

## 4. /empreendimentos — extração detalhada (ver `empreendimentos-detalhados.json`)

Todos os **11/11 empreendimentos** com conteúdo extraído com sucesso:

| Empreendimento | Descrição | Galeria | Arquitetos | Adicional | Localização GPS |
|---|---|---|---|---|---|
| Suncool Tower | ✓ | 6 imgs | 0 | ✓ | ✓ |
| Sunsky Tower | ✓ | 9 imgs | 1 | ✓ | ✓ |
| Sunview Tower | ✓ | 6 imgs | 1 | ✓ | ✓ |
| Château Excellence | ✓ | 4 imgs | 0 | ✓ | ✓ |
| Plural | ✓ | 17 imgs | 0 | ✓ | ✓ |
| Era | ✓ | 23 imgs | 1 | ✓ | ✓ |
| Futura | ✓ | 6 imgs | **2** (Chiro Arq + Plantar Ideias) | ✓ | ✓ |
| Sunhaus Tower | ✓ | 8 imgs | 1 | ✓ | ✓ |
| Sunstar Ocean Tower | ✓ | 8 imgs | **2** | ✓ | ✓ |
| Sion | ✓ | 20 imgs | **2** | ✓ | ✓ |
| Orgânica | ✓ | 16 imgs | **2** | ✓ | ✓ |

**Dados ricos extraídos de cada empreendimento que NÃO estavam no briefing:**
- ✅ **Descrições longas em prosa** (média ~150–400 palavras cada — ótimas para SEO)
- ✅ **Ficha técnica expandida** (exemplo Futura: "Futura Residences: 144 unidades / 2600m² de lazer / Tipo 01-02 com 181m² (4 suítes) / Tipo 03-04 com 137m² (3 suítes). Futura Flats by Housi: 94 flats / 2500m² de lazer / 42m² até 107m². Área total: 59000m²")
- ✅ **Coordenadas GPS** via Google Maps iframe (lat/lon extraídos)
- ✅ **Escritórios de arquitetura e parceiros** com foto + descrição + quote
  - Escritórios identificados: **Chiro Arq**, **Plantar Ideias**, e outros (biblioteca em `_arquitetos/`)
- ✅ **Hotsite do Futura**: `http://sunprime.com.br/futura` (hotsite separado — conferir se mantém)
- ✅ **Disclaimer legal de pré-lançamento** (art. Lei 4.591/64 — pode reusar no novo site)

## 5. Descobertas adicionais / discrepâncias vs. briefing

1. **Blog está quebrado** (briefing pedia migração de posts — mas não há posts para migrar).
2. **O briefing diz "manifesto + valores + propósito + quem somos" mas o site atual organiza como manifesto + missão + valores + quem somos** (diferente de "propósito"). Vou seguir a estrutura real do site.
3. **Futura tem hotsite separado** (`sunprime.com.br/futura`) — não foi mencionado no briefing. Precisa decidir se migramos esse hotsite pra dentro do novo site ou mantemos externo.
4. **Ficha técnica do Era está incompleta no briefing** (diz "46 pavimentos / 72 apês" mas o site tem detalhes de tipologia que não foram listados). Dados do site são MAIS completos — seguirei o princípio do briefing mas ENRIQUECEREI com os dados extraídos.

## 6. Arquivos gerados

```
/Users/jpoliveira/sunprime-redesign/
├── _extracao/
│   ├── sobre.json                          (conteúdo institucional)
│   ├── blog.json                           (relatório 404)
│   ├── empreendimentos-detalhados.json     (11 empreendimentos expandidos)
│   ├── download-list.txt                   (registro dos 165 downloads)
│   ├── extract.py                          (extrator HTML → JSON)
│   ├── download_images.py                  (downloader concorrente)
│   ├── raw-html/                           (12 HTMLs fonte, ~240KB)
│   └── RELATORIO-FASE-1.md                 (este arquivo)
└── public/extracted-images/
    ├── _institucional/                     (3 imgs sobre)
    ├── _arquitetos/                        (10 imgs de biblioteca compartilhada)
    └── [slug]/
        ├── capa.{png,jpg}
        ├── render/
        ├── logo/
        ├── adicional/
        └── galeria/                         (múltiplas imgs)
```

## 7. Pronto para Fase 2?

Fase 1 completa. Aguardando **OK** para prosseguir com:
- Setup Next.js 14 App Router + TypeScript + Tailwind v4
- Design tokens "Vertical Cinema" (paleta preta/dourada/oceano, Fraunces + Inter + JetBrains Mono)
- Sanity Studio embedado + schemas (empreendimento, statusEmpreendimento, amenidade, institucional, configuracaoSite, postBlog, redirect)
- Lenis + Framer Motion + R3F

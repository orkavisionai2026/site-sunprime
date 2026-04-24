/**
 * Tipos públicos normalizados — preenchidos tanto pelo mock adapter
 * (lê _extracao/*.json) quanto pelo futuro Sanity adapter.
 * O consumidor (páginas/componentes) não sabe de onde vieram os dados.
 */

export type ImageRef = {
  src: string;
  alt?: string;
  /** Dimensão natural se conhecida — ajuda o Next/Image a dimensionar bem */
  width?: number;
  height?: number;
};

export type StatusEmpreendimento = {
  slug: string;
  titulo: string;
  ordem: number;
  cor: 'gold-500' | 'ocean-500' | 'ink-500';
};

export type Arquiteto = {
  nome: string;
  escritorio?: string;
  descricao?: string;
  quote?: string;
  foto?: ImageRef;
};

export type FichaTecnicaItem = {
  rotulo: string;
  valor: string;
};

export type Tipologia = {
  nome: string;
  metragem?: string;
  suites?: number;
  descricao?: string;
};

export type Localizacao = {
  endereco?: string;
  bairro?: string;
  cidade: string;
  uf: string;
  lat?: number;
  lng?: number;
  iframeSrc?: string;
};

export type Empreendimento = {
  slug: string;
  nome: string;
  tagline?: string;
  status: StatusEmpreendimento;
  ordemDestaque: number;
  hotsiteUrl?: string;
  descricao: string[];
  disclaimer?: string;
  capa: ImageRef;
  render?: ImageRef;
  logo?: ImageRef;
  fotoAdicional?: ImageRef;
  galeria: ImageRef[];
  fichaTecnica: FichaTecnicaItem[];
  tipologias: Tipologia[];
  arquitetos: Arquiteto[];
  localizacao?: Localizacao;
};

export type Valor = {
  nome: string;
  descricao: string;
};

export type Institucional = {
  manifestoTitulo: string;
  manifestoVersos: string[];
  missaoTitulo: string;
  missaoTexto: string;
  missaoImagem?: ImageRef;
  valores: Valor[];
  anoFundacao: number;
  ceo: {
    nome: string;
    cargo: string;
    foto?: ImageRef;
    headline: string;
    paragrafos: string[];
  };
  quoteDna: {
    texto: string;
    autor: string;
    imagem?: ImageRef;
  };
  taglineFinal: string;
};

export type RedeSocial = {
  plataforma: string;
  url: string;
};

export type MenuItem = {
  label: string;
  url: string;
  externo?: boolean;
};

export type ConfiguracaoSite = {
  tagline: string;
  endereco: string;
  telefone: string;
  whatsapp?: string;
  whatsappUrl?: string;
  email: string;
  horarioAtendimento?: string;
  redesSociais: RedeSocial[];
  menuPrincipal: MenuItem[];
};

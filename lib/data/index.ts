/**
 * Façade do layer de dados.
 * Hoje: mock (lê _extracao/*.json). Amanhã: troca por Sanity adapter sem mexer nas páginas.
 */

export * from './types';
export {
  getAllSlugs,
  getConfiguracaoSite,
  getEmpreendimento,
  getEmpreendimentos,
  getInstitucional,
} from './mock';

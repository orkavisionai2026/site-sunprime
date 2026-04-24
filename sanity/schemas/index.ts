import type { SchemaTypeDefinition } from 'sanity';

import { amenidade } from './amenidade';
import { configuracaoSite } from './configuracaoSite';
import { empreendimento } from './empreendimento';
import { institucional } from './institucional';
import { postBlog } from './postBlog';
import { redirect } from './redirect';
import { statusEmpreendimento } from './statusEmpreendimento';

export const schemaTypes: SchemaTypeDefinition[] = [
  empreendimento,
  statusEmpreendimento,
  amenidade,
  institucional,
  configuracaoSite,
  postBlog,
  redirect,
];

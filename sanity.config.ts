import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

import { apiVersion, dataset, projectId } from './sanity/env';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  basePath: '/studio',
  name: 'sunprime-studio',
  title: 'Sunprime · Studio',
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            S.listItem()
              .title('Configuração do site')
              .child(
                S.document()
                  .schemaType('configuracaoSite')
                  .documentId('configuracaoSite'),
              ),
            S.listItem()
              .title('Institucional (/sobre)')
              .child(
                S.document().schemaType('institucional').documentId('institucional'),
              ),
            S.divider(),
            S.documentTypeListItem('empreendimento').title('Empreendimentos'),
            S.documentTypeListItem('statusEmpreendimento').title('Status'),
            S.documentTypeListItem('amenidade').title('Amenidades'),
            S.divider(),
            S.documentTypeListItem('postBlog').title('Blog'),
            S.divider(),
            S.documentTypeListItem('redirect').title('Redirects'),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

import { defineArrayMember, defineField, defineType } from 'sanity';

export const configuracaoSite = defineType({
  name: 'configuracaoSite',
  title: 'Configuração do site',
  type: 'document',
  groups: [
    { name: 'marca', title: 'Marca', default: true },
    { name: 'contato', title: 'Contato' },
    { name: 'navegacao', title: 'Navegação' },
    { name: 'integracoes', title: 'Integrações' },
  ],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline da marca',
      type: 'string',
      group: 'marca',
      initialValue: 'Diferente porque você é.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'marca',
    }),
    defineField({
      name: 'logoClara',
      title: 'Logo (versão clara)',
      type: 'image',
      group: 'marca',
    }),

    defineField({
      name: 'endereco',
      title: 'Endereço',
      type: 'string',
      group: 'contato',
      initialValue: 'Rua 294, 294 - Meia Praia, Itapema - SC',
    }),
    defineField({
      name: 'telefone',
      title: 'Telefone',
      type: 'string',
      group: 'contato',
      initialValue: '(47) 3264-0022',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp',
      type: 'string',
      group: 'contato',
    }),
    defineField({
      name: 'whatsappUrl',
      title: 'URL do WhatsApp',
      type: 'url',
      group: 'contato',
    }),
    defineField({
      name: 'email',
      title: 'E-mail',
      type: 'string',
      group: 'contato',
      initialValue: 'contato@sunprime.com.br',
    }),
    defineField({
      name: 'horarioAtendimento',
      title: 'Horário de atendimento',
      type: 'string',
      group: 'contato',
    }),
    defineField({
      name: 'redesSociais',
      title: 'Redes sociais',
      type: 'array',
      group: 'contato',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'rede',
          fields: [
            defineField({
              name: 'plataforma',
              type: 'string',
              title: 'Plataforma',
              options: {
                list: [
                  { title: 'Instagram', value: 'instagram' },
                  { title: 'Facebook', value: 'facebook' },
                  { title: 'LinkedIn', value: 'linkedin' },
                  { title: 'YouTube', value: 'youtube' },
                  { title: 'TikTok', value: 'tiktok' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'url', type: 'url', title: 'URL', validation: (r) => r.required() }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'menuPrincipal',
      title: 'Menu principal',
      type: 'array',
      group: 'navegacao',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (r) => r.required() }),
            defineField({ name: 'url', type: 'string', title: 'URL', validation: (r) => r.required() }),
            defineField({ name: 'externo', type: 'boolean', title: 'Link externo?', initialValue: false }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'ga4Id',
      title: 'GA4 Measurement ID',
      type: 'string',
      group: 'integracoes',
      description: 'Deixar vazio para desativar',
    }),
    defineField({
      name: 'recaptchaSiteKey',
      title: 'reCAPTCHA v3 site key',
      type: 'string',
      group: 'integracoes',
    }),
    defineField({
      name: 'rdStationToken',
      title: 'RD Station loader token',
      type: 'string',
      group: 'integracoes',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Configuração do site' }),
  },
});

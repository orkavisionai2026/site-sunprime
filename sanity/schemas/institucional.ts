import { defineArrayMember, defineField, defineType } from 'sanity';

export const institucional = defineType({
  name: 'institucional',
  title: 'Institucional (/sobre)',
  type: 'document',
  groups: [
    { name: 'manifesto', title: 'Manifesto', default: true },
    { name: 'missao', title: 'Missão & Valores' },
    { name: 'quemSomos', title: 'Quem Somos' },
  ],
  fields: [
    defineField({
      name: 'manifestoTitulo',
      title: 'Título do manifesto',
      type: 'string',
      group: 'manifesto',
      initialValue: 'Nosso manifesto',
    }),
    defineField({
      name: 'manifestoVersos',
      title: 'Versos do manifesto',
      type: 'array',
      group: 'manifesto',
      of: [defineArrayMember({ type: 'text', rows: 2 })],
      description: 'Cada item vira um verso/linha no manifesto',
    }),

    defineField({
      name: 'missaoTitulo',
      title: 'Título da missão',
      type: 'string',
      group: 'missao',
      initialValue: 'Nossa missão',
    }),
    defineField({
      name: 'missaoTexto',
      title: 'Texto da missão',
      type: 'text',
      group: 'missao',
      rows: 3,
    }),
    defineField({
      name: 'missaoImagem',
      title: 'Imagem da missão',
      type: 'image',
      group: 'missao',
      options: { hotspot: true },
    }),

    defineField({
      name: 'valores',
      title: 'Valores',
      type: 'array',
      group: 'missao',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'valor',
          fields: [
            defineField({ name: 'nome', type: 'string', title: 'Nome', validation: (r) => r.required() }),
            defineField({ name: 'descricao', type: 'text', rows: 3, title: 'Descrição' }),
          ],
          preview: { select: { title: 'nome', subtitle: 'descricao' } },
        }),
      ],
    }),

    defineField({
      name: 'anoFundacao',
      title: 'Ano de fundação',
      type: 'number',
      group: 'quemSomos',
      initialValue: 2012,
    }),
    defineField({
      name: 'ceo',
      title: 'CEO',
      type: 'object',
      group: 'quemSomos',
      fields: [
        defineField({ name: 'nome', type: 'string', title: 'Nome' }),
        defineField({ name: 'cargo', type: 'string', title: 'Cargo' }),
        defineField({
          name: 'foto',
          type: 'image',
          title: 'Foto',
          options: { hotspot: true },
        }),
        defineField({ name: 'headline', type: 'string', title: 'Headline' }),
        defineField({
          name: 'paragrafos',
          title: 'Parágrafos',
          type: 'array',
          of: [defineArrayMember({ type: 'text', rows: 3 })],
        }),
      ],
    }),
    defineField({
      name: 'quoteDna',
      title: 'Quote "DNA"',
      type: 'object',
      group: 'quemSomos',
      fields: [
        defineField({ name: 'texto', type: 'text', rows: 3, title: 'Texto' }),
        defineField({ name: 'autor', type: 'string', title: 'Autor' }),
        defineField({
          name: 'imagem',
          type: 'image',
          title: 'Imagem de fundo',
          options: { hotspot: true },
        }),
      ],
    }),
    defineField({
      name: 'taglineFinal',
      title: 'Tagline final',
      type: 'string',
      group: 'quemSomos',
      initialValue: 'Nunca é apenas um prédio vindo da Sunprime.',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Institucional — /sobre' }),
  },
});

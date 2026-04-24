import { defineArrayMember, defineField, defineType } from 'sanity';

export const empreendimento = defineType({
  name: 'empreendimento',
  title: 'Empreendimento',
  type: 'document',
  groups: [
    { name: 'basico', title: 'Básico', default: true },
    { name: 'conteudo', title: 'Conteúdo' },
    { name: 'midia', title: 'Mídia' },
    { name: 'tecnico', title: 'Ficha técnica' },
    { name: 'localizacao', title: 'Localização' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      group: 'basico',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basico',
      options: { source: 'nome', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (frase-assinatura)',
      type: 'string',
      group: 'basico',
      description: 'Ex: "Be Cool, Suncool."',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'reference',
      to: [{ type: 'statusEmpreendimento' }],
      group: 'basico',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ordemDestaque',
      title: 'Ordem de destaque',
      type: 'number',
      group: 'basico',
      description: 'Quanto menor, mais cedo aparece na home/listagem',
      initialValue: 100,
    }),
    defineField({
      name: 'hotsiteUrl',
      title: 'Hotsite externo (opcional)',
      type: 'url',
      group: 'basico',
      description: 'Apenas se o empreendimento mantiver hotsite próprio (ex: /futura)',
    }),

    defineField({
      name: 'descricao',
      title: 'Descrição longa',
      type: 'array',
      group: 'conteudo',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Destaque', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Itálico', value: 'em' },
              { title: 'Negrito', value: 'strong' },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'disclaimer',
      title: 'Disclaimer legal',
      type: 'text',
      group: 'conteudo',
      rows: 4,
      description:
        'Texto de pré-lançamento (art. Lei 4.591/64) ou outro aviso legal que acompanha o empreendimento',
    }),
    defineField({
      name: 'amenidades',
      title: 'Amenidades',
      type: 'array',
      group: 'conteudo',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'amenidade' }] })],
    }),
    defineField({
      name: 'arquitetos',
      title: 'Arquitetos e parceiros',
      type: 'array',
      group: 'conteudo',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'arquiteto',
          fields: [
            defineField({ name: 'nome', type: 'string', title: 'Nome', validation: (r) => r.required() }),
            defineField({ name: 'escritorio', type: 'string', title: 'Escritório' }),
            defineField({ name: 'descricao', type: 'text', rows: 3, title: 'Descrição' }),
            defineField({ name: 'quote', type: 'text', rows: 3, title: 'Quote' }),
            defineField({
              name: 'foto',
              type: 'image',
              title: 'Foto',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'nome', subtitle: 'escritorio', media: 'foto' },
          },
        }),
      ],
    }),

    defineField({
      name: 'capa',
      title: 'Capa (hero)',
      type: 'image',
      group: 'midia',
      options: { hotspot: true },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'render',
      title: 'Render principal',
      type: 'image',
      group: 'midia',
      options: { hotspot: true },
    }),
    defineField({
      name: 'logo',
      title: 'Logo do empreendimento',
      type: 'image',
      group: 'midia',
      description: 'PNG transparente de preferência',
    }),
    defineField({
      name: 'fotoAdicional',
      title: 'Foto adicional (atmosfera)',
      type: 'image',
      group: 'midia',
      options: { hotspot: true },
    }),
    defineField({
      name: 'galeria',
      title: 'Galeria',
      type: 'array',
      group: 'midia',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' }),
            defineField({ name: 'legenda', type: 'string', title: 'Legenda' }),
          ],
        }),
      ],
    }),

    defineField({
      name: 'fichaTecnica',
      title: 'Ficha técnica',
      type: 'array',
      group: 'tecnico',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'item',
          fields: [
            defineField({ name: 'rotulo', type: 'string', title: 'Rótulo', validation: (r) => r.required() }),
            defineField({ name: 'valor', type: 'string', title: 'Valor', validation: (r) => r.required() }),
          ],
          preview: {
            select: { title: 'rotulo', subtitle: 'valor' },
          },
        }),
      ],
    }),
    defineField({
      name: 'tipologias',
      title: 'Tipologias',
      type: 'array',
      group: 'tecnico',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tipologia',
          fields: [
            defineField({ name: 'nome', type: 'string', title: 'Nome (ex: Tipo 01)' }),
            defineField({ name: 'metragem', type: 'string', title: 'Metragem (ex: 181m²)' }),
            defineField({ name: 'suites', type: 'number', title: 'Suítes' }),
            defineField({ name: 'descricao', type: 'text', rows: 2, title: 'Descrição' }),
            defineField({
              name: 'planta',
              type: 'image',
              title: 'Planta',
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: 'nome', subtitle: 'metragem', media: 'planta' },
          },
        }),
      ],
    }),

    defineField({
      name: 'localizacao',
      title: 'Localização',
      type: 'object',
      group: 'localizacao',
      fields: [
        defineField({ name: 'endereco', type: 'string', title: 'Endereço' }),
        defineField({ name: 'bairro', type: 'string', title: 'Bairro' }),
        defineField({ name: 'cidade', type: 'string', title: 'Cidade', initialValue: 'Itapema' }),
        defineField({ name: 'uf', type: 'string', title: 'UF', initialValue: 'SC' }),
        defineField({
          name: 'geo',
          title: 'Coordenadas',
          type: 'geopoint',
        }),
      ],
    }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      fields: [
        defineField({ name: 'title', type: 'string', title: 'Title' }),
        defineField({ name: 'description', type: 'text', rows: 3, title: 'Description' }),
        defineField({
          name: 'ogImage',
          type: 'image',
          title: 'OG Image (1200×630)',
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: 'Destaque',
      name: 'destaqueAsc',
      by: [{ field: 'ordemDestaque', direction: 'asc' }],
    },
    {
      title: 'Nome (A→Z)',
      name: 'nomeAsc',
      by: [{ field: 'nome', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'nome',
      subtitle: 'status.titulo',
      media: 'capa',
    },
  },
});

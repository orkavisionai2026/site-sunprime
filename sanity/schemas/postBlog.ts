import { defineArrayMember, defineField, defineType } from 'sanity';

export const postBlog = defineType({
  name: 'postBlog',
  title: 'Post do blog',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titulo', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'resumo',
      title: 'Resumo',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'capa',
      title: 'Capa',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publicadoEm',
      title: 'Publicado em',
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'autor',
      title: 'Autor',
      type: 'string',
    }),
    defineField({
      name: 'categorias',
      title: 'Categorias',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'corpo',
      title: 'Corpo',
      type: 'array',
      of: [
        defineArrayMember({ type: 'block' }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: 'Texto alternativo' })],
        }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
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
      title: 'Mais recentes',
      name: 'publicadoDesc',
      by: [{ field: 'publicadoEm', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'publicadoEm', media: 'capa' },
    prepare: ({ title, subtitle, media }) => ({
      title,
      subtitle: subtitle ? new Date(subtitle).toLocaleDateString('pt-BR') : '—',
      media,
    }),
  },
});

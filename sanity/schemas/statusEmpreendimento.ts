import { defineField, defineType } from 'sanity';

export const statusEmpreendimento = defineType({
  name: 'statusEmpreendimento',
  title: 'Status de empreendimento',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description: 'Ex: Pré-lançamento, Em construção, Entregue',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titulo', maxLength: 48 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'ordem',
      title: 'Ordem de exibição',
      type: 'number',
      description: 'Quanto menor, mais cedo aparece na listagem',
      initialValue: 0,
    }),
    defineField({
      name: 'cor',
      title: 'Cor de destaque',
      type: 'string',
      description: 'Token do design system (ex: gold-500, ocean-500)',
      options: {
        list: [
          { title: 'Gold', value: 'gold-500' },
          { title: 'Ocean', value: 'ocean-500' },
          { title: 'Ink', value: 'ink-500' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'titulo', subtitle: 'ordem' },
    prepare: ({ title, subtitle }) => ({
      title,
      subtitle: `ordem: ${subtitle ?? '—'}`,
    }),
  },
});

import { defineField, defineType } from 'sanity';

export const amenidade = defineType({
  name: 'amenidade',
  title: 'Amenidade',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'nome', maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'icone',
      title: 'Ícone',
      type: 'string',
      description:
        'Nome do ícone (lucide-react). Ex: waves, sun, dumbbell, trees, wine',
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição curta',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {
        list: [
          { title: 'Lazer', value: 'lazer' },
          { title: 'Esporte & bem-estar', value: 'esporte' },
          { title: 'Conveniência', value: 'conveniencia' },
          { title: 'Social', value: 'social' },
          { title: 'Vista', value: 'vista' },
        ],
      },
    }),
  ],
  preview: {
    select: { title: 'nome', subtitle: 'categoria' },
  },
});

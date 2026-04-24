import { defineField, defineType } from 'sanity';

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  fields: [
    defineField({
      name: 'de',
      title: 'De (path de origem)',
      type: 'string',
      description: 'Ex: /empreendimento/5/72',
      validation: (r) =>
        r.required().custom((val) => {
          if (typeof val !== 'string') return 'Obrigatório';
          if (!val.startsWith('/')) return 'Deve começar com /';
          return true;
        }),
    }),
    defineField({
      name: 'para',
      title: 'Para (destino)',
      type: 'string',
      description: 'Path interno (/empreendimentos/suncool-tower) ou URL absoluta',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'permanente',
      title: 'Redirect permanente (301)?',
      type: 'boolean',
      initialValue: true,
      description: 'Desmarque para 307 temporário',
    }),
    defineField({
      name: 'observacao',
      title: 'Observação',
      type: 'text',
      rows: 2,
      description: 'Motivo/origem do redirect (ex: rota do site antigo)',
    }),
  ],
  preview: {
    select: { title: 'de', subtitle: 'para', permanente: 'permanente' },
    prepare: ({ title, subtitle, permanente }) => ({
      title,
      subtitle: `${permanente ? '301' : '307'} → ${subtitle ?? '—'}`,
    }),
  },
});

/**
 * Env do Sanity.
 * No scaffolding (Fase 2) os valores podem estar vazios — a home funciona sem Sanity.
 * Ao acessar /studio sem projectId, o Sanity Studio mostra erro claro no próprio shell.
 * Antes de ir para produção, preencher `.env.local` com base em `.env.local.example`.
 */

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-24';

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';

export const readToken = process.env.SANITY_API_READ_TOKEN || '';

export const useCdn = false;

if (typeof window === 'undefined' && !projectId) {
  // eslint-disable-next-line no-console
  console.warn(
    '[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID não configurado — /studio e queries vão falhar até preencher .env.local',
  );
}

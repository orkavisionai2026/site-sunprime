/**
 * Studio Sanity embedado em /studio.
 * projectId/dataset vêm de `sanity.config.ts` (env vars NEXT_PUBLIC_SANITY_*).
 */

import Studio from './Studio';

export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  return <Studio />;
}

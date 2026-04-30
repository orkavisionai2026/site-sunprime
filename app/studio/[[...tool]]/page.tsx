/**
 * No export estático o Studio Sanity não é incluído (requer runtime de servidor).
 * Em dev (npm run dev) o Studio funciona normalmente via next dev.
 */

export const dynamic = 'force-static';
export const revalidate = 0;

export async function generateStaticParams() {
  return [{ tool: ['index'] }];
}

export const metadata = {
  title: 'Sunprime · Studio',
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return null;
}

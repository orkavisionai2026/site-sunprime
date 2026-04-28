import { Instrument_Serif } from 'next/font/google';

/**
 * Tipografia Sunprime — set editorial:
 *  - Times New Roman: serif default (system font, sem download)
 *  - Satoshi Regular: sans body (carregado via Fontshare em globals.css/layout)
 *  - Instrument Serif Italic: italic accent (Google Fonts via next/font)
 */
export const instrumentSerif = Instrument_Serif({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-instrument-serif',
  display: 'swap',
  weight: '400',
  style: 'italic',
});

import { readFileSync } from 'fs';

const html = readFileSync('.next-analyze/analyze/client.html', 'utf8');
const match = html.match(/window\.chartData\s*=\s*(\[[\s\S]*?\]);/);
if (!match) {
  console.error('chartData not found');
  process.exit(1);
}
const chunks = JSON.parse(match[1]);

const fmt = (n) => `${(n / 1024).toFixed(1)} kB`;

function flattenModules(node, acc = [], prefix = '') {
  if (node.groups && node.groups.length) {
    for (const g of node.groups) {
      flattenModules(g, acc, prefix);
    }
  } else {
    acc.push({ label: node.path || node.label, parsed: node.parsedSize ?? 0, gzip: node.gzipSize ?? 0 });
  }
  return acc;
}

function topModulesOfChunk(chunk, n = 5) {
  const mods = flattenModules(chunk);
  mods.sort((a, b) => b.parsed - a.parsed);
  return mods.slice(0, n);
}

const target = process.argv[2];

function chunkSummary(c) {
  return `${c.label}  parsed=${fmt(c.parsedSize)}  gzip=${fmt(c.gzipSize)}`;
}

// 1) All chunks summary
console.log('=== ALL CHUNKS (sorted by parsedSize desc) ===');
const all = chunks.slice().sort((a, b) => b.parsedSize - a.parsedSize);
for (const c of all) console.log(chunkSummary(c));

// 2) Targeted reports
const wanted = [
  /fd9d1056/,            // shared 53.6 kB
  /^static\/chunks\/117/,// shared 31.7 kB
  /^static\/chunks\/503/,// 38.9 kB async
  /^static\/chunks\/603/,// 30.8 kB async
  /^static\/chunks\/233/,// 25.9 kB async
  /^static\/chunks\/878/,// 13.2 kB async
  /empreendimentos\/\[slug\]/, // route /empreendimentos/[slug]
  /\(site\)\/page/,      // route /
];

console.log('\n=== TOP 5 MODULES PER TARGETED CHUNK ===');
for (const re of wanted) {
  const c = chunks.find((c) => re.test(c.label));
  if (!c) { console.log(`\n[NOT FOUND] ${re}`); continue; }
  console.log(`\n--- ${c.label}  (parsed ${fmt(c.parsedSize)}, gzip ${fmt(c.gzipSize)}) ---`);
  const top = topModulesOfChunk(c, 5);
  for (const m of top) console.log(`  ${fmt(m.parsed)} (gzip ${fmt(m.gzip)})  ${m.label}`);
}

import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const base = new URL('../public/assets/', import.meta.url);
await mkdir(base, { recursive: true });
const root = 'https://globalk.com.br/wp-content/uploads/';
const assets = [
  ['logo', '2025/11/LogoGlobalK.png', 'logo'],
  ['economize', '2025/11/economize-2-1024x683.webp', 'photo'],
  ['multik', '2025/11/multik1.png', 'photo'],
  ['multik-detail', '2025/11/multik2.png', 'photo'],
  ['safek', '2025/11/WhatsApp-Image-2025-11-19-at-13.41.49-819x1024.jpeg', 'photo'],
  ['tradek', '2025/11/Image_fx-1.png', 'photo'],
  ['brand-economize', '2025/10/economize.png', 'brand'],
  ['brand-multik', '2025/10/multik-1.png', 'brand'],
  ['brand-safek', '2025/10/safek-1.png', 'brand'],
  ['brand-tradek', '2025/11/tradek.png', 'brand'],
];
const results = [];
for (const [name, path, type] of assets) {
  const response = await fetch(root + path);
  if (!response.ok) throw new Error(`Asset ${name}: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  if (type === 'photo') {
    for (const width of [480, 960]) {
      const result = await sharp(buffer).rotate().resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(fileURLToPath(new URL(`${name}-${width}.webp`, base)));
      results.push({ name: `${name}-${width}`, bytes: result.size, width: result.width, height: result.height });
    }
  } else {
    const result = await sharp(buffer).trim().resize({ width: 500, withoutEnlargement: true }).webp({ lossless: true }).toFile(fileURLToPath(new URL(`${name}.webp`, base)));
    results.push({ name, bytes: result.size, width: result.width, height: result.height });
  }
}
await writeFile(new URL('sources.json', base), JSON.stringify({ source: 'https://globalk.com.br/', assets: assets.map(([name, path]) => ({ name, source: root + path })), outputs: results }, null, 2));
const fonts = [
  ['satoshi-regular', 'https://cdn.fontshare.com/wf/TTX2Z3BF3P6Y5BQT3IV2VNOK6FL22KUT/7QYRJOI3JIMYHGY6CH7SOIFRQLZOLNJ6/KFIAZD4RUMEZIYV6FQ3T3GP5PDBDB6JY.woff2'],
  ['satoshi-medium', 'https://cdn.fontshare.com/wf/P2LQKHE6KA6ZP4AAGN72KDWMHH6ZH3TA/ZC32TK2P7FPS5GFTL46EU6KQJA24ZYDB/7AHDUZ4A7LFLVFUIFSARGIWCRQJHISQP.woff2'],
  ['satoshi-bold', 'https://cdn.fontshare.com/wf/LAFFD4SDUCDVQEXFPDC7C53EQ4ZELWQI/PXCT3G6LO6ICM5I3NTYENYPWJAECAWDD/GHM6WVH6MILNYOOCXHXB5GTSGNTMGXZR.woff2'],
  ['playfair-regular', 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-400-normal.woff2'],
  ['playfair-italic', 'https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-400-italic.woff2'],
];
await mkdir(new URL('fonts/', base), { recursive: true });
for (const [name, url] of fonts) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Font ${name}: ${response.status}`);
  await writeFile(new URL(`fonts/${name}.woff2`, base), Buffer.from(await response.arrayBuffer()));
}
console.log(JSON.stringify(results, null, 2));

import { readFile, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const assets = new URL('../public/assets/', import.meta.url);
const darkLetters = (input = 'SourceGraphic', color = '#171717') => `<feColorMatrix in="${input}" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  20 20 20 0 -52" result="white-letters"/><feFlood flood-color="${color}" result="ink"/><feComposite in="ink" in2="white-letters" operator="in" result="dark-letters"/><feMerge><feMergeNode in="${input}"/><feMergeNode in="dark-letters"/></feMerge>`;
// Keep the original artwork embedded intact. Native SVG compositing removes
// the dark background while retaining the white and colored brand marks.
for (const [source, target] of [
  ['brand-multik-horizontal.png', 'brand-multik-transparent.svg'],
  ['brand-safek-horizontal.png', 'brand-safek-transparent.svg'],
  ['brand-tradek-official.png', 'brand-tradek-transparent.svg'],
]) {
  const data = (await readFile(new URL(source, assets))).toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="667" height="667" viewBox="0 0 667 667"><defs><filter id="clear-background" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  8 8 8 0 -2.6"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs><image width="667" height="667" href="data:image/png;base64,${data}" filter="url(#clear-background)"/></svg>`;
  await writeFile(new URL(target, assets), svg);
  const dark = svg.replace('<feComposite in2="SourceGraphic" operator="in"/>', `<feComposite in2="SourceGraphic" operator="in" result="clean"/>${darkLetters('clean')}`);
  await writeFile(new URL(target.replace('-transparent.svg', '-on-light.svg'), assets), dark);
}

// The 'o' in 'eco' has a transparent counter at x=97..117, y=29..47.
// Pink sits beneath the unchanged source so the original white contour stays intact.
const economize = (await readFile(new URL('brand-economize.webp', assets))).toString('base64');
await writeFile(new URL('brand-economize-pink.svg', assets),
  `<svg xmlns="http://www.w3.org/2000/svg" width="398" height="60" viewBox="0 0 398 60"><ellipse cx="107" cy="38" rx="12" ry="13" fill="#ff4f9a"/><image width="398" height="60" href="data:image/webp;base64,${economize}"/></svg>`);
await writeFile(new URL('brand-economize-on-light.svg', assets),
  `<svg xmlns="http://www.w3.org/2000/svg" width="398" height="60" viewBox="0 0 398 60"><defs><filter id="dark"><feColorMatrix type="matrix" values="0 0 0 0 .09  0 0 0 0 .09  0 0 0 0 .09  0 0 0 1 0"/></filter></defs><ellipse cx="107" cy="38" rx="12" ry="13" fill="#ff4f9a"/><image width="398" height="60" href="data:image/webp;base64,${economize}" filter="url(#dark)"/></svg>`);
const globalk = (await readFile(new URL('logo.webp', assets))).toString('base64');
await writeFile(new URL('brand-globalk-on-light.svg', assets),
  `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="193" viewBox="0 0 500 193"><defs><filter id="dark" color-interpolation-filters="sRGB">${darkLetters('SourceGraphic', '#b20c08')}</filter></defs><image width="500" height="193" href="data:image/webp;base64,${globalk}" filter="url(#dark)"/></svg>`);
// Remove the white matte at source resolution, before browser resizing.
// Filtering a bitmap inside SVG thresholds the already scaled pixels and
// produces jagged edges at small logo sizes. Preserve fractional coverage.
for (const brand of ['nanium', 'realize']) {
  const { data, info } = await sharp(fileURLToPath(new URL(`brand-${brand}-source.png`, assets))).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const alpha = 1 - Math.min(r, g, b) / 255;
    const color = [r, g, b].map(c => alpha > 0 ? Math.max(0, Math.min(255, (c - 255 * (1 - alpha)) / alpha)) : 0);
    if (brand === 'nanium') {
      const purple = Math.min(1, Math.max(0, (b - g) / Math.max(1, 255 - g)));
      for (let c = 0; c < 3; c++) rgba[j + c] = Math.round(255 * (1 - purple) + color[c] * purple);
    } else {
      for (let c = 0; c < 3; c++) rgba[j + c] = Math.round(color[c]);
    }
    rgba[j + 3] = Math.round(alpha * 255);
  }
  const png = await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toBuffer();
  await writeFile(new URL(`brand-${brand}-transparent.png`, assets), png);
  await writeFile(new URL(`brand-${brand}-transparent.svg`, assets),
    `<svg xmlns="http://www.w3.org/2000/svg" width="${info.width}" height="${info.height}" viewBox="0 0 ${info.width} ${info.height}"><image width="${info.width}" height="${info.height}" href="data:image/png;base64,${png.toString('base64')}"/></svg>`);
}
console.log('Transparent brand artwork prepared.');

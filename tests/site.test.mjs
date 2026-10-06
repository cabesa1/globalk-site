import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import vm from 'node:vm';
import { SITE_URL } from '../src/seo.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const ptPaths = ['/', '/globalk/', '/economize/', '/multik/', '/safek/', '/tradek/', '/our-history/'];
const paths = [...ptPaths, ...ptPaths.map(path => `/en${path}`), ...ptPaths.map(path => `/es${path}`)];
const docs = new Map();
for (const path of paths) docs.set(path, parseHTML(await readFile(resolve(root, `.${path}/index.html`), 'utf8')).document);

test('Todas as páginas possuem estrutura semântica, SEO e contato acessível', async () => {
  const titles = new Set();
  for (const [path, document] of docs) {
    assert.equal(document.documentElement.lang, path.startsWith('/en/') ? 'en' : path.startsWith('/es/') ? 'es' : 'pt-BR', path);
    assert.equal(document.querySelectorAll('h1').length, 1, path);
    assert.equal(document.querySelectorAll('main').length, 1, path);
    assert.ok(document.querySelector('meta[name="viewport"]')?.content.includes('width=device-width'), path);
    assert.ok(document.querySelector('meta[name="description"]')?.content.length > 50, path);
    assert.equal(document.querySelector('link[rel="canonical"]').href, `${SITE_URL}${path}`);
    assert.equal(document.querySelector('meta[name="robots"]').content, 'index,follow,max-image-preview:large', path);
    assert.equal(document.querySelector('meta[property="og:url"]').content, `${SITE_URL}${path}`, path);
    const socialImage = document.querySelector('meta[property="og:image"]').content;
    assert.equal(socialImage, `${SITE_URL}/assets/social-card-${path.startsWith('/en/') ? 'en' : path.startsWith('/es/') ? 'es' : 'pt'}.png`, path);
    assert.ok((await stat(resolve(root, `.${new URL(socialImage).pathname}`))).isFile(), path);
    const basePath = path.replace(/^\/(en|es)(?=\/)/, '');
    for (const equivalent of [basePath, `/en${basePath}`, `/es${basePath}`]) {
      assert.ok(document.querySelector(`.language-switcher a[href="${equivalent}"]`), `Language switch: ${path} -> ${equivalent}`);
    }
    assert.equal(document.querySelectorAll('link[rel="alternate"][hreflang]').length, 4, path);
    const graph = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
    assert.equal(graph[0].url, `${SITE_URL}${path}`, path);
    assert.equal(graph[0].inLanguage, path.startsWith('/en/') ? 'en' : path.startsWith('/es/') ? 'es' : 'pt-BR', path);
    if (['/', '/en/', '/es/'].includes(path)) {
      assert.ok(graph.some(node => node['@type'] === 'Organization' && node.taxID === '18.228.061/0001-76'), path);
    } else {
      assert.ok(graph.some(node => node['@type'] === 'BreadcrumbList' && node.itemListElement[1].item === `${SITE_URL}${path}`), path);
    }
    assert.ok(document.querySelector('a[href^="mailto:"]'), path);
    assert.ok(document.querySelector('a[href="tel:+551132305636"]'), path);
    assert.ok(document.querySelector('label[for="contact-topic"]'), path);
    assert.equal(document.querySelectorAll('form').length, 0, 'Sem formulários que simulem entrega');
    const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
    assert.equal(ids.length, new Set(ids).size, `IDs duplicados em ${path}`);
    assert.ok(!titles.has(document.title), `Título duplicado: ${path}`);
    titles.add(document.title);
  }
});

test('Links e âncoras locais resolvem corretamente, inclusive entre páginas', async () => {
  for (const [path, document] of docs) {
    for (const anchor of document.querySelectorAll('a[href]')) {
      const href = anchor.getAttribute('href');
      assert.ok(href && href !== '#', `Link sem destino: ${path}`);
      const url = new URL(href, `${SITE_URL}${path}`);
      if (url.origin !== SITE_URL) continue;
      const target = docs.get(url.pathname);
      assert.ok(target, `Página inexistente: ${href} em ${path}`);
      if (url.hash) assert.ok(target.getElementById(decodeURIComponent(url.hash.slice(1))), `Âncora inexistente: ${href} em ${path}`);
    }
  }
});

test('Todos os recursos diretos são locais e existem; imagens possuem dimensões e alt', async () => {
  for (const [path, document] of docs) {
    for (const element of document.querySelectorAll('img[src], script[src], link[rel="stylesheet"], link[rel="preload"], link[rel="icon"]')) {
      const resource = element.getAttribute('src') || element.getAttribute('href');
      assert.ok(resource.startsWith('/'), `Dependência externa: ${resource}`);
      assert.ok((await stat(resolve(root, `.${resource}`))).isFile(), `${path}: ${resource}`);
    }
    for (const image of document.querySelectorAll('img')) {
      assert.ok(image.getAttribute('alt')?.trim(), `Imagem sem descrição: ${path}`);
      assert.ok(Number(image.getAttribute('width')) > 0 && Number(image.getAttribute('height')) > 0);
      for (const source of (image.getAttribute('srcset') || '').split(',').filter(Boolean)) {
        assert.ok((await stat(resolve(root, `.${source.trim().split(' ')[0]}`))).isFile());
      }
    }
  }
  const css = await readFile(resolve(root, 'styles.css'), 'utf8');
  for (const [, font] of css.matchAll(/url\('([^']+)'\)/g)) assert.ok((await stat(resolve(root, `.${font}`))).isFile());
});

test('Imagens de conteúdo ficam abaixo de 150 KB e HTML abaixo de 60 KB por página', async () => {
  const assets = new Set([...docs.values()].flatMap(doc => [...doc.querySelectorAll('img[src]')].map(el => el.getAttribute('src'))));
  for (const asset of assets) assert.ok((await stat(resolve(root, `.${asset}`))).size < 150_000, asset);
  for (const path of paths) assert.ok((await stat(resolve(root, `.${path}/index.html`))).size < 60_000, path);
});

test('Correções editoriais: nenhuma meta apresentada como conquista ou bloco copiado', () => {
  assert.ok(!docs.get('/tradek/').querySelector('main').textContent.includes('Open Box'));
  assert.ok(!docs.get('/economize/').querySelector('h1').textContent.includes('Market Entry'));
  assert.ok(!docs.get('/our-history/').querySelector('main').textContent.includes('maior compradora'));
  for (const document of docs.values()) {
    assert.ok(!document.querySelector('a[href*="multik.com"]'));
    assert.ok(!document.querySelector('iframe, video'));
    for (const heading of document.querySelectorAll('h1,h2,h3')) assert.ok(heading.textContent.length < 130, heading.textContent);
  }
});

test('JavaScript inicializa sem bibliotecas externas e atualiza o assunto do contato', async () => {
  const code = await readFile(resolve(root, 'app.js'), 'utf8');
  for (const path of paths) {
    const { document, window } = parseHTML(await readFile(resolve(root, `.${path}/index.html`), 'utf8'));
    window.matchMedia = () => ({ matches: true, addEventListener() {} });
    const context = { document, window, location: new URL(`${SITE_URL}${path}`), URL, encodeURIComponent, requestAnimationFrame: fn => fn() };
    vm.runInNewContext(code, context);
    const select = document.querySelector('#contact-topic');
    Object.defineProperty(select, 'value', { configurable: true, value: 'Multi-K' });
    select.dispatchEvent(new window.Event('change'));
    const href = document.querySelector('#topic-email').getAttribute('href');
    const emailURL = new URL(href);
    assert.equal(emailURL.protocol, 'mailto:');
    assert.equal(emailURL.pathname, 'globalk@globalk.com.br');
    assert.equal(emailURL.searchParams.get('subject'), `${path.startsWith('/en/') ? 'Website inquiry' : path.startsWith('/es/') ? 'Consulta desde el sitio web' : 'Contato pelo site'} — Multi-K`);
  }
});

test('Sitemap contém todas as páginas e não inclui páginas de template', async () => {
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  for (const path of paths) {
    const base = path.replace(/^\/(en|es)(?=\/)/, '');
    const marker = `<url><loc>${SITE_URL}${path}</loc>`;
    const start = sitemap.indexOf(marker);
    const entry = start < 0 ? '' : sitemap.slice(start + marker.length, sitemap.indexOf('</url>', start));
    assert.ok(entry, path);
    for (const [lang, target] of [['pt-BR', base], ['en', `/en${base}`], ['es', `/es${base}`], ['x-default', base]]) {
      assert.ok(entry.includes(`hreflang="${lang}" href="${SITE_URL}${target}"`), `${path}: ${lang}`);
    }
  }
  assert.equal((sitemap.match(/<loc>/g) || []).length, 21);
  assert.equal((sitemap.match(/<xhtml:link /g) || []).length, 84);
  assert.ok(!sitemap.includes('wpr_templates'));
  assert.ok(!sitemap.includes('<lastmod>'), 'Do not invent update dates');
  const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
  assert.equal(robots, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  const notFound = parseHTML(await readFile(resolve(root, '404.html'), 'utf8')).document;
  assert.equal(notFound.querySelector('meta[name="robots"]').content, 'noindex,follow');
  assert.ok(!notFound.querySelector('link[rel="canonical"], script[type="application/ld+json"]'));
});

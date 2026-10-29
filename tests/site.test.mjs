import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import vm from 'node:vm';
import { SITE_URL } from '../src/seo.mjs';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const ptPaths = ['/', '/globalk/', '/economize/', '/multik/', '/safek/', '/tradek/', '/nanium/', '/realize/'];
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
    if (['/economize/', '/safek/', '/tradek/', '/nanium/', '/realize/'].some(slug => path.endsWith(slug))) {
      assert.ok(!document.querySelector('#contato, a[href="#contato"], a[href^="mailto:"]'), path);
      if (path.endsWith('/realize/')) assert.equal(document.querySelector('a[href^="tel:"]')?.getAttribute('href'), 'tel:+551531424188', path);
      else assert.ok(!document.querySelector('a[href^="tel:"]'), path);
    } else {
      assert.ok(document.querySelector('a[href^="mailto:"]'), path);
      assert.ok(document.querySelector('a[href="tel:+551132305636"]'), path);
      assert.ok(document.querySelector('label[for="contact-topic"]'), path);
    }
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
  assert.ok(!docs.get('/').querySelector('main').textContent.includes('maior compradora'));
  for (const document of docs.values()) {
    assert.ok(!document.querySelector('a[href*="multik.com"]'));
    assert.ok(!document.querySelector('video'));
    if (document.body.classList.contains('page-economize') || document.body.classList.contains('page-home')) {
      const maps = [...document.querySelectorAll('iframe')];
      assert.equal(maps.length, 1);
      assert.equal(new URL(maps[0].src).hostname, 'www.google.com');
      assert.ok(maps[0].title && maps[0].getAttribute('loading') === 'lazy');
      assert.ok(maps[0].src.includes('Galp%C3%A3o%20E'));
    } else assert.ok(!document.querySelector('iframe'));
    for (const heading of document.querySelectorAll('h1,h2,h3')) assert.ok(heading.textContent.length < 130, heading.textContent);
  }
});

test('Scroll timeline keeps all eight milestones readable in each language', () => {
  for (const locale of ['', '/en', '/es']) {
    const path = `${locale}/`;
    const document = docs.get(path);
    const items = [...document.querySelectorAll('.timeline-scroll .timeline-item')];
    assert.equal(items.length, 8, path);
    assert.ok(document.querySelector('.timeline-track[aria-hidden="true"] .timeline-progress'), path);
    assert.equal(document.querySelectorAll('#trajetoria').length, 1, path);
    assert.ok(!document.querySelector('.units-section, .history-preview'), path);
    for (const item of items) {
      assert.ok(item.querySelector('.timeline-year')?.textContent.trim(), path);
      assert.ok(item.querySelector('h3.timeline-title')?.textContent.trim(), path);
      assert.ok(item.querySelector('.timeline-copy>p')?.textContent.trim(), path);
    }
    assert.deepEqual(items.map(item => [...item.querySelectorAll('.timeline-brands img')].map(image => image.alt)), [[], [], [], [], ['Economize'], ['Multi-K'], ['Safe-K', 'Trade-K'], ['Economize']], path);
    assert.equal(items.at(-1).querySelector('.timeline-year').textContent, '2026', path);
  }
});

test('Retired history pages redirect to the home timeline and are not generated', async () => {
  const config = JSON.parse(await readFile(resolve(root, '../vercel.json'), 'utf8'));
  for (const locale of ['', '/en', '/es']) {
    await assert.rejects(stat(resolve(root, `.${locale}/our-history/index.html`)), { code: 'ENOENT' });
    assert.ok(config.redirects.some(rule => rule.source === `${locale}/our-history/:path*` && rule.destination === `${locale}/#trajetoria` && rule.permanent));
  }
});

test('Home globe has a responsive canvas and a no-JavaScript fallback in each language', () => {
  for (const path of ['/', '/en/', '/es/']) {
    const globe = docs.get(path).querySelector('.hero-art .globe');
    assert.ok(globe, path);
    assert.ok(globe.querySelector('canvas.globe-canvas'), path);
    assert.ok(globe.querySelector('svg.globe-fallback circle'), path);
  }
});

test('Business paths and calls to action match their destinations in every language', () => {
  for (const locale of ['', '/en', '/es']) {
    const home = docs.get(`${locale}/`);
    const expected = ['economize', 'multik', 'safek', 'tradek', 'nanium', 'realize'];
    assert.equal(home.querySelector('.needs-root').getAttribute('href'), `${locale}/globalk/`);
    assert.deepEqual([...home.querySelectorAll('.needs-grid a')].map(a => new URL(a.href, SITE_URL).pathname), expected.map(slug => `${locale}/${slug}/`));
    assert.ok(home.querySelector('.statement-action[href="#contato"]')?.textContent.trim());

    const economy = docs.get(`${locale}/economize/`);
    assert.ok(!economy.querySelector('.intent-grid'));
    assert.ok(!/parceria|partnership|alianza/i.test(economy.querySelector('main').textContent));
    assert.ok(/open.box/i.test(economy.querySelector('h1').textContent));
    assert.equal(economy.querySelectorAll('.unit-hero-copy a.button').length, 1);
    assert.equal(economy.querySelector('.unit-hero-copy a.button').href, 'https://economize.vc/');
    assert.equal(economy.querySelector('.unit-cta a.button').href, 'https://economize.vc/');

    const multi = docs.get(`${locale}/multik/`);
    assert.ok(multi.querySelector('.unit-hero-media img[src*="multik-960.webp"]'));
    assert.equal(multi.querySelector('.unit-hero-copy .button').getAttribute('href'), '#contato');
    assert.ok(!/Conhecer os produtos|Explore the products|Conocer los productos/.test(multi.querySelector('.unit-hero-copy .button').textContent));

    const safe = docs.get(`${locale}/safek/`);
    assert.ok(safe.querySelector('.unit-hero-media img[src*="safek-studio-960.webp"]'));
    assert.equal(safe.querySelectorAll('.service-list li').length, 3);

    const trade = docs.get(`${locale}/tradek/`);
    assert.ok(trade.querySelector('.unit-hero-media img[src*="tradek-960.webp"]'));
    assert.equal(trade.querySelectorAll('.service-list li').length, 2);
    for (const [document, destination] of [[safe, 'https://safek.com.br/'], [trade, 'https://www.tradek.com.br/']]) {
      assert.ok(!document.querySelector('.unit-cta, #contato'));
      assert.equal(document.querySelectorAll('.unit-hero-copy a.button').length, 1);
      assert.equal(document.querySelector('.unit-hero-copy a.button').href, destination);
    }

    const history = docs.get(`${locale}/`);
    assert.ok(history.querySelector('.timeline-related a[href$="/multik/"]'));
    assert.ok(history.querySelector('.timeline-related a[href$="/tradek/"]'));
    for (const document of [home, multi, history]) {
      assert.ok(document.querySelector('.contact-flow-note')?.textContent.trim().length > 60);
      assert.ok(document.querySelector('#topic-email[href^="mailto:"]'));
    }
  }
});

test('Mobile view keeps the globe fallback without starting canvas rendering', async () => {
  const code = await readFile(resolve(root, 'app.js'), 'utf8');
  const { document, window } = parseHTML(await readFile(resolve(root, 'index.html'), 'utf8'));
  let canvasStarts = 0;
  document.querySelector('.globe-canvas').getContext = () => { canvasStarts++; return null; };
  window.matchMedia = query => ({ matches: !query.includes('min-width: 960px'), addEventListener() {} });
  vm.runInNewContext(code, { document, window, location: new URL('https://globalk-site.vercel.app/'), URL, encodeURIComponent, requestAnimationFrame: fn => fn() });
  assert.equal(canvasStarts, 0);
  assert.ok(!document.querySelector('.globe').classList.contains('is-ready'));
});

test('JavaScript inicializa sem bibliotecas externas e atualiza o assunto do contato', async () => {
  const code = await readFile(resolve(root, 'app.js'), 'utf8');
  for (const path of paths) {
    const { document, window } = parseHTML(await readFile(resolve(root, `.${path}/index.html`), 'utf8'));
    window.matchMedia = () => ({ matches: true, addEventListener() {} });
    const context = { document, window, location: new URL(`${SITE_URL}${path}`), URL, encodeURIComponent, requestAnimationFrame: fn => fn() };
    vm.runInNewContext(code, context);
    const select = document.querySelector('#contact-topic');
    if (['/economize/', '/safek/', '/tradek/', '/nanium/', '/realize/'].some(slug => path.endsWith(slug))) {
      assert.equal(select, null);
      continue;
    }
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
  assert.equal((sitemap.match(/<loc>/g) || []).length, 24);
  assert.equal((sitemap.match(/<xhtml:link /g) || []).length, 96);
  assert.ok(!sitemap.includes('wpr_templates'));
  assert.ok(!sitemap.includes('<lastmod>'), 'Do not invent update dates');
  const robots = await readFile(resolve(root, 'robots.txt'), 'utf8');
  assert.equal(robots, `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
  const notFound = parseHTML(await readFile(resolve(root, '404.html'), 'utf8')).document;
  assert.equal(notFound.querySelector('meta[name="robots"]').content, 'noindex,follow');
  assert.ok(!notFound.querySelector('link[rel="canonical"], script[type="application/ld+json"]'));
  assert.equal(notFound.querySelectorAll('h1').length, 1);
  for (const href of ['/', '/#orientacao', '#contato']) {
    const link = notFound.querySelector(`main a[href="${href}"]`);
    assert.ok(link, `404 missing recovery link ${href}`);
    const target = new URL(href, SITE_URL);
    assert.ok(docs.get(target.pathname)?.getElementById(target.hash.slice(1)) || (target.hash === '' && docs.has(target.pathname)) || href === '#contato');
  }
});

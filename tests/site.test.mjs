import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import vm from 'node:vm';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const ptPaths = ['/', '/globalk/', '/economize/', '/multik/', '/safek/', '/tradek/', '/our-history/'];
const paths = [...ptPaths, ...ptPaths.map(path => `/en${path}`)];
const docs = new Map();
for (const path of paths) docs.set(path, parseHTML(await readFile(resolve(root, `.${path}/index.html`), 'utf8')).document);

test('Todas as páginas possuem estrutura semântica, SEO e contato acessível', () => {
  const titles = new Set();
  for (const [path, document] of docs) {
    assert.equal(document.documentElement.lang, path.startsWith('/en/') ? 'en' : 'pt-BR', path);
    assert.equal(document.querySelectorAll('h1').length, 1, path);
    assert.equal(document.querySelectorAll('main').length, 1, path);
    assert.ok(document.querySelector('meta[name="viewport"]')?.content.includes('width=device-width'), path);
    assert.ok(document.querySelector('meta[name="description"]')?.content.length > 50, path);
    assert.equal(document.querySelector('link[rel="canonical"]').href, `https://globalk.com.br${path}`);
    const equivalent = path.startsWith('/en/') ? path.slice(3) : `/en${path}`;
    assert.ok(document.querySelector(`.language-switcher a[href="${equivalent}"]`), `Language switch: ${path}`);
    assert.equal(document.querySelectorAll('link[rel="alternate"][hreflang]').length, 3, path);
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
      const url = new URL(href, `https://globalk.com.br${path}`);
      if (url.origin !== 'https://globalk.com.br') continue;
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
    const context = { document, window, location: new URL(`https://globalk.com.br${path}`), URL, encodeURIComponent, requestAnimationFrame: fn => fn() };
    vm.runInNewContext(code, context);
    const select = document.querySelector('#contact-topic');
    Object.defineProperty(select, 'value', { configurable: true, value: 'Multi-K' });
    select.dispatchEvent(new window.Event('change'));
    const href = document.querySelector('#topic-email').getAttribute('href');
    const emailURL = new URL(href);
    assert.equal(emailURL.protocol, 'mailto:');
    assert.equal(emailURL.pathname, 'globalk@globalk.com.br');
    assert.equal(emailURL.searchParams.get('subject'), `${path.startsWith('/en/') ? 'Website inquiry' : 'Contato pelo site'} — Multi-K`);
  }
});

test('Sitemap contém todas as páginas e não inclui páginas de template', async () => {
  const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
  for (const path of paths) assert.ok(sitemap.includes(`<loc>https://globalk.com.br${path}</loc>`));
  assert.equal((sitemap.match(/<loc>/g) || []).length, 14);
  assert.ok(!sitemap.includes('wpr_templates'));
});

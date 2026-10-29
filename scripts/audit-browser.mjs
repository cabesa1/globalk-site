import { spawn } from 'node:child_process';
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';

const base = 'http://localhost:5173';
const selectedPaths = process.argv.find(argument => argument.startsWith('--paths='))?.slice(8).split(',');
const paths = selectedPaths || (process.argv.includes('--home-only') ? ['/'] : process.argv.includes('--safe-trade-only') ? ['/safek/', '/tradek/'] : process.argv.includes('--economize-only') ? ['/economize/'] : ['/', '/globalk/', '/economize/', '/multik/', '/safek/', '/tradek/', '/nanium/', '/realize/']);
const routes = [...paths, ...paths.map(path => `/en${path}`), ...paths.map(path => `/es${path}`)];
const widths = [360, 390, 768, 1400];
const output = join(tmpdir(), `globalk-audit-${Date.now()}`);
const profile = await mkdtemp(join(tmpdir(), 'globalk-chrome-'));
await mkdir(output);
const chrome = process.platform === 'win32' ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' : 'google-chrome';
const child = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--remote-debugging-port=0', '--remote-allow-origins=*', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore', windowsHide: true });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function browserPort() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try { return Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]); }
    catch { await delay(100); }
  }
  throw new Error('Chrome DevTools did not start');
}

async function openTab(port) {
  const tab = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
  const socket = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let serial = 0;
  const pending = new Map();
  socket.onmessage = event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const item = pending.get(message.id);
    if (!item) return;
    pending.delete(message.id);
    if (message.error) item.reject(new Error(message.error.message));
    else item.resolve(message.result);
  };
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++serial;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  return { socket, send };
}

const auditScript = `(() => {
  window.__audit = { lcp: 0, cls: 0, shifts: [] };
  try { new PerformanceObserver(list => { for (const item of list.getEntries()) window.__audit.lcp = Math.round(item.startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  try { new PerformanceObserver(list => { for (const item of list.getEntries()) if (!item.hadRecentInput) { window.__audit.cls += item.value; if (item.value > .03) window.__audit.shifts.push({ value: item.value, nodes: item.sources?.map(source => source.node?.className || source.node?.tagName).slice(0, 3) }); } }).observe({ type: 'layout-shift', buffered: true }); } catch {}
})()`;

let tab;
try {
  const port = await browserPort();
  tab = await openTab(port);
  await tab.send('Page.enable');
  await tab.send('Runtime.enable');
  await tab.send('Page.addScriptToEvaluateOnNewDocument', { source: auditScript });
  const results = [];
  const motionOnly = process.argv.includes('--motion-only');
  for (const width of ((process.argv.includes('--interactions-only') || motionOnly) ? [] : widths)) {
    await tab.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width <= 390 });
    await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    for (const path of routes) {
      await tab.send('Page.navigate', { url: `${base}${path}` });
      for (let attempt = 0; attempt < 40; attempt++) {
        const ready = await tab.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
        if (ready.result.value === 'complete') break;
        await delay(50);
      }
      await tab.send('Runtime.evaluate', { expression: 'document.fonts.ready.then(() => true)', awaitPromise: true, returnByValue: true });
      await delay(120);
      const expression = `({path:location.pathname,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,title:document.title,h1:document.querySelector('h1')?.textContent.trim(),lcp:window.__audit?.lcp,cls:window.__audit?.cls,shifts:window.__audit?.shifts,brokenImages:[...document.images].filter(i=>i.getBoundingClientRect().top<innerHeight && (!i.complete||i.naturalWidth===0)).map(i=>i.src),horizontal:[...document.querySelectorAll('body *')].filter(e=>e.getBoundingClientRect().right>innerWidth+2 && getComputedStyle(e).position!=='fixed').slice(0,5).map(e=>({tag:e.tagName,class:e.className?.baseVal||e.className}))})`;
      const measured = await tab.send('Runtime.evaluate', { expression, returnByValue: true });
      const item = measured.result.value;
      results.push(item);
      if (width === 390 || width === 1400) {
        await tab.send('Runtime.evaluate', { expression: `Promise.all([...document.images].map(image => { image.loading = 'eager'; return image.decode().catch(() => null); }))`, awaitPromise: true, returnByValue: true });
        if (path.includes('/economize/')) await delay(1800);
        const shot = await tab.send('Page.captureScreenshot', { format: 'jpeg', quality: 85, captureBeyondViewport: true });
        const name = `${width}-${path.replaceAll('/', '-') || 'home'}.jpg`;
        await writeFile(join(output, name), Buffer.from(shot.data, 'base64'));
      }
      process.stdout.write(`${width} ${path} overflow=${item.scrollWidth - item.width} lcp=${item.lcp ?? '-'} cls=${item.cls ?? '-'}\n`);
    }
  }
  const interactions = [];
  for (const interactionWidth of (motionOnly ? [390, 1400] : [390])) {
  await tab.send('Emulation.setDeviceMetricsOverride', { width: interactionWidth, height: 900, deviceScaleFactor: 1, mobile: interactionWidth <= 390 });
  await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: motionOnly ? 'no-preference' : 'reduce' }] });
  for (const locale of ['', '/en', '/es']) {
    await tab.send('Page.navigate', { url: `${base}${locale}/` });
    for (let attempt = 0; attempt < 40; attempt++) {
      const ready = await tab.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
      if (ready.result.value === 'complete') break;
      await delay(50);
    }
    await delay(120);
    const before = await tab.send('Runtime.evaluate', { expression: `({items:document.querySelectorAll('.timeline-item').length,enhanced:document.querySelector('.timeline-shell').classList.contains('is-enhanced'),progress:parseFloat(getComputedStyle(document.querySelector('.timeline-shell')).getPropertyValue('--timeline-progress'))||0})`, returnByValue: true });
    let scrub = null;
    if (motionOnly) {
      await tab.send('Runtime.evaluate', { expression: `document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0, 0)` });
      await delay(100);
      const heroSnapshot = `({scene:document.querySelector('.hero').classList.contains('scroll-scene'),progress:parseFloat(document.querySelector('.hero').style.getPropertyValue('--scene-progress')),transform:getComputedStyle(document.querySelector('.hero-art')).transform})`;
      const heroStart = (await tab.send('Runtime.evaluate', { expression: heroSnapshot, returnByValue: true })).result.value;
      await tab.send('Runtime.evaluate', { expression: `window.scrollTo(0, 240)` });
      await delay(100);
      const heroMoved = (await tab.send('Runtime.evaluate', { expression: heroSnapshot, returnByValue: true })).result.value;
      await delay(200);
      const heroHeld = (await tab.send('Runtime.evaluate', { expression: heroSnapshot, returnByValue: true })).result.value;
      if (!heroStart.scene || heroMoved.progress <= heroStart.progress || heroMoved.transform === heroStart.transform || heroMoved.transform !== heroHeld.transform) throw new Error('Hero scroll motion failed');
      await tab.send('Runtime.evaluate', { expression: `(() => { document.documentElement.style.scrollBehavior='auto'; const unit = document.querySelector('.needs-grid a'); window.scrollTo(0, scrollY + unit.getBoundingClientRect().top - innerHeight * .765); })()` });
      await delay(120);
      const treeSnapshot = `(() => { const tree = document.querySelector('.needs-tree'); const unit = tree.querySelector('.needs-grid a'); return { enhanced:tree.classList.contains('is-scroll-enhanced'), opacity:parseFloat(getComputedStyle(unit).opacity), progress:parseFloat(unit.style.getPropertyValue('--unit-progress')), branches:tree.querySelectorAll('.needs-branches path').length }; })()`;
      const treePartial = (await tab.send('Runtime.evaluate', { expression: treeSnapshot, returnByValue: true })).result.value;
      await delay(250);
      const treeHeld = (await tab.send('Runtime.evaluate', { expression: treeSnapshot, returnByValue: true })).result.value;
      if (!treePartial.enhanced || treePartial.branches !== 6 || treePartial.progress < .1 || treePartial.progress > .9 || treePartial.opacity !== treeHeld.opacity) throw new Error(`Tree scroll scrub failed: ${JSON.stringify({treePartial,treeHeld})}`);
      await tab.send('Runtime.evaluate', { expression: `(() => { const unit = document.querySelector('.needs-grid a'); window.scrollTo(0, scrollY + unit.getBoundingClientRect().top - innerHeight * .45); })()` });
      await delay(100);
      if (locale === '') {
        const shot = await tab.send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
        await writeFile(join(output, `tree-scroll-${interactionWidth}.jpg`), Buffer.from(shot.data, 'base64'));
      }
      await tab.send('Runtime.evaluate', { expression: `(() => { const paragraph = document.querySelector('.group-copy p'); window.scrollTo(0, scrollY + paragraph.getBoundingClientRect().top - innerHeight * .78); })()` });
      await delay(100);
      const textSnapshot = `(() => { const element = document.querySelector('.group-copy p'); return {progress:parseFloat(element.style.getPropertyValue('--reveal-progress')),opacity:parseFloat(getComputedStyle(element).opacity),transform:getComputedStyle(element).transform}; })()`;
      const textPartial = (await tab.send('Runtime.evaluate', { expression: textSnapshot, returnByValue: true })).result.value;
      await delay(200);
      const textHeld = (await tab.send('Runtime.evaluate', { expression: textSnapshot, returnByValue: true })).result.value;
      if (!(textPartial.progress > .1 && textPartial.progress < .95 && textPartial.opacity === textHeld.opacity && textPartial.transform === textHeld.transform)) throw new Error(`Text scroll motion failed: ${JSON.stringify({textPartial,textHeld})}`);
      await tab.send('Runtime.evaluate', { expression: `document.documentElement.style.scrollBehavior='auto'; const dot = document.querySelectorAll('.timeline-dot')[4]; window.scrollTo(0, scrollY + dot.getBoundingClientRect().top + dot.offsetHeight / 2 - innerHeight * .75)` });
      await delay(100);
      const snapshot = `(() => { const item = document.querySelectorAll('.timeline-item')[4]; return { entry:parseFloat(item.style.getPropertyValue('--entry-progress')), logo:parseFloat(item.style.getPropertyValue('--logo-progress')), copy:parseFloat(item.style.getPropertyValue('--copy-progress')), opacity:parseFloat(getComputedStyle(item.querySelector('.timeline-card')).opacity) }; })()`;
      const partial = (await tab.send('Runtime.evaluate', { expression: snapshot, returnByValue: true })).result.value;
      await delay(250);
      const held = (await tab.send('Runtime.evaluate', { expression: snapshot, returnByValue: true })).result.value;
      scrub = { partial, held };
      if (!(partial.entry > .1 && partial.entry < .9 && partial.logo > partial.copy && partial.entry === held.entry && partial.opacity === held.opacity)) throw new Error(`Scroll scrub failed: ${JSON.stringify(scrub)}`);
    }
    await tab.send('Runtime.evaluate', { expression: `document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0, document.documentElement.scrollHeight)` });
    await delay(120);
    const after = await tab.send('Runtime.evaluate', { expression: `({progress:parseFloat(getComputedStyle(document.querySelector('.timeline-shell')).getPropertyValue('--timeline-progress'))||0,active:document.querySelectorAll('.timeline-item.is-active').length,readable:[...document.querySelectorAll('.timeline-card')].every(card=>card.getBoundingClientRect().height>0)})`, returnByValue: true });
    if (motionOnly && locale === '') {
      await tab.send('Runtime.evaluate', { expression: `const last = document.querySelectorAll('.timeline-item')[7]; window.scrollTo(0, scrollY + last.getBoundingClientRect().top - innerHeight * .25); Promise.all([...document.querySelectorAll('.timeline-brands img')].map(image => image.decode().catch(() => null)))`, awaitPromise: true });
      await delay(100);
      const shot = await tab.send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
      await writeFile(join(output, `timeline-logos-${interactionWidth}.jpg`), Buffer.from(shot.data, 'base64'));
    }
    await tab.send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` });
    await delay(120);
    const back = await tab.send('Runtime.evaluate', { expression: `({progress:parseFloat(getComputedStyle(document.querySelector('.timeline-shell')).getPropertyValue('--timeline-progress'))||0,active:document.querySelectorAll('.timeline-item.is-active').length})`, returnByValue: true });
    await tab.send('Runtime.evaluate', { expression: `document.querySelector('.menu-toggle').click()` });
    const menuOpen = await tab.send('Runtime.evaluate', { expression: `document.querySelector('#site-menu').open && document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'true'`, returnByValue: true });
    await tab.send('Runtime.evaluate', { expression: `document.querySelector('.menu-close').click()` });
    await tab.send('Page.navigate', { url: `${base}${locale}/#contato` });
    for (let attempt = 0; attempt < 40; attempt++) {
      const ready = await tab.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
      if (ready.result.value === 'complete') break;
      await delay(50);
    }
    await delay(350);
    await tab.send('Runtime.evaluate', { expression: `document.querySelector('#contato').scrollIntoView()` });
    await delay(80);
    const contact = await tab.send('Runtime.evaluate', { expression: `({top:document.querySelector('#contato').getBoundingClientRect().top,header:document.querySelector('.site-header').getBoundingClientRect().height,menuClosed:!document.querySelector('#site-menu').open,scrollY,scrollHeight:document.documentElement.scrollHeight,clientHeight:document.documentElement.clientHeight,menuClass:document.documentElement.className})`, returnByValue: true });
    const result = { locale: locale || 'pt', width: interactionWidth, scrub, ...before.result.value, finalProgress: after.result.value.progress, active: after.result.value.active, returnProgress: back.result.value.progress, returnActive: back.result.value.active, readable: after.result.value.readable, menuOpen: menuOpen.result.value, ...contact.result.value };
    interactions.push(result);
    if (result.items !== 8 || !result.readable || !result.menuOpen || !result.menuClosed || result.top < result.header - 1 || result.top > 500 || (motionOnly && (!result.enhanced || result.finalProgress < 95 || result.active !== 8 || result.returnProgress > 5 || result.returnActive !== 0)) || (!motionOnly && result.enhanced)) throw new Error(`Interaction check failed: ${JSON.stringify(result)}`);
  }
  if (motionOnly) {
    for (const path of ['/globalk/', '/economize/', '/multik/', '/safek/', '/tradek/']) {
      await tab.send('Page.navigate', { url: `${base}${path}` });
      for (let attempt = 0; attempt < 40; attempt++) {
        const ready = await tab.send('Runtime.evaluate', { expression: 'document.readyState', returnByValue: true });
        if (ready.result.value === 'complete') break;
        await delay(50);
      }
      await delay(100);
      const mediaSnapshot = `({scene:document.querySelector('.unit-hero').classList.contains('scroll-scene'),transform:getComputedStyle(document.querySelector('.unit-photo-frame>img')).transform,overflow:document.documentElement.scrollWidth-innerWidth})`;
      const start = (await tab.send('Runtime.evaluate', { expression: mediaSnapshot, returnByValue: true })).result.value;
      await tab.send('Runtime.evaluate', { expression: `document.documentElement.style.scrollBehavior='auto'; window.scrollTo(0,240)` });
      await delay(100);
      const moved = (await tab.send('Runtime.evaluate', { expression: mediaSnapshot, returnByValue: true })).result.value;
      await delay(150);
      const held = (await tab.send('Runtime.evaluate', { expression: mediaSnapshot, returnByValue: true })).result.value;
      if (!start.scene || moved.transform === start.transform || moved.transform !== held.transform || moved.overflow > 0) throw new Error(`Unit photo scroll failed: ${path} ${interactionWidth}`);
      if (path === '/economize/') {
        const shot = await tab.send('Page.captureScreenshot', { format: 'jpeg', quality: 85 });
        await writeFile(join(output, `unit-scroll-${interactionWidth}.jpg`), Buffer.from(shot.data, 'base64'));
      }
    }
  }
  }
  await writeFile(join(output, 'results.json'), JSON.stringify(results, null, 2));
  await writeFile(join(output, 'interactions.json'), JSON.stringify(interactions, null, 2));
  console.log(`Audit output: ${output}`);
} finally {
  tab?.socket.close();
  child.kill();
  if (profile.startsWith(tmpdir()) && basename(profile).startsWith('globalk-chrome-')) {
    for (let attempt = 0; attempt < 5; attempt++) {
      try { await rm(profile, { recursive: true, force: true }); break; }
      catch (error) { if (error.code !== 'EBUSY' || attempt === 4) break; await delay(150); }
    }
  }
}


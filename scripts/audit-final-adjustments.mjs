import { spawn } from 'node:child_process';
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, basename } from 'node:path';

const base = 'http://localhost:5173';
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

let tab;
const report = { pages: [], keyboard: [], destinations: [], contrast: [] };
const require = (condition, message) => { if (!condition) throw new Error(message); };
try {
  const port = await browserPort();
  tab = await openTab(port);
  await tab.send('Page.enable');
  await tab.send('Runtime.enable');
  await tab.send('Page.bringToFront');
  await tab.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  const evaluate = async expression => {
    const result = await tab.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true, userGesture: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text + ' ' + result.exceptionDetails.exception?.description);
    return result.result.value;
  };
  const navigate = async url => {
    await tab.send('Page.navigate', { url });
    for (let i = 0; i < 100; i++) {
      await delay(50);
      if (await evaluate(`document.readyState==='complete' && location.href.startsWith(${JSON.stringify(url)})`)) break;
    }
    await evaluate('document.fonts.ready.then(()=>true)');
  };
  const key = async (key, code, modifiers = 0) => {
    await tab.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code:key, windowsVirtualKeyCode: code, modifiers, ...(key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{}) });
    await tab.send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: code, modifiers });
  };
  for (const width of (process.argv.includes('--destinations-only') ? [] : [390, 1400])) {
    await tab.send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 390 });
    await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    for (const locale of ['', '/en', '/es']) {
      for (const unit of ['', 'globalk', 'economize', 'multik', 'safek', 'tradek', 'nanium', 'realize']) {
        const path = `${locale}/${unit ? unit + '/' : ''}`;
        await navigate(base + path);
        const state = await evaluate(`(() => {
          const language = document.querySelector('.language-switcher a[aria-current]');
          const links = [...document.querySelectorAll('.language-switcher a,.social-link')];
          const badNames = links.filter(a=>!a.getAttribute('aria-label').includes(a.textContent.trim().replace(/\\s+/g,' '))).map(a=>a.outerHTML);
          const closing = document.querySelector('.unit-continuation');
          const demos = [...document.querySelectorAll('.service-demo img')];
          return {path:location.pathname,width:innerWidth,overflow:document.documentElement.scrollWidth-innerWidth,badNames,language:language.textContent,closing:closing?.nextElementSibling.classList.contains('next-unit')??null,demos:demos.length,brokenDemos:demos.filter(i=>i.complete&&i.naturalWidth===0).length,selected:document.querySelector('#contact-topic')?.value,mail:document.querySelector('#topic-email')?.href,mapHeight:document.querySelector('.store-location iframe')?.getBoundingClientRect().height,photoHeight:document.querySelector('.unit-hero-media img')?.getBoundingClientRect().height};
        })()`);
        require(state.overflow <= 0 && !state.badNames.length && !state.brokenDemos, JSON.stringify(state));
        if (['safek', 'tradek'].includes(unit)) require(state.closing, `Missing closing CTA: ${path}`);
        if (unit === 'safek') require(state.demos === 3, 'Three photos from the new Safe-K site expected');
        if (unit === 'multik') {
          require(state.selected === 'Multi-K' && new URL(state.mail).searchParams.get('subject').includes('Multi-K'), `Wrong Multi-K contact: ${path}`);
          await evaluate(`document.querySelector('.unit-hero-copy .button').click()`);
          await delay(100);
          const anchor = await evaluate(`({top:document.querySelector('#contato').getBoundingClientRect().top,header:document.querySelector('.site-header').getBoundingClientRect().height})`);
          require(anchor.top >= anchor.header, `Contact hidden by header: ${JSON.stringify(anchor)}`);
        }
        if (unit === 'economize' && width === 390) require(state.mapHeight === 180 && state.photoHeight <= 280, 'Mobile Economize media too tall');
        const ax = await tab.send('Accessibility.getFullAXTree');
        require(ax.nodes.some(n=>n.role?.value==='link'&&n.name?.value?.startsWith('PT — Português')), 'AX language label missing');
        report.pages.push(state);
        if (unit) continue;
        const beforeTimeline = await evaluate(`document.querySelector('.ecosystem-contact').getBoundingClientRect().top < document.querySelector('#trajetoria').getBoundingClientRect().top`);
        require(beforeTimeline, 'Contact shortcut must precede timeline');
        await evaluate(`document.querySelector('.ecosystem-contact a').click()`);
        await delay(100);
        const contact = await evaluate(`({top:document.querySelector('#contato').getBoundingClientRect().top,header:document.querySelector('.site-header').getBoundingClientRect().height})`);
        require(contact.top >= contact.header, 'Home contact hidden');
        await evaluate(`window.scrollTo(0,0);document.querySelector('.menu-toggle').focus()`);
        await key('Enter', 13);
        await delay(80);
        require(await evaluate(`document.querySelector('#site-menu').open && document.activeElement.matches('.menu-close')`), 'Keyboard menu opening failed');
        await evaluate(`document.querySelector('#site-menu a:last-of-type').focus();const e=[...document.querySelectorAll('#site-menu a[href],#site-menu button')];e.at(-1).focus()`);
        await key('Tab', 9);
        require(await evaluate(`document.activeElement.matches('.menu-close')`), 'Forward menu focus trap failed');
        await key('Tab', 9, 8);
        require(await evaluate(`document.activeElement === [...document.querySelectorAll('#site-menu a[href],#site-menu button')].at(-1)`), 'Reverse menu focus trap failed');
        await key('Escape', 27);
        require(await evaluate(`!document.querySelector('#site-menu').open && document.activeElement.matches('.menu-toggle') && document.querySelector('.menu-toggle').getAttribute('aria-expanded')==='false'`), 'Escape/return focus failed');
        report.keyboard.push({width,locale:locale||'pt',enter:true,tabLoop:true,escape:true,focusRestored:true});
        const contrast = async state => {
          const colors = await evaluate(`(() => {const a=document.querySelector('.language-switcher a[aria-current]');const s=getComputedStyle(a);return {foreground:s.color,background:s.backgroundColor,outline:s.outlineStyle};})()`);
          const luminance = value => value.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>v/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
          const a=luminance(colors.foreground),b=luminance(colors.background),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);
          require(ratio>=4.5, `Language contrast ${state}: ${ratio}`);
          report.contrast.push({width,locale:locale||'pt',state,ratio,...colors});
        };
        await contrast('normal');
        const point = await evaluate(`(() => {const r=document.querySelector('.language-switcher a[aria-current]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};})()`);
        await tab.send('Input.dispatchMouseEvent', { type:'mouseMoved', ...point });
        await contrast('hover');
        await tab.send('Input.dispatchMouseEvent', { type:'mouseMoved', x:1,y:850 });
        await evaluate(`document.querySelector('.language-switcher a[aria-current]').focus()`);
        const focus = await evaluate(`(() => {const a=document.activeElement;return {visible:a.matches(':focus-visible'),outline:getComputedStyle(a).outlineStyle};})()`);
        require(focus.visible && focus.outline !== 'none', 'Language focus invisible');
        await contrast('focus');
        // Activate the other language with the keyboard, without leaving the corresponding page.
        await evaluate(`document.querySelector('.language-switcher a[hreflang="en"]').focus()`);
        await key('Enter',13);
        await delay(150);
        require(await evaluate(`location.pathname==='/en/'`), 'Language keyboard switch failed');
      }
    }
  }
  // Click the actual external CTAs once per distinct destination; never submit forms.
  for (const [path,selector,expected] of [
    ['/safek/','.unit-continuation .button','https://safek.com.br/'],
    ['/tradek/','.unit-continuation .button','https://www.tradek.com.br/'],
    ['/economize/','.unit-guidance .button','https://economize.vc/condition-guide'],
    ['/economize/','.unit-hero-copy .button','https://economize.vc/'],
  ]) {
    await navigate(base+path);
    const before = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).map(t=>t.id);
    require(await evaluate(`document.querySelector(${JSON.stringify(selector)}).href===${JSON.stringify(expected)}`), 'Wrong external CTA');
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    let target;
    for(let i=0;i<80;i++) {
      await delay(100);
      const tabs=await(await fetch(`http://127.0.0.1:${port}/json/list`)).json();
      target=tabs.find(t=>!before.includes(t.id)&&t.type==='page'&&t.url!=='about:blank');
      if(target)break;
    }
    require(target, `External click did not open expected destination: ${expected}`);
    const socket = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
    let messageId=0;
    const externalEvaluate = () => new Promise(resolve=>{
      const id=++messageId;
      socket.onmessage=e=>{const r=JSON.parse(e.data);if(r.id===id)resolve(r.result?.result?.value ?? null);};
      socket.send(JSON.stringify({id,method:'Runtime.evaluate',params:{expression:`({url:location.href,title:document.title,text:document.body?.innerText.slice(0,1200),ready:document.readyState})`,returnByValue:true}}));
    });
    let external;
    for(let i=0;i<100;i++) {
      await delay(100);
      external=await externalEvaluate();
      if(external?.ready==='complete' && external.text?.length>80)break;
    }
    require(external, 'Destination browser context unavailable');
    require(external.ready==='complete' && external.text?.length>80, `Destination not readable: ${JSON.stringify(external)}`);
    if(expected.includes('condition-guide')) require(/condi|classifica/i.test(external.title+' '+external.text) && !/página não encontrada/i.test(external.text), 'Condition guide not confirmed');
    report.destinations.push({expected,...external});
    socket.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`);
  }
  await writeFile(join(output,'final-adjustments.json'),JSON.stringify(report,null,2));
  console.log(`PASS: ${report.pages.length} page layouts, ${report.keyboard.length} keyboard flows, ${report.contrast.length} contrast states, ${report.destinations.length} external CTA destinations`);
  console.log(`Evidence: ${output}`);
} finally {
  await writeFile(join(output,'final-adjustments.json'),JSON.stringify(report,null,2));
  tab?.socket.close();child.kill();
  if(profile.startsWith(tmpdir())&&basename(profile).startsWith('globalk-chrome-')) {
    for(let i=0;i<5;i++) {try{await rm(profile,{recursive:true,force:true});break;}catch{await delay(150);}}
  }
}


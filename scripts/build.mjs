import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { units, timeline } from '../src/content.mjs';
import { unitsEn, timelineEn } from '../src/english.mjs';
import { unitsEs, timelineEs } from '../src/spanish.mjs';
import { layout, eyebrow, button, arrow, globe, photo, brandArtwork, route, socialLink } from '../src/components.mjs';
import { ecosystemContact, unitGuidance, unitContinuation, serviceMedia, motorcycleImport } from '../src/unit-guidance.mjs';
import { absoluteURL, robotsText, sitemapXML } from '../src/seo.mjs';

const out = new URL('../dist/', import.meta.url);
await mkdir(out, { recursive: true });
// Remove only retired generated routes inside this project's dist directory.
for (const path of ['our-history/', 'en/our-history/', 'es/our-history/']) {
  await rm(new URL(path, out), { recursive: true, force: true });
}
await cp(new URL('../public/', import.meta.url), out, { recursive: true });
async function page(path, html) {
  const folder = new URL(`.${path}`, out);
  await mkdir(folder, { recursive: true });
  await writeFile(new URL('index.html', folder), html);
}

const unitVisual = (unit, hero = false) => hero || !unit.brandCard ? photo(unit.image, unit.alt, { hero }) : brandArtwork(unit.brandCard, unit.brandAlt);
const needsCopy = {
  pt: { title: 'Nosso ecossistema.', intro: 'Conheça as marcas que se conectam pela GlobalK.', items: ['Entrar no mercado brasileiro', 'Comprar produtos Open Box', 'Organizar casa e trabalho', 'Criar ambientes sem uso de celulares', 'Avaliar importação e financiamento', 'Computadores e performance gamer', 'Lotes Open Box para empresas'] },
  en: { title: 'Our ecosystem.', intro: 'Meet the brands connected through GlobalK.', items: ['Enter the Brazilian market', 'Shop open-box products', 'Organize home and work', 'Create phone-free spaces', 'Explore imports and financing', 'Computers and gaming performance', 'Open-box lots for businesses'] },
  es: { title: 'Nuestro ecosistema.', intro: 'Conoce las marcas conectadas por GlobalK.', items: ['Entrar al mercado brasileño', 'Comprar productos Open Box', 'Organizar el hogar y el trabajo', 'Crear espacios sin uso de celulares', 'Evaluar importaciones y financiamiento', 'Computadoras y rendimiento gamer', 'Lotes Open Box para empresas'] },
};
const needsNavigation = (locale) => {
  const copy = needsCopy[locale];
  const groupLabel = locale === 'en' ? 'One group. Many connections.' : locale === 'es' ? 'Un grupo. Muchas conexiones.' : 'Um grupo. Muitas conexões.';
  return `<section class="needs-section section" id="orientacao"><div class="wrap"><div class="needs-heading">${eyebrow(copy.title)}<p>${copy.intro}</p></div><div class="needs-tree"><svg class="needs-branches" aria-hidden="true"></svg><a class="needs-root" href="${route('/globalk/', locale)}"><img class="needs-root-logo" src="/assets/logo.webp" width="500" height="193" alt="GlobalK Group" loading="lazy" decoding="async"><p>${groupLabel}</p></a><nav class="needs-grid" aria-label="${copy.title}">${units.slice(1).map((unit, index) => {
    const square = !unit.brandWordmark && unit.slug !== 'economize';
    const asset = unit.brandWordmark || (unit.slug === 'economize' ? 'brand-economize-pink.svg' : unit.brandCard);
    return `<a class="needs-node" href="${route(`/${unit.slug}/`, locale)}" data-branch="${index}"><span class="needs-unit-name"><img src="/assets/${asset}" width="${unit.brandWidth || (square ? 667 : 398)}" height="${unit.brandHeight || (square ? 667 : 60)}" alt="${unit.name}" loading="lazy" decoding="async"${square ? ' class="needs-logo-square"' : ''}></span><span class="needs-purpose">${copy.items[index + 1]}</span>${arrow(true)}</a>`;
  }).join('')}</nav></div>${ecosystemContact(locale)}</div></section>`;
};
const unitMedia = (unit) => unit.image ? `<figure class="unit-hero-media"><div class="unit-photo-frame">${unitVisual(unit, true)}</div><figcaption><span>${unit.name}</span><span>${unit.imageCaption}</span></figcaption></figure>` : '';
const unitIdentity = (unit) => unit.brandWordmark ? `<img class="unit-page-logo" src="/assets/${unit.brandWordmark}" width="${unit.brandWidth}" height="${unit.brandHeight}" alt="${unit.name}" decoding="async">` : '';
const unitHeroActions = (unit, locale) => {
  if (unit.slug === 'nanium') return '';
  if (unit.slug === 'realize') {
    const label = locale === 'en' ? 'Call Realize' : locale === 'es' ? 'Llamar a Realize' : 'Fale com a Realize';
    return `<div class="direct-phone"><span class="small-label">${label}</span>${button(unit.phone, unit.phoneHref)}</div>`;
  }
  if (['economize', 'safek', 'tradek'].includes(unit.slug)) return button(unit.externalLabel, unit.external, false, true, locale);
  return `${button(unit.contactLabel, '#contato')}${unit.external ? button(unit.externalLabel, unit.external, true, true, locale) : ''}`;
};
const storeCopy = {
    pt: { heading: 'Grandes marcas. Preço justo.', label: 'Nossa loja em Sorocaba', map: 'Mapa da loja Economize no Shopping Panorâmico, Sorocaba', open: 'Abrir no Google Maps' },
    en: { heading: 'Great brands. Fair prices.', label: 'Our store in Sorocaba', map: 'Map of the Economize store at Shopping Panorâmico, Sorocaba', open: 'Open in Google Maps' },
    es: { heading: 'Grandes marcas. Precio justo.', label: 'Nuestra tienda en Sorocaba', map: 'Mapa de la tienda Economize en Shopping Panorâmico, Sorocaba', open: 'Abrir en Google Maps' },
};
const storeLocation = (locale) => {
  const store = storeCopy[locale];
  const query = encodeURIComponent('Economize, Rodovia Raposo Tavares, km 99, Galpão E, Sorocaba, SP');
  return `<div class="store-location"><iframe src="https://www.google.com/maps?q=${query}&amp;output=embed&amp;hl=${locale === 'pt' ? 'pt-BR' : locale}&amp;z=16" title="${store.map}" width="600" height="230" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><div class="store-location-meta"><div><span class="small-label">${store.label}</span><p class="store-address">Shopping Panorâmico · Galpão E<br>Rod. Raposo Tavares, km 99 · Sorocaba, SP</p></div><a href="https://www.google.com/maps?cid=6859955820421224057" target="_blank" rel="noopener noreferrer">${store.open} ${arrow(true)}</a></div></div>`;
};
const homeLocation = (locale) => `<section class="home-location section" id="localizacao" aria-label="${storeCopy[locale].label}"><div class="wrap">${storeLocation(locale)}</div></section>`;
const unitAudience = (unit, locale) => {
  const standard = { pt: 'Para quem é', en: 'Who it’s for', es: 'Para quién es' }[locale];
  const store = storeCopy[locale];
  const map = unit.slug === 'economize' ? storeLocation(locale) : '';
  return `<div class="unit-audience"><span class="small-label">${unit.slug === 'economize' ? store.heading : standard}</span><p>${unit.audience}</p>${map}</div>${socialLink(unit.slug, locale)}`;
};
const consultCopy = {
  pt: { globalk: 'O primeiro contato abre seu aplicativo de e-mail. Conte sobre sua marca para iniciar a conversa; escopo e próximos passos são definidos com a equipe.', multik: 'O contato abre seu aplicativo de e-mail para perguntar sobre produtos e possibilidades de compra. Não há catálogo público neste site.' },
  en: { globalk: 'The first contact opens your email app. Tell us about your brand to begin; scope and next steps are discussed with the team.', multik: 'The contact opens your email app to ask about products and buying options. Multi-K is already selected: describe the product or your needs and send the message from your email app. The team will advise on buying options; there is no public catalogue on this site.' },
  es: { globalk: 'El primer contacto abre tu aplicación de correo. Cuéntanos sobre tu marca para empezar; el alcance y los próximos pasos se conversan con el equipo.', multik: 'El contacto abre tu aplicación de correo para preguntar sobre productos y opciones de compra. Este sitio no tiene un catálogo público.' },
};
const unitFinalCTA = (unit, locale) => unit.slug === 'economize' ? button(unit.externalLabel, unit.external, false, true, locale) : `<p class="unit-consult-note">${consultCopy[locale][unit.slug]}</p>${button(unit.contactLabel, '#contato')}`;
const statementLink = (locale) => {
  const label = locale === 'en' ? 'Contact GlobalK' : locale === 'es' ? 'Contactar a GlobalK' : 'Fale com a GlobalK';
  return `<a href="#contato" class="statement-action">${label} ${arrow(true)}</a>`;
};
const timelineScroll = (items, locale = 'pt') => {
  const label = locale === 'en' ? 'GlobalK milestones' : locale === 'es' ? 'Hitos de GlobalK' : 'Marcos da GlobalK';
  return `<div class="timeline-shell"><div class="timeline-track" aria-hidden="true"><span class="timeline-progress"></span></div><ol class="timeline timeline-scroll" aria-label="${label}">${items.map((item, index) => {
    const related = { 4: ['economize'], 5: ['multik'], 6: ['safek', 'tradek'], 7: ['economize'] }[index] || [];
    const relatedLabel = locale === 'en' ? 'Explore' : locale === 'es' ? 'Conocer' : 'Conheça';
    const logos = related.map(slug => {
      const unit = units.find(unit => unit.slug === slug);
      const square = slug !== 'economize';
      const asset = slug === 'economize' ? 'brand-economize-pink.svg' : unit.brandCard;
      return `<img src="/assets/${asset}" width="${square ? 667 : 398}" height="${square ? 667 : 60}" alt="${unit.name}" loading="lazy" decoding="async"${square ? ' class="timeline-logo-square"' : ''}>`;
    }).join('');
    return `<li class="timeline-item"><span class="timeline-dot" aria-hidden="true"></span><article class="timeline-card">${logos ? `<div class="timeline-brands">${logos}</div>` : ''}<div class="timeline-copy"><span class="timeline-year">${item.year}</span><h3 class="timeline-title">${item.title}</h3><p>${item.text}</p>${related.length ? `<div class="timeline-related">${related.map(slug => `<a href="${route(`/${slug}/`, locale)}">${relatedLabel} ${units.find(unit => unit.slug === slug).name} ${arrow(true)}</a>`).join('')}</div>` : ''}</div></article></li>`;
  }).join('')}</ol></div>`;
};
const heroHeadline = (locale = 'pt') => {
  const english = locale === 'en';
  const spanish = locale === 'es';
  const words = english ? ['brands.', 'products.', 'people.', 'markets.'] : spanish ? ['marcas.', 'productos.', 'personas.', 'mercados.'] : ['marcas.', 'produtos.', 'pessoas.', 'mercados.'];
  const label = english ? 'We connect brands, products, people and markets.' : spanish ? 'Conectamos marcas, productos, personas y mercados.' : 'Conectamos marcas, produtos, pessoas e mercados.';
  return `<h1 class="hero-title" id="hero-title" aria-label="${label}"><span class="hero-title-intro">${english ? 'We connect' : 'Conectamos'}</span><span class="hero-rotator" aria-hidden="true">${words.map(word => `<em class="hero-word">${word}</em>`).join('')}</span></h1>`;
};

const home = `
<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-copy">${eyebrow('Conexões globais. Presença local.')}${heroHeadline('pt')}<p class="hero-lead">Apoiamos marcas internacionais na entrada no Brasil. Nossas unidades atuam com produtos Open Box, organização, ambientes sem uso de celulares e compras internacionais.</p><div class="hero-actions">${button('Encontre sua solução', '#orientacao')}${button('Conheça o grupo', '#grupo', true)}</div></div><div class="hero-art">${globe()}<div class="art-coordinate"><span class="status-dot"></span> BASE NO BRASIL. VISÃO GLOBAL.</div><span class="art-label" aria-hidden="true">CONEXÃO<br>EM MOVIMENTO</span></div><div class="hero-bottom"><span>SOROCABA, SÃO PAULO · BRASIL</span><a href="#orientacao">ENCONTRE SUA UNIDADE <span aria-hidden="true">↓</span></a></div></section>

${needsNavigation('pt')}

<section class="group-section section" id="grupo"><div class="wrap">${eyebrow('O grupo', '01')}<div class="group-grid"><h2 class="display reveal">Diferentes negócios.<br>Uma mesma vontade<br>de <em>ir além.</em></h2><div class="group-copy reveal"><p>A GlobalK reúne negócios que conectam marcas, produtos e pessoas. Da entrada no mercado brasileiro às soluções que fazem parte do dia a dia.</p><p>Com base em Sorocaba, integramos experiência comercial, desenvolvimento de produtos e operação local para abrir novos caminhos.</p></div></div><div class="group-ledger"><div><span class="small-label">NOSSA BASE</span><span>Sorocaba, Brasil</span></div><div><span class="small-label">NOSSA VISÃO</span><span>Conectar possibilidades</span></div><div><span class="small-label">NOSSA ATUAÇÃO</span><span>Marcas, produtos e operações</span></div></div></div></section>

<section class="timeline-section section" id="trajetoria"><div class="wrap timeline-grid"><div class="timeline-intro">${eyebrow('Uma história em movimento')}<h2 class="display">Conexões que<br>se tornam<br><em>caminhos.</em></h2><p>Do desenvolvimento de marcas às novas frentes de atuação do grupo.</p></div>${timelineScroll(timeline, 'pt')}</div></section>
<section class="statement-strip" aria-label="Nossa visão"><div class="wrap"><span class="small-label">A PRÓXIMA CONEXÃO PODE SER A SUA.</span><p>Tem uma marca ou projeto em mente?</p>${statementLink('pt')}</div></section>`;
await page('/', layout({ title: 'GlobalK — Conexões que abrem possibilidades', description: 'Marcas, produtos e operações conectados ao mercado brasileiro. Conheça a GlobalK, Economize, Multi-K, Safe-K e Trade-K.', content: home, afterContact: homeLocation('pt') }));

for (const unit of units) {
  const next = units[(units.indexOf(unit) + 1) % units.length];
  const content = `<section class="unit-hero wrap"><nav class="breadcrumbs" aria-label="Caminho da página"><a href="/">Início</a><span aria-hidden="true">/</span><a href="/#orientacao">Unidades</a><span aria-hidden="true">/</span><span aria-current="page">${unit.name}</span></nav><div class="unit-hero-grid"><div class="unit-hero-copy">${unitIdentity(unit)}${eyebrow(unit.category, unit.number)}<h1 class="display">${unit.title}</h1><p class="unit-lead">${unit.description}</p><div class="hero-actions">${unitHeroActions(unit, 'pt')}</div>${unitAudience(unit, 'pt')}</div>${unitMedia(unit)}</div></section>
  ${unit.services.length ? `<section class="unit-services section" id="solucoes"><div class="wrap services-grid"><div class="services-intro">${eyebrow(unit.slug === 'safek' ? 'Como funciona' : 'O que fazemos')}<h2 class="display reveal">${unit.heading}</h2><p>${unit.intro}</p></div><ol class="service-list">${unit.services.map(([title, text], i) => `<li class="reveal"><span class="service-number">0${i + 1}</span><div><h3>${title}</h3><p>${text}</p>${unitGuidance(unit, 'pt', i)}${serviceMedia(unit, 'pt', i)}</div></li>`).join('')}</ol></div>${unit.secondaryImage ? `<figure class="detail-photo wrap reveal">${photo(unit.secondaryImage, unit.secondaryAlt, { sizes: '(min-width: 960px) 80vw, 100vw' })}<figcaption>${unit.secondaryAlt}</figcaption></figure>` : ''}</section>` : ''}
  ${['safek', 'tradek', 'nanium', 'realize'].includes(unit.slug) ? '' : `<section class="unit-cta section"><div class="wrap">${eyebrow('Encontre sua próxima possibilidade')}<h2 class="display reveal">${unit.cta}</h2>${unitFinalCTA(unit, 'pt')}</div></section>`}
  ${motorcycleImport(unit, 'pt')}
  ${unitContinuation(unit, 'pt')}
  <aside class="next-unit wrap"><span class="small-label">CONTINUE EXPLORANDO O GRUPO</span><a href="/${next.slug}/"><span>${next.name}<small>${next.category}</small></span>${arrow(true)}</a></aside>`;
  await page(`/${unit.slug}/`, layout({ title: `${unit.name} — ${unit.category} | GlobalK`, description: unit.seo, path: `/${unit.slug}/`, current: unit.slug, content }));
}


const homeEn = `
<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-copy">${eyebrow('Global connections. Local presence.')}${heroHeadline('en')}<p class="hero-lead">We help international brands enter Brazil. Our units work with open-box products, organization, phone-free spaces and international purchasing.</p><div class="hero-actions">${button('Find the right unit', '#orientacao')}${button('Meet the group', '#grupo', true)}</div></div><div class="hero-art">${globe('main', 'en')}<div class="art-coordinate"><span class="status-dot"></span> BASED IN BRAZIL. GLOBAL OUTLOOK.</div><span class="art-label" aria-hidden="true">CONNECTIONS<br>IN MOTION</span></div><div class="hero-bottom"><span>SOROCABA, SÃO PAULO · BRAZIL</span><a href="#orientacao">FIND YOUR UNIT <span aria-hidden="true">↓</span></a></div></section>
${needsNavigation('en')}
<section class="group-section section" id="grupo"><div class="wrap">${eyebrow('The group', '01')}<div class="group-grid"><h2 class="display reveal">Different businesses.<br>One drive to<br><em>go further.</em></h2><div class="group-copy reveal"><p>GlobalK brings together businesses that connect brands, products and people. From entering the Brazilian market to solutions for everyday life.</p><p>Based in Sorocaba, we combine commercial experience, product development and local operations to open new paths.</p></div></div><div class="group-ledger"><div><span class="small-label">OUR BASE</span><span>Sorocaba, Brazil</span></div><div><span class="small-label">OUR VISION</span><span>Connecting possibilities</span></div><div><span class="small-label">WHAT WE DO</span><span>Brands, products and operations</span></div></div></div></section>
<section class="timeline-section section" id="trajetoria"><div class="wrap timeline-grid"><div class="timeline-intro">${eyebrow('A story in motion')}<h2 class="display">Connections<br>that become<br><em>new paths.</em></h2><p>From developing brands to the group’s new areas of business.</p></div>${timelineScroll(timelineEn, 'en')}</div></section>
<section class="statement-strip" aria-label="Our vision"><div class="wrap"><span class="small-label">YOUR CONNECTION COULD BE NEXT.</span><p>Have a brand or project in mind?</p>${statementLink('en')}</div></section>`;
await page('/en/', layout({ title: 'GlobalK — Connections that open possibilities', description: 'Brands, products and operations connected to the Brazilian market. Discover GlobalK, Economize, Multi-K, Safe-K and Trade-K.', content: homeEn, locale: 'en', afterContact: homeLocation('en') }));

for (const unit of unitsEn) {
  const next = unitsEn[(unitsEn.indexOf(unit) + 1) % unitsEn.length];
  const content = `<section class="unit-hero wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/en/">Home</a><span aria-hidden="true">/</span><a href="/en/#orientacao">Units</a><span aria-hidden="true">/</span><span aria-current="page">${unit.name}</span></nav><div class="unit-hero-grid"><div class="unit-hero-copy">${unitIdentity(unit)}${eyebrow(unit.category, unit.number)}<h1 class="display">${unit.title}</h1><p class="unit-lead">${unit.description}</p><div class="hero-actions">${unitHeroActions(unit, 'en')}</div>${unitAudience(unit, 'en')}</div>${unitMedia(unit)}</div></section>
  ${unit.services.length ? `<section class="unit-services section" id="solucoes"><div class="wrap services-grid"><div class="services-intro">${eyebrow(unit.slug === 'safek' ? 'How it works' : 'What we do')}<h2 class="display reveal">${unit.heading}</h2><p>${unit.intro}</p></div><ol class="service-list">${unit.services.map(([title, description], i) => `<li class="reveal"><span class="service-number">0${i + 1}</span><div><h3>${title}</h3><p>${description}</p>${unitGuidance(unit, 'en', i)}${serviceMedia(unit, 'en', i)}</div></li>`).join('')}</ol></div>${unit.secondaryImage ? `<figure class="detail-photo wrap reveal">${photo(unit.secondaryImage, unit.secondaryAlt, { sizes: '(min-width: 960px) 80vw, 100vw' })}<figcaption>${unit.secondaryAlt}</figcaption></figure>` : ''}</section>` : ''}
  ${['safek', 'tradek', 'nanium', 'realize'].includes(unit.slug) ? '' : `<section class="unit-cta section"><div class="wrap">${eyebrow('Find your next possibility')}<h2 class="display reveal">${unit.cta}</h2>${unitFinalCTA(unit, 'en')}</div></section>`}
  ${motorcycleImport(unit, 'en')}
  ${unitContinuation(unit, 'en')}
  <aside class="next-unit wrap"><span class="small-label">KEEP EXPLORING THE GROUP</span><a href="/en/${next.slug}/"><span>${next.name}<small>${next.category}</small></span>${arrow(true)}</a></aside>`;
  await page(`/en/${unit.slug}/`, layout({ title: `${unit.name} — ${unit.category} | GlobalK`, description: unit.seo, path: `/${unit.slug}/`, current: unit.slug, content, locale: 'en' }));
}


const homeEs = `
<section class="hero wrap" aria-labelledby="hero-title"><div class="hero-copy">${eyebrow('Conexiones globales. Presencia local.')}${heroHeadline('es')}<p class="hero-lead">Ayudamos a marcas internacionales a entrar en Brasil. Nuestras unidades trabajan con productos Open Box, organización, espacios sin uso de celulares y compras internacionales.</p><div class="hero-actions">${button('Encuentra tu unidad', '#orientacao')}${button('Conocer el grupo', '#grupo', true)}</div></div><div class="hero-art">${globe('main', 'es')}<div class="art-coordinate"><span class="status-dot"></span> BASE EN BRASIL. VISIÓN GLOBAL.</div><span class="art-label" aria-hidden="true">CONEXIONES<br>EN MOVIMIENTO</span></div><div class="hero-bottom"><span>SOROCABA, SÃO PAULO · BRASIL</span><a href="#orientacao">ENCUENTRA TU UNIDAD <span aria-hidden="true">↓</span></a></div></section>
${needsNavigation('es')}
<section class="group-section section" id="grupo"><div class="wrap">${eyebrow('El grupo', '01')}<div class="group-grid"><h2 class="display reveal">Negocios diferentes.<br>Una misma voluntad<br>de <em>ir más allá.</em></h2><div class="group-copy reveal"><p>GlobalK reúne negocios que conectan marcas, productos y personas. Desde la entrada al mercado brasileño hasta soluciones para la vida cotidiana.</p><p>Con base en Sorocaba, integramos experiencia comercial, desarrollo de productos y operación local para abrir nuevos caminos.</p></div></div><div class="group-ledger"><div><span class="small-label">NUESTRA BASE</span><span>Sorocaba, Brasil</span></div><div><span class="small-label">NUESTRA VISIÓN</span><span>Conectar posibilidades</span></div><div><span class="small-label">LO QUE HACEMOS</span><span>Marcas, productos y operaciones</span></div></div></div></section>
<section class="timeline-section section" id="trajetoria"><div class="wrap timeline-grid"><div class="timeline-intro">${eyebrow('Una historia en movimiento')}<h2 class="display">Conexiones<br>que se convierten<br>en <em>caminos.</em></h2><p>Desde el desarrollo de marcas hasta las nuevas áreas de actividad del grupo.</p></div>${timelineScroll(timelineEs, 'es')}</div></section>
<section class="statement-strip" aria-label="Nuestra visión"><div class="wrap"><span class="small-label">LA PRÓXIMA CONEXIÓN PUEDE SER LA TUYA.</span><p>¿Tienes una marca o proyecto en mente?</p>${statementLink('es')}</div></section>`;
await page('/es/', layout({ title: 'GlobalK — Conexiones que abren posibilidades', description: 'Marcas, productos y operaciones conectados con el mercado brasileño. Conoce GlobalK, Economize, Multi-K, Safe-K y Trade-K.', content: homeEs, locale: 'es', afterContact: homeLocation('es') }));

for (const unit of unitsEs) {
  const next = unitsEs[(unitsEs.indexOf(unit) + 1) % unitsEs.length];
  const content = `<section class="unit-hero wrap"><nav class="breadcrumbs" aria-label="Ruta de navegación"><a href="/es/">Inicio</a><span aria-hidden="true">/</span><a href="/es/#orientacao">Unidades</a><span aria-hidden="true">/</span><span aria-current="page">${unit.name}</span></nav><div class="unit-hero-grid"><div class="unit-hero-copy">${unitIdentity(unit)}${eyebrow(unit.category, unit.number)}<h1 class="display">${unit.title}</h1><p class="unit-lead">${unit.description}</p><div class="hero-actions">${unitHeroActions(unit, 'es')}</div>${unitAudience(unit, 'es')}</div>${unitMedia(unit)}</div></section>
  ${unit.services.length ? `<section class="unit-services section" id="solucoes"><div class="wrap services-grid"><div class="services-intro">${eyebrow(unit.slug === 'safek' ? 'Cómo funciona' : 'Lo que hacemos')}<h2 class="display reveal">${unit.heading}</h2><p>${unit.intro}</p></div><ol class="service-list">${unit.services.map(([title, description], i) => `<li class="reveal"><span class="service-number">0${i + 1}</span><div><h3>${title}</h3><p>${description}</p>${unitGuidance(unit, 'es', i)}${serviceMedia(unit, 'es', i)}</div></li>`).join('')}</ol></div>${unit.secondaryImage ? `<figure class="detail-photo wrap reveal">${photo(unit.secondaryImage, unit.secondaryAlt, { sizes: '(min-width: 960px) 80vw, 100vw' })}<figcaption>${unit.secondaryAlt}</figcaption></figure>` : ''}</section>` : ''}
  ${['safek', 'tradek', 'nanium', 'realize'].includes(unit.slug) ? '' : `<section class="unit-cta section"><div class="wrap">${eyebrow('Encuentra tu próxima posibilidad')}<h2 class="display reveal">${unit.cta}</h2>${unitFinalCTA(unit, 'es')}</div></section>`}
  ${motorcycleImport(unit, 'es')}
  ${unitContinuation(unit, 'es')}
  <aside class="next-unit wrap"><span class="small-label">SIGUE EXPLORANDO EL GRUPO</span><a href="/es/${next.slug}/"><span>${next.name}<small>${next.category}</small></span>${arrow(true)}</a></aside>`;
  await page(`/es/${unit.slug}/`, layout({ title: `${unit.name} — ${unit.category} | GlobalK`, description: unit.seo, path: `/${unit.slug}/`, current: unit.slug, content, locale: 'es' }));
}


const notFoundContent = `<section class="error-section wrap" aria-labelledby="error-title">
  <div class="error-copy">${eyebrow('Erro 404 · Página não encontrada')}<h1 id="error-title">Perdemos esta<br><em>conexão.</em></h1><p class="error-description">O endereço que você tentou acessar não está disponível. Vamos encontrar outro caminho pelo grupo GlobalK.</p><div class="error-actions">${button('Voltar ao início', '/')}${button('Ver as unidades', '/#orientacao', true)}</div></div>
  <div class="error-art" aria-hidden="true"><span class="error-art-number">404</span><span class="error-art-point"></span><span class="error-art-caption">CONEXÃO INTERROMPIDA <span>·</span> GLOBALK</span></div>
  <nav class="error-shortcuts" aria-label="Outros caminhos"><span class="small-label">CONTINUE EXPLORANDO</span><a href="/#contato">Falar com a GlobalK ${arrow(true)}</a></nav>
</section>`;
const notFound = layout({ title: 'Página não encontrada | GlobalK', description: 'Encontre seu caminho de volta para a GlobalK.', path: '/', current: 'error', content: notFoundContent });
await writeFile(new URL('404.html', out), notFound);
const paths = ['/', ...units.map(u => `/${u.slug}/`), '/en/', ...unitsEn.map(u => `/en/${u.slug}/`), '/es/', ...unitsEs.map(u => `/es/${u.slug}/`)];
await writeFile(new URL('sitemap.xml', out), sitemapXML(paths));
await writeFile(new URL('robots.txt', out), robotsText);
await writeFile(new URL('llms.txt', out), `# GlobalK\n\nGlobalK connects international brands to a local operation in Brazil. Its business units are Economize, Multi-K, Safe-K, Trade-K, Nanium and Realize. The group is based in Sorocaba, São Paulo, Brazil.\n\n## Official pages\n\n- Portuguese: ${absoluteURL('/')}\n- English: ${absoluteURL('/en/')}\n- Spanish: ${absoluteURL('/es/')}\n- Brazilian market entry: ${absoluteURL('/globalk/')}\n- Economize: ${absoluteURL('/economize/')}\n- Multi-K: ${absoluteURL('/multik/')}\n- Safe-K: ${absoluteURL('/safek/')}\n- Trade-K: ${absoluteURL('/tradek/')}\n- Nanium: ${absoluteURL('/nanium/')}\n- Realize: ${absoluteURL('/realize/')}\n- Group history: ${absoluteURL('/#trajetoria')}\n\nFor current details and inquiries, use the linked pages. This file is a navigation aid, not a substitute for them.\n`);
const socialCards = {
  pt: ['Conectamos', 'marcas.', 'PRODUTOS · PESSOAS · MERCADOS'],
  en: ['Connecting', 'brands.', 'PRODUCTS · PEOPLE · MARKETS'],
  es: ['Conectamos', 'marcas.', 'PRODUCTOS · PERSONAS · MERCADOS'],
};
for (const [locale, [lineOne, lineTwo, tagline]] of Object.entries(socialCards)) {
  const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#0c0c0c"/><circle cx="1100" cy="300" r="350" fill="none" stroke="#cc0d0d" stroke-width="2"/><circle cx="1100" cy="300" r="270" fill="none" stroke="#cc0d0d" stroke-width="1"/><circle cx="1100" cy="300" r="190" fill="none" stroke="#cc0d0d" stroke-width="1"/><text x="70" y="100" fill="#f0ece4" font-family="Arial,sans-serif" font-size="38">GlobalK</text><text x="70" y="295" fill="#f0ece4" font-family="Arial,sans-serif" font-size="96">${lineOne}</text><text x="70" y="405" fill="#f14a3e" font-family="Arial,sans-serif" font-size="96">${lineTwo}</text><text x="75" y="551" fill="#b8b3ac" font-family="Arial,sans-serif" font-size="23">${tagline}</text></svg>`;
  await sharp(Buffer.from(social)).png().toFile(fileURLToPath(new URL(`assets/social-card-${locale}.png`, out)));
}
console.log(`Build concluído: ${paths.length} páginas, 404, sitemap e recursos locais.`);

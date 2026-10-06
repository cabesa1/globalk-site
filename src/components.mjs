import { company, units } from './content.mjs';
import { absoluteURL, alternates, IS_PREVIEW, localizedPath, structuredData } from './seo.mjs';

export const esc = (text = '') => String(text).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const arrow = (diagonal = false) => `<svg class="arrow" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${diagonal ? 'M5 19 19 5M5 5h14v14' : 'M4 12h15m-6-6 6 6-6 6'}" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const eyebrow = (text, number = '') => `<p class="eyebrow">${number ? `<span class="section-number">${number}</span>` : '<span class="eyebrow-line" aria-hidden="true"></span>'}${text}</p>`;
export const button = (text, href, secondary = false, external = false, locale = 'pt') => `<a class="button ${secondary ? 'button-secondary' : 'button-primary'}" href="${esc(href)}" aria-label="${esc(text)}${external ? ` (${locale === 'en' ? 'opens in a new tab' : locale === 'es' ? 'se abre en una pestaña nueva' : 'nova aba'})` : ''}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span class="button-spark" aria-hidden="true"></span><span class="button-label" aria-hidden="true">${text}</span><span class="button-reveal" aria-hidden="true"><span>${text}</span>${arrow(external)}</span></a>`;
export const mail = (topic = '', locale = 'pt') => `mailto:${company.email}${topic ? `?subject=${encodeURIComponent(`${locale === 'en' ? 'Website inquiry' : locale === 'es' ? 'Consulta desde el sitio web' : 'Contato pelo site'} — ${topic}`)}` : ''}`;
export const route = (path, locale = 'pt') => locale === 'en' || locale === 'es' ? `/${locale}${path}` : path;
const words = {
  pt: { skip: 'Ir para o conteúdo', home: 'página inicial', navigation: 'Navegação principal', group: 'O grupo', units: 'Unidades de negócio', history: 'Nossa história', contact: 'Contato', talk: 'Vamos conversar', menu: 'Menu', open: 'Abrir menu', close: 'Fechar menu', explore: 'Explore a GlobalK', fullMenu: 'Menu completo', start: 'Início', unitShort: 'Unidades', historyShort: 'História', nojs: 'Navegação sem JavaScript', footerNav: 'Navegação do rodapé', footerTag: 'Conexões que abrem', footerTagEm: 'possibilidades.', back: 'Voltar ao topo', rights: 'Todos os direitos reservados.', location: 'NOSSA BASE', map: 'Como chegar', recipient: 'FALE COM A GLOBALK', topic: 'SOBRE O QUE VAMOS CONVERSAR?', send: 'Enviar um e-mail', contactIntro: 'Conte o que você tem em mente.<br>Vamos encontrar a conexão certa.', contactTitle: 'O próximo passo<br>começa com uma<br><em>conversa.</em>', subjectOther: 'Outro assunto', newTab: 'nova aba' },
  en: { skip: 'Skip to content', home: 'home page', navigation: 'Main navigation', group: 'The group', units: 'Business units', history: 'Our story', contact: 'Contact', talk: 'Let’s talk', menu: 'Menu', open: 'Open menu', close: 'Close menu', explore: 'Explore GlobalK', fullMenu: 'Full menu', start: 'Home', unitShort: 'Units', historyShort: 'Our story', nojs: 'Navigation without JavaScript', footerNav: 'Footer navigation', footerTag: 'Connections that open', footerTagEm: 'possibilities.', back: 'Back to top', rights: 'All rights reserved.', location: 'BASED IN BRAZIL', map: 'Get directions', recipient: 'CONTACT GLOBALK', topic: 'WHAT WOULD YOU LIKE TO DISCUSS?', send: 'Send an email', contactIntro: 'Tell us what you have in mind.<br>Let’s find the right connection.', contactTitle: 'The next step<br>starts with a<br><em>conversation.</em>', subjectOther: 'Other topic', newTab: 'opens in a new tab' },
  es: { skip: 'Ir al contenido', home: 'página de inicio', navigation: 'Navegación principal', group: 'El grupo', units: 'Unidades de negocio', history: 'Nuestra historia', contact: 'Contacto', talk: 'Hablemos', menu: 'Menú', open: 'Abrir menú', close: 'Cerrar menú', explore: 'Explora GlobalK', fullMenu: 'Menú completo', start: 'Inicio', unitShort: 'Unidades', historyShort: 'Historia', nojs: 'Navegación sin JavaScript', footerNav: 'Navegación del pie de página', footerTag: 'Conexiones que abren', footerTagEm: 'posibilidades.', back: 'Volver arriba', rights: 'Todos los derechos reservados.', location: 'NUESTRA BASE', map: 'Cómo llegar', recipient: 'CONTACTA A GLOBALK', topic: '¿DE QUÉ TE GUSTARÍA HABLAR?', send: 'Enviar un correo', contactIntro: 'Cuéntanos qué tienes en mente.<br>Encontremos la conexión adecuada.', contactTitle: 'El próximo paso<br>empieza con una<br><em>conversación.</em>', subjectOther: 'Otro tema', newTab: 'se abre en una pestaña nueva' },
};
export const tr = (locale, key) => words[locale][key];
export function photo(name, alt, { hero = false, className = '', sizes = '(min-width: 960px) 46vw, 100vw' } = {}) {
  const dimensions = { economize: [960, 640], multik: [960, 1200], 'multik-detail': [960, 767], safek: [819, 1024], tradek: [960, 960] }[name];
  const actual = dimensions[0];
  return `<img class="${className}" src="/assets/${name}-960.webp" srcset="/assets/${name}-480.webp 480w, /assets/${name}-960.webp ${actual}w" sizes="${sizes}" width="${dimensions[0]}" height="${dimensions[1]}" alt="${esc(alt)}" loading="${hero ? 'eager' : 'lazy'}" decoding="async"${hero ? ' fetchpriority="high"' : ''}>`;
}
export const brandArtwork = (name, alt, hero = false) => `<img src="/assets/${esc(name)}" width="667" height="667" alt="${esc(alt)}" loading="${hero ? 'eager' : 'lazy'}" decoding="async"${hero ? ' fetchpriority="high"' : ''}>`;

export function globe(id = 'main', locale = 'pt') {
  const meridians = Array.from({ length: 11 }, (_, i) => `<ellipse cx="300" cy="300" rx="${22 + i * 19.3}" ry="222"/>`).join('');
  const parallels = Array.from({ length: 11 }, (_, i) => { const y = 116 + i * 36.8; const rx = Math.sqrt(222 ** 2 - (y - 300) ** 2); return `<ellipse cx="300" cy="${y}" rx="${rx.toFixed(2)}" ry="${(rx * .19).toFixed(2)}"/>`; }).join('');
  return `<svg class="globe" viewBox="0 0 600 600" fill="none" aria-hidden="true">
  <defs><clipPath id="sphere-${id}"><circle cx="300" cy="300" r="222"/></clipPath><pattern id="dots-${id}" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="currentColor"/></pattern></defs>
  <g class="globe-orbits" stroke="currentColor" stroke-width=".7"><ellipse cx="300" cy="300" rx="289" ry="86" transform="rotate(-27 300 300)"/><ellipse cx="300" cy="300" rx="276" ry="256" transform="rotate(25 300 300)" stroke-dasharray="2 9" opacity=".3"/></g>
  <circle cx="300" cy="300" r="222" fill="#11100f" stroke="currentColor" stroke-width="1.2"/>
  <g clip-path="url(#sphere-${id})"><g class="globe-grid" stroke="currentColor" stroke-width=".65" opacity=".43" transform="rotate(-15 300 300)">${meridians}${parallels}</g>
  <g fill="url(#dots-${id})" stroke="currentColor" stroke-width=".65" opacity=".85">
  <path d="m137 169 27-32 37-10 35 12 21-7 19 27-13 22-29 11-12 24-22 6-5 25-24-7-20-31-29-14-7-23z"/>
  <path d="m219 252 20-7 23 19 30 14 13 25-16 22-7 37-24 34-10 27-13 12-9-32 4-37-16-30-11-32 8-22z"/>
  <path d="m331 145 40-15 49 15 31 30 30 9 18 38-15 27-27 3-24-17-17 16-30-10-18-20-24 2-14-20-24-4-3-28z"/>
  <path d="m332 231 31-8 33 24 10 30-19 27-15 43-22 17-15-27-6-41-19-27 6-26z"/>
  <path d="m419 353 23-15 30 5 20 23-16 17-29 6-24-15z"/>
  </g></g><g class="globe-pulse"><circle cx="249" cy="349" r="6" fill="#f1ede6"/><circle cx="249" cy="349" r="14" stroke="#f1ede6" opacity=".35"/></g>
  <path d="M255 349h78l26 26h115" stroke="#f1ede6" stroke-width=".65" opacity=".65"/><text x="361" y="367" fill="#f1ede6" font-family="Satoshi, sans-serif" font-size="10" letter-spacing="2">${locale === 'en' ? 'BRAZIL' : 'BRASIL'}</text>
  <circle cx="46" cy="386" r="3" fill="currentColor"/><circle cx="533" cy="166" r="3" fill="currentColor"/>
  </svg>`;
}

export function header(current = 'home', locale = 'pt', path = '/') {
  const w = words[locale];
  const pagePT = path;
  const pageEN = route(path, 'en');
  const pageES = route(path, 'es');
  return `<a class="skip-link" href="#conteudo">${w.skip}</a>
  <header class="site-header"><div class="header-inner wrap">
    <a class="logo" href="${route('/', locale)}" aria-label="GlobalK — ${w.home}"><img src="/assets/logo.webp" width="500" height="193" alt="GlobalK"></a>
    <nav class="desktop-nav" aria-label="${w.navigation}"><a href="${route('/#grupo', locale)}">${w.group}</a><a href="${route('/#unidades', locale)}"${units.some(u => u.slug === current) ? ' class="active"' : ''}>${w.units}</a><a href="${route('/our-history/', locale)}"${current === 'history' ? ' aria-current="page"' : ''}>${w.history}</a></nav>
    <a class="header-contact" href="#contato">${w.talk} ${arrow(true)}</a>
    <nav class="language-switcher" aria-label="Idioma / Language"><a href="${pagePT}" hreflang="pt-BR" lang="pt-BR" aria-label="Português"${locale === 'pt' ? ' aria-current="page"' : ''}>PT</a><span aria-hidden="true">/</span><a href="${pageEN}" hreflang="en" lang="en" aria-label="English"${locale === 'en' ? ' aria-current="page"' : ''}>EN</a><span aria-hidden="true">/</span><a href="${pageES}" hreflang="es" lang="es" aria-label="Español"${locale === 'es' ? ' aria-current="page"' : ''}>ES</a></nav>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-menu" aria-label="${w.open}"><span>${w.menu}</span><span class="menu-icon" aria-hidden="true"><i></i><i></i></span></button>
  </div><noscript><nav class="no-js-nav wrap" aria-label="${w.nojs}"><a href="${route('/#grupo', locale)}">${w.group}</a><a href="${route('/#unidades', locale)}">${w.unitShort}</a><a href="${route('/our-history/', locale)}">${w.historyShort}</a><a href="#contato">${w.contact}</a></nav></noscript></header>
  <dialog class="menu-dialog" id="site-menu" aria-labelledby="menu-title"><div class="menu-shell wrap"><div class="menu-top"><span class="eyebrow" id="menu-title">${w.explore}</span><button class="menu-close" type="button" aria-label="${w.close}">${w.close} <span aria-hidden="true">×</span></button></div>
  <nav aria-label="${w.fullMenu}" class="menu-links"><a href="${route('/', locale)}"><span>01</span>${w.start} ${arrow(true)}</a><a href="${route('/#grupo', locale)}"><span>02</span>${w.group} ${arrow(true)}</a><a href="${route('/#unidades', locale)}"><span>03</span>${w.unitShort} ${arrow(true)}</a><a href="${route('/our-history/', locale)}"><span>04</span>${w.history} ${arrow(true)}</a><a href="#contato"><span>05</span>${w.contact} ${arrow(true)}</a></nav>
  <div class="menu-bottom"><a href="${mail()}">${company.email}</a><span>Sorocaba · São Paulo · ${locale === 'en' ? 'Brazil' : 'Brasil'}</span></div></div></dialog>`;
}

export function contact(topic = 'GlobalK', locale = 'pt') {
  const w = words[locale];
  return `<section class="contact-section section" id="contato"><div class="wrap contact-grid">
  <div>${eyebrow(w.talk, '05')}<h2 class="display reveal">${w.contactTitle}</h2><p class="contact-intro">${w.contactIntro}</p></div>
  <div class="contact-details reveal"><p class="contact-label">${w.recipient}</p><a class="email-link" href="${mail(topic, locale)}">${company.email}${arrow(true)}</a><a class="phone-link" href="${company.phoneHref}">${company.phone}</a><div class="contact-address"><span class="small-label">${w.location}</span><p>${company.address}</p><a class="text-link" href="https://www.google.com/maps/search/?api=1&amp;query=Shopping+Panor%C3%A2mico+Sorocaba+Rodovia+Raposo+Tavares+km+99" target="_blank" rel="noopener noreferrer">${w.map} ${arrow(true)}<span class="sr-only"> (${w.newTab})</span></a></div><div class="contact-topic"><label class="small-label" for="contact-topic">${w.topic}</label><select id="contact-topic">${['GlobalK', 'Economize', 'Multi-K', 'Safe-K', 'Trade-K', w.subjectOther].map(name => `<option${name === topic ? ' selected' : ''}>${name}</option>`).join('')}</select><a class="text-link" id="topic-email" href="${mail(topic, locale)}">${w.send} ${arrow(true)}</a></div></div>
  </div></section>`;
}

export function footer(locale = 'pt') {
  const w = words[locale];
  return `<footer class="site-footer"><div class="wrap"><div class="footer-top"><a class="footer-signature" href="${route('/', locale)}">${w.footerTag} <em>${w.footerTagEm}</em></a><nav aria-label="${w.footerNav}"><a href="${route('/#unidades', locale)}">${w.unitShort}</a><a href="${route('/our-history/', locale)}">${w.history}</a><a href="#contato">${w.contact}</a></nav><a href="#top" class="back-top" aria-label="${w.back}">${arrow(true)}</a></div><div class="footer-wordmark" aria-hidden="true">GLOBAL<span>K</span></div><div class="footer-legal"><span>© ${new Date().getFullYear()} GlobalK. ${w.rights}</span><span>${company.legal}<br>CNPJ ${company.cnpj}</span><span>Sorocaba, SP · ${locale === 'en' ? 'Brazil' : 'Brasil'}</span></div></div></footer>`;
}

export function layout({ title, description, path = '/', current = 'home', content, locale = 'pt' }) {
  const pagePath = localizedPath(path, locale);
  const pageURL = absoluteURL(pagePath);
  const socialImage = absoluteURL(`/assets/social-card-${locale}.png`);
  const socialAlt = locale === 'en' ? 'GlobalK — connecting brands, products, people and markets' : locale === 'es' ? 'GlobalK — conectamos marcas, productos, personas y mercados' : 'GlobalK — conectamos marcas, produtos, pessoas e mercados';
  const isError = current === 'error' || IS_PREVIEW;
  const seo = isError
    ? '<meta name="robots" content="noindex,follow">'
    : `<meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${pageURL}">${alternates(path).map(([lang, href]) => `<link rel="alternate" hreflang="${lang}" href="${href}">`).join('')}<meta property="og:type" content="website"><meta property="og:locale" content="${locale === 'en' ? 'en_US' : locale === 'es' ? 'es_ES' : 'pt_BR'}"><meta property="og:site_name" content="GlobalK"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${pageURL}"><meta property="og:image" content="${socialImage}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="${socialAlt}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${socialImage}"><script type="application/ld+json">${JSON.stringify(structuredData({ title, description, path, locale, current }))}</script>`;
  return `<!doctype html><html lang="${locale === 'pt' ? 'pt-BR' : locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#0c0c0c"><meta name="color-scheme" content="dark"><title>${esc(title)}</title><meta name="description" content="${esc(description)}">${seo}<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><link rel="preload" href="/assets/fonts/satoshi-regular.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/styles.css"><script src="/app.js" defer></script></head><body id="top" class="page-${current}" data-locale="${locale}">${header(current, locale, path)}<main id="conteudo">${content}${contact(units.find(u => u.slug === current)?.name || 'GlobalK', locale)}</main>${footer(locale)}</body></html>`;
}

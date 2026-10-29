import { company } from './content.mjs';

// Keep the published Vercel domain until the final GlobalK domain is connected.
const configuredURL = process.env.PUBLIC_SITE_URL || 'https://globalk-site.vercel.app';
const parsedURL = new URL(configuredURL);
if (parsedURL.protocol !== 'https:' || parsedURL.pathname !== '/' || parsedURL.search || parsedURL.hash) {
  throw new Error('PUBLIC_SITE_URL must be an HTTPS origin without a path, query, or fragment.');
}
export const SITE_URL = parsedURL.origin;
export const IS_PREVIEW = process.env.VERCEL_ENV === 'preview';
export const absoluteURL = path => `${SITE_URL}${path}`;

export const localizedPath = (path, locale) => locale === 'pt' ? path : `/${locale}${path}`;
export const alternates = path => [
  ['pt-BR', absoluteURL(path)],
  ['en', absoluteURL(localizedPath(path, 'en'))],
  ['es', absoluteURL(localizedPath(path, 'es'))],
  ['x-default', absoluteURL(path)],
];

const xml = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export function sitemapXML(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${paths.map(path => {
    const basePath = path.replace(/^\/(en|es)(?=\/)/, '');
    return `  <url><loc>${xml(absoluteURL(path))}</loc>${alternates(basePath).map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${xml(href)}"/>`).join('')}</url>`;
  }).join('\n')}\n</urlset>\n`;
}

export const robotsText = IS_PREVIEW
  ? 'User-agent: *\nDisallow: /\n'
  : `User-agent: *\nAllow: /\n\nSitemap: ${absoluteURL('/sitemap.xml')}\n`;

const names = {
  pt: { home: 'Início', history: 'Nossa história' },
  en: { home: 'Home', history: 'Our story' },
  es: { home: 'Inicio', history: 'Nuestra historia' },
};

export function structuredData({ title, description, path, locale, current }) {
  const pageURL = absoluteURL(localizedPath(path, locale));
  const organizationID = absoluteURL('/#organization');
  const websiteID = absoluteURL('/#website');
  const graph = [
    {
      '@type': 'WebPage', '@id': `${pageURL}#webpage`, url: pageURL,
      name: title, description, inLanguage: locale === 'pt' ? 'pt-BR' : locale,
      isPartOf: { '@id': websiteID }, about: { '@id': organizationID },
      ...(current !== 'home' ? { breadcrumb: { '@id': `${pageURL}#breadcrumb` } } : {}),
    },
  ];
  if (current !== 'home') {
    graph.push({
      '@type': 'BreadcrumbList', '@id': `${pageURL}#breadcrumb`,
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: names[locale].home, item: absoluteURL(localizedPath('/', locale)) },
        { '@type': 'ListItem', position: 2, name: current === 'history' ? names[locale].history : title.split(' — ')[0], item: pageURL },
      ],
    });
  } else {
    graph.push({
      '@type': 'WebSite', '@id': websiteID, url: absoluteURL('/'), name: company.name,
      inLanguage: ['pt-BR', 'en', 'es'], publisher: { '@id': organizationID },
    }, {
      '@type': 'Organization', '@id': organizationID, url: absoluteURL('/'),
      name: company.name, legalName: company.legal, taxID: company.cnpj,
      logo: absoluteURL('/assets/logo.webp'), email: company.email, telephone: company.phone,
      address: {
        '@type': 'PostalAddress', streetAddress: 'Shopping Panorâmico, Galpão E — Rodovia Raposo Tavares, km 99',
        addressLocality: 'Sorocaba', addressRegion: 'SP', addressCountry: 'BR',
      },
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

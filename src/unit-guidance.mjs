import { button, esc, eyebrow, photo } from './components.mjs';

const copy = {
  pt: {
    contact: ['Não sabe qual unidade procurar?', 'Conte o que você precisa à equipe GlobalK.', 'Fale com a GlobalK'],
    economize: ['Compare as classificações no guia oficial. Confirme as condições de compra diretamente na loja.', 'Ver guia de condições da Economize'],
    safek: ['Safe-K para a sua escola, empresa ou evento.', 'Veja mais sobre o sistema no site da Safe-K. Para conversar sobre o uso no seu ambiente, procure a equipe pelos canais disponíveis lá.', 'Conhecer o sistema Safe-K'],
    tradek: ['Planeje sua próxima compra internacional.', 'No site da Trade-K, conheça a atuação com empresas brasileiras que compram na Ásia e os canais da equipe. As condições de cada projeto e de financiamento dependem de avaliação individual.', 'Conhecer as soluções da Trade-K'],
    media: ['Pessoa colocando o celular na bolsa Safe-K.', 'Pessoa lendo com a bolsa Safe-K ao lado sobre a mesa.', 'Trava da bolsa Safe-K encostada na base de desbloqueio.'],
    captions: ['Colocar o celular na bolsa.', 'A bolsa permanece com seu dono durante a atividade.', 'Encostar a trava na base para liberar o aparelho.'],
  },
  en: {
    contact: ['Not sure which unit to choose?', 'Tell the GlobalK team what you need.', 'Contact GlobalK'],
    economize: ['Compare classifications in the official guide. Confirm purchasing terms directly with the store.', 'Read the Economize condition guide'],
    safek: ['Safe-K for your school, company or event.', 'Explore the system on the Safe-K website. To discuss using it in your setting, contact the team through the channels listed there.', 'Discover the Safe-K system'],
    tradek: ['Plan your next international purchase.', 'Visit Trade-K to learn about its work with Brazilian companies buying in Asia and find the team’s contact channels. Project and financing terms require an individual assessment.', 'Explore Trade-K solutions'],
    media: ['A person putting a phone into a Safe-K pouch.', 'A person reading with the Safe-K pouch beside them on a table.', 'Safe-K pouch lock placed against the unlocking station.'],
    captions: ['Put the phone into the pouch.', 'The owner keeps the pouch during the activity.', 'Place the lock against the station to release the phone.'],
  },
  es: {
    contact: ['¿No sabes qué unidad elegir?', 'Cuéntale al equipo de GlobalK qué necesitas.', 'Contactar a GlobalK'],
    economize: ['Compara las clasificaciones en la guía oficial. Confirma las condiciones de compra directamente en la tienda.', 'Ver la guía de condiciones de Economize'],
    safek: ['Safe-K para tu escuela, empresa o evento.', 'Conoce el sistema en el sitio de Safe-K. Para hablar sobre su uso en tu entorno, contacta al equipo a través de los canales que encontrarás allí.', 'Conocer el sistema Safe-K'],
    tradek: ['Planifica tu próxima compra internacional.', 'Visita Trade-K para conocer su trabajo con empresas brasileñas que compran en Asia y encontrar los canales del equipo. Las condiciones de cada proyecto y de financiamiento requieren una evaluación individual.', 'Conocer las soluciones de Trade-K'],
    media: ['Persona colocando el celular en la bolsa Safe-K.', 'Persona leyendo con la bolsa Safe-K a su lado sobre una mesa.', 'Traba de la bolsa Safe-K apoyada en la base de desbloqueo.'],
    captions: ['Colocar el celular en la bolsa.', 'La bolsa permanece con su dueño durante la actividad.', 'Acercar la traba a la base para liberar el celular.'],
  },
};

export function ecosystemContact(locale) {
  const [title, text, label] = copy[locale].contact;
  return `<div class="ecosystem-contact"><div><h3>${title}</h3><p>${text}</p></div>${button(label, '#contato', true)}</div>`;
}

export function unitGuidance(unit, locale, index) {
  if (unit.slug !== 'economize' || index !== 0) return '';
  const [text, label] = copy[locale].economize;
  return `<div class="unit-guidance"><p>${text}</p>${button(label, 'https://economize.vc/condition-guide', true, true, locale)}</div>`;
}

export function unitContinuation(unit, locale) {
  if (!['safek', 'tradek'].includes(unit.slug)) return '';
  const [title, text, label] = copy[locale][unit.slug];
  return `<section class="unit-cta unit-continuation section"><div class="wrap"><h2 class="display reveal">${title}</h2><p class="unit-consult-note">${text}</p>${button(label, unit.external, false, true, locale)}</div></section>`;
}

export function serviceMedia(unit, locale, index) {
  if (unit.slug !== 'safek') return '';
  const name = ['safek-guardar', 'safek-bloquear', 'safek-liberar'][index];
  return `<figure class="service-demo"><img src="/assets/${name}-720.webp" srcset="/assets/${name}-360.webp 360w, /assets/${name}-720.webp 720w" sizes="(min-width: 960px) 340px, 84vw" width="720" height="960" alt="${esc(copy[locale].media[index])}" loading="lazy" decoding="async"><figcaption>${copy[locale].captions[index]}</figcaption></figure>`;
}

export function motorcycleImport(unit, locale) {
  if (unit.slug !== 'tradek') return '';
  const text = {
    pt: {
      label: 'Mercado de duas rodas', title: 'Importação e venda<br>de <em>motos.</em>',
      intro: 'A Trade-K atua na importação e venda de motos, conectando fornecedores internacionais ao mercado brasileiro.',
      next: 'Novas opções para empresas que querem ampliar seu portfólio e explorar oportunidades de compra e revenda no setor de duas rodas.',
      alt: 'Duas motos vermelhas e pretas em uma imagem de divulgação da Trade-K', caption: 'Imagem de divulgação fornecida pela equipe Trade-K.',
    },
    en: {
      label: 'The motorcycle market', title: 'Motorcycle imports<br>and <em>sales.</em>',
      intro: 'Trade-K imports and sells motorcycles, connecting international suppliers with the Brazilian market.',
      next: 'New options for businesses looking to expand their product range and explore motorcycle purchasing and resale opportunities.',
      alt: 'Two red and black motorcycles in a Trade-K promotional image', caption: 'Promotional image supplied by the Trade-K team.',
    },
    es: {
      label: 'Mercado de las dos ruedas', title: 'Importación y venta<br>de <em>motos.</em>',
      intro: 'Trade-K importa y vende motos, conectando proveedores internacionales con el mercado brasileño.',
      next: 'Nuevas opciones para empresas que quieren ampliar su oferta y explorar oportunidades de compra y reventa en el sector de las dos ruedas.',
      alt: 'Dos motos rojas y negras en una imagen promocional de Trade-K', caption: 'Imagen promocional proporcionada por el equipo de Trade-K.',
    },
  }[locale];
  return `<section class="motorcycle-import section" id="importacao-motos"><div class="wrap motorcycle-grid"><div class="motorcycle-copy">${eyebrow(text.label)}<h2 class="display reveal">${text.title}</h2><p>${text.intro}</p><p>${text.next}</p></div><figure class="motorcycle-photo reveal">${photo('tradek-motorcycles', text.alt, { sizes:'(min-width: 960px) 44vw, 100vw' })}<figcaption>${text.caption}</figcaption></figure></div></section>`;
}

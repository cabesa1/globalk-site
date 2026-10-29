import { units, timeline } from './content.mjs';

const spanishUnits = {
  globalk: {
    category: 'Entrada al mercado brasileño', summary: 'Estructura local para marcas que quieren llegar más lejos en Brasil.',
    title: 'Un nuevo mercado.<br>Un socio <em>integral.</em>',
    description: 'Desde la entrada a Brasil hasta la operación diaria, conectamos marcas internacionales con una estructura local de distribución, ventas y soporte.',
    seo: 'Operación local, distribución, ventas y soporte para marcas internacionales que quieren entrar al mercado brasileño. Conoce GlobalK.',
    alt: 'Contenedores en una operación logística, imagen ilustrativa del comercio internacional', imageCaption: 'Imagen ilustrativa del comercio internacional; no muestra una operación de GlobalK.',
    audience: 'Para marcas internacionales que buscan desarrollar su presencia en Brasil con un socio local.',
    heading: 'Tu marca en Brasil.<br>Una operación <em>conectada.</em>',
    intro: 'Reunimos las etapas de la operación para acercar productos, canales de venta y consumidores. Una estructura integrada, con base en Sorocaba.',
    services: [
      ['Entrada al mercado', 'Apoyo para estructurar el negocio y cumplir los requisitos de operación en Brasil.'],
      ['Logística y distribución', 'Organización de la operación local y distribución desde Sorocaba.'],
      ['Canales de venta', 'Presencia en marketplaces, comercio electrónico y tiendas físicas.'],
      ['Productos y marcas', 'Desarrollo de productos y revitalización de marcas para el mercado local.'],
      ['Posventa', 'Atención al consumidor integrada con la operación comercial.'],
    ],
    cta: 'Conversemos sobre la entrada de tu marca en Brasil.', contactLabel: 'Consultar entrada a Brasil',
  },
  economize: {
    category: 'Open Box y comercio minorista', summary: 'Nuevas posibilidades para los productos. Más opciones para quienes compran.',
    title: 'Open Box<br>y <em>venta minorista.</em>',
    description: 'Economize vende productos nuevos y Open Box en su tienda física, su comercio electrónico y marketplaces.',
    seo: 'Conoce Economize: productos nuevos y Open Box en la tienda física y el comercio electrónico. Visita la tienda online y descubre las ofertas.',
    alt: 'Profesional revisando productos en un almacén, imagen publicada por Economize', imageCaption: 'Imagen publicada por Economize; consulta el estado de cada artículo en la tienda.',
    audience: 'Encuentra oportunidades en productos nuevos y Open Box para comprar en la tienda física o en línea.',
    heading: 'Conoce los productos<br><em>Open Box.</em>',
    intro: 'Los productos Open Box pueden incluir artículos devueltos o con el empaque abierto. La evaluación y la información de cada oferta ayudan a elegir con claridad.',
    services: [
      ['Estado de cada artículo', 'Lee la descripción de la oferta para conocer el estado del producto antes de comprar.'],
      ['Compra online', 'Encuentra las ofertas y la información de cada artículo en la tienda online de Economize.'],
    ],
    externalLabel: 'Visitar la tienda', cta: 'Descubre las ofertas<br>de <em>Economize.</em>', contactLabel: 'Visitar la tienda',
  },
  multik: {
    category: 'Organización y productos cotidianos', summary: 'Soluciones sencillas para organizar lo que forma parte de tu día.',
    title: 'Pequeños detalles.<br>Un día más <em>sencillo.</em>',
    description: 'Organizadores, etiquetas y soluciones prácticas para poner cada cosa en su lugar. Funcionalidad para el hogar, el trabajo y la rutina.',
    seo: 'Multi-K: organizadores de cables, etiquetas y productos útiles para el hogar y la oficina. Conoce una marca de GlobalK.',
    alt: 'Organizador de cables Multi-K en un escritorio', brandAlt: 'Logotipo oficial de Multi-K en blanco y amarillo', imageCaption: 'Organizador de cables Multi-K en uso.',
    audience: 'Para personas y empresas que buscan organización práctica en casa, en la oficina o en su día a día.',
    heading: 'Menos desorden.<br>Más espacio para <em>vivir.</em>',
    intro: 'Creamos soluciones de organización que combinan utilidad y atención a los detalles. Productos pensados para resolver pequeñas necesidades cotidianas.',
    services: [
      ['Organizar', 'Organizadores de cables para mantener los accesorios juntos y los espacios en orden.'],
      ['Identificar', 'Etiquetas que facilitan reconocer y separar cables y otros objetos.'],
      ['Simplificar', 'Productos y soluciones de almacenamiento para aprovechar mejor cada espacio.'],
    ],
    secondaryAlt: 'Organizadores Multi-K en uso', cta: '¿Quieres saber más sobre los productos Multi-K?', contactLabel: 'Preguntar sobre los productos',
  },
  safek: {
    category: 'Atención y presencia', summary: 'Espacios sin uso de celulares, con cada dispositivo siempre junto a su dueño.',
    title: 'Menos distracciones.<br>Más <em>presencia.</em>',
    description: 'Una funda con sistema de bloqueo que ayuda a crear espacios sin uso de celulares. Cada persona conserva su dispositivo durante toda la experiencia.',
    seo: 'Safe-K: fundas con bloqueo para crear espacios sin uso de celulares en escuelas, eventos y empresas, sin retirar los dispositivos.',
    alt: 'Funda negra Safe-K sobre una base oscura con iluminación azul', brandAlt: 'Logotipo oficial de Safe-K en blanco y azul', imageCaption: 'Imagen de presentación del producto Safe-K.',
    audience: 'Para escuelas, universidades, empresas y eventos que valoran la atención, la convivencia y la participación.',
    heading: 'Cómo <em>funciona.</em>',
    intro: 'Una funda y una estación de desbloqueo controlan el acceso al celular.',
    services: [
      ['Guardar', 'Al llegar, el celular se coloca dentro de una funda Safe-K.'],
      ['Bloquear', 'La funda se cierra y permanece con su dueño durante la actividad.'],
      ['Desbloquear', 'En el área indicada, una estación de desbloqueo permite acceder al dispositivo.'],
    ],
    externalLabel: 'Explorar Safe-K',
  },
  tradek: {
    category: 'Importaciones y financiamiento', summary: 'Una conexión entre empresas brasileñas y oportunidades en Asia.',
    title: 'Compras en Asia.<br>Importación con <em>planificación.</em>',
    description: 'Apoyo para compras internacionales y soluciones de financiamiento para empresas brasileñas que importan mercancías de Asia.',
    seo: 'Trade-K: apoyo a las importaciones y soluciones de financiamiento de compras internacionales para empresas brasileñas. Una unidad de GlobalK.',
    alt: 'Contenedores en una terminal de carga, imagen ilustrativa de importaciones', brandAlt: 'Logotipo oficial de Trade-K en blanco y verde', imageCaption: 'Imagen ilustrativa de importaciones; no muestra una operación de Trade-K.',
    audience: 'Para empresas brasileñas que quieren planificar sus compras internacionales y evaluar opciones de financiamiento.',
    heading: 'Compras y <em>financiamiento.</em>',
    intro: 'Cada proyecto y sus condiciones se evalúan individualmente según las necesidades del negocio.',
    services: [
      ['Compras internacionales', 'Apoyo en la planificación y adquisición de mercancías en Asia.'],
      ['Financiamiento', 'Evaluación de soluciones para financiar compras y organizar el capital de trabajo.'],
    ],
    externalLabel: 'Visitar el sitio de Trade-K',
  },
};

spanishUnits.nanium = {
  category: 'Computadoras y rendimiento gamer', summary: 'Producción y montaje de computadoras para juegos.',
  title: 'Computadoras<br>para <em>jugar.</em>',
  description: 'Nanium produce y monta computadoras con foco en el rendimiento gamer.',
  seo: 'Conoce Nanium, marca de GlobalK dedicada a la producción y al montaje de computadoras con foco en el rendimiento gamer.',
  audience: 'Para quienes buscan una computadora enfocada en el rendimiento para juegos.',
  heading: 'Montaje enfocado<br>en el <em>rendimiento.</em>',
  intro: 'Nanium combina el montaje de computadoras con un enfoque en el uso gamer.',
  services: [],
  contactLabel: 'Consultar computadoras',
};
spanishUnits.realize = {
  category: 'Open Box y venta B2B en lotes', summary: 'Lotes Open Box para pequeños y medianos empresarios.',
  title: 'Open Box<br>para tu <em>negocio.</em>',
  description: 'Realize es la división B2B de Economize, con productos Open Box vendidos en lotes para empresas.',
  seo: 'Conoce Realize: venta B2B de lotes de productos Open Box para pequeños y medianos empresarios, con descuentos de hasta el 50%.',
  audience: 'Para pequeños y medianos empresarios interesados en comprar productos Open Box en lotes.',
  heading: 'Oportunidades<br>de compra en <em>lotes.</em>',
  intro: 'Consulta con el equipo para conocer los lotes y los artículos disponibles.',
  services: [['Productos en lotes', 'Compra de productos Open Box en lotes.'], ['Hasta un 50% de descuento', 'Descuentos de hasta el 50% en los artículos comercializados.']],
};
export const unitsEs = units.map(unit => ({ ...unit, ...spanishUnits[unit.slug] }));
const spanishTimeline = [
  ['El comienzo de una conexión.', 'Estructuración del negocio, estudios de mercado y primeras negociaciones estratégicas.'],
  ['Nuevos caminos con Compaq.', 'Acuerdo de licencia de la marca Compaq con HP para producir computadoras y tabletas en Brasil.'],
  ['Presencia en Sorocaba.', 'Apertura de la primera tienda oficial, enfocada en productos HP reacondicionados.'],
  ['Una nueva etapa para Compaq.', 'La trayectoria de la marca en Brasil inicia una nueva fase con Positivo Tecnologia.'],
  ['Nace Economize.', 'El lanzamiento de la plataforma de productos nuevos y Open Box amplía la presencia del grupo en el comercio minorista.'],
  ['Organizar también es innovar.', 'Nace Multi-K, con soluciones de organización y productos para el día a día.'],
  ['Nuevas áreas. Una misma visión.', 'Safe-K y Trade-K amplían el grupo con soluciones para espacios sin uso de celulares y apoyo a las importaciones.'],
  ['Una visión de liderazgo.', 'Con Economize, queremos convertirnos en el mayor referente de outlet y Open Box de Brasil, ampliando el acceso a productos en tiendas y mediante el comercio electrónico.'],
];
export const timelineEs = timeline.map((item, index) => ({ year: item.year, title: spanishTimeline[index][0], text: spanishTimeline[index][1] }));

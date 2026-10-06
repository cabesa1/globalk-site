import { units, timeline } from './content.mjs';

const spanishUnits = {
  globalk: {
    category: 'Entrada al mercado brasileño', summary: 'Estructura local para marcas que quieren llegar más lejos en Brasil.',
    title: 'Un nuevo mercado.<br>Un socio <em>integral.</em>',
    description: 'Desde la entrada a Brasil hasta la operación diaria, conectamos marcas internacionales con una estructura local de distribución, ventas y soporte.',
    seo: 'Operación local, distribución, ventas y soporte para marcas internacionales que quieren entrar al mercado brasileño. Conoce GlobalK.',
    alt: 'Contenedores en una operación logística, imagen ilustrativa del comercio internacional', imageCaption: 'Conexiones internacionales. Operación en Brasil.',
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
    cta: '¿Hablamos de tu operación?', contactLabel: 'Hablar sobre la entrada a Brasil',
  },
  economize: {
    category: 'Open Box y comercio minorista', summary: 'Nuevas posibilidades para los productos. Más opciones para quienes compran.',
    title: 'Buenas decisiones.<br>Nuevas <em>posibilidades.</em>',
    description: 'Productos nuevos y Open Box seleccionados y evaluados para volver al mercado. Economize conecta oportunidades de compra con una operación minorista multicanal.',
    seo: 'Conoce Economize, la unidad de GlobalK dedicada a productos Open Box, comercio minorista y operación en marketplaces.',
    alt: 'Profesional revisando productos en un almacén, imagen publicada por Economize', imageCaption: 'Selección, organización y una nueva oportunidad.',
    audience: 'Para quienes buscan buenas oportunidades de compra y para empresas interesadas en operaciones comerciales y marketplaces.',
    heading: 'Valor que perdura.<br>Consumo que <em>tiene sentido.</em>',
    intro: 'Los productos Open Box pueden incluir artículos devueltos o con el empaque abierto. La evaluación y la información de cada oferta ayudan a elegir con claridad.',
    services: [
      ['Productos Open Box', 'Selección y control de calidad, con información sobre el estado de cada producto.'],
      ['Comercio multicanal', 'Presencia en comercio electrónico, tienda física y marketplaces.'],
      ['Operación comercial', 'Gestión de inventario, precios y atención al cliente para ventas en línea.'],
    ],
    externalLabel: 'Visitar la tienda', cta: 'Una oportunidad para tu negocio.', contactLabel: 'Hablar sobre alianzas',
  },
  multik: {
    category: 'Organización y productos cotidianos', summary: 'Soluciones sencillas para organizar lo que forma parte de tu día.',
    title: 'Pequeños detalles.<br>Un día más <em>sencillo.</em>',
    description: 'Organizadores, etiquetas y soluciones prácticas para poner cada cosa en su lugar. Funcionalidad para el hogar, el trabajo y la rutina.',
    seo: 'Multi-K: organizadores de cables, etiquetas y productos útiles para el hogar y la oficina. Conoce una marca de GlobalK.',
    alt: 'Organizador de cables Multi-K en un escritorio', brandAlt: 'Logotipo oficial de Multi-K en blanco y amarillo', imageCaption: 'Identidad oficial de Multi-K.',
    audience: 'Para personas y empresas que buscan organización práctica en casa, en la oficina o en su día a día.',
    heading: 'Menos desorden.<br>Más espacio para <em>vivir.</em>',
    intro: 'Creamos soluciones de organización que combinan utilidad y atención a los detalles. Productos pensados para resolver pequeñas necesidades cotidianas.',
    services: [
      ['Organizar', 'Organizadores de cables para mantener los accesorios juntos y los espacios en orden.'],
      ['Identificar', 'Etiquetas que facilitan reconocer y separar cables y otros objetos.'],
      ['Simplificar', 'Productos y soluciones de almacenamiento para aprovechar mejor cada espacio.'],
    ],
    secondaryAlt: 'Organizadores Multi-K en uso', cta: 'Pongamos las buenas ideas en práctica.', contactLabel: 'Conocer los productos',
  },
  safek: {
    category: 'Atención y presencia', summary: 'Espacios sin uso de celulares, con cada dispositivo siempre junto a su dueño.',
    title: 'Menos distracciones.<br>Más <em>presencia.</em>',
    description: 'Una funda con sistema de bloqueo que ayuda a crear espacios sin uso de celulares. Cada persona conserva su dispositivo durante toda la experiencia.',
    seo: 'Safe-K: fundas con bloqueo para crear espacios sin uso de celulares en escuelas, eventos y empresas, sin retirar los dispositivos.',
    alt: 'Funda negra Safe-K con sistema de bloqueo para celulares', brandAlt: 'Logotipo oficial de Safe-K en blanco y azul', imageCaption: 'Identidad oficial de Safe-K.',
    audience: 'Para escuelas, universidades, empresas y eventos que valoran la atención, la convivencia y la participación.',
    heading: 'El celular se queda.<br>La distracción <em>se va.</em>',
    intro: 'El proceso es sencillo: guardar, bloquear y desbloquear en un área designada. Una forma de organizar el uso de celulares sin retirarlos a sus dueños.',
    services: [
      ['Guardar', 'Al llegar, el celular se coloca dentro de una funda Safe-K.'],
      ['Bloquear', 'La funda se cierra y permanece con su dueño durante la actividad.'],
      ['Desbloquear', 'En el área indicada, una estación de desbloqueo permite acceder al dispositivo.'],
    ],
    externalLabel: 'Explorar Safe-K', cta: 'Un espacio con más presencia empieza con una conversación.', contactLabel: 'Consultar sobre Safe-K',
  },
  tradek: {
    category: 'Importaciones y financiamiento', summary: 'Una conexión entre empresas brasileñas y oportunidades en Asia.',
    title: 'El mundo más cerca.<br>Tu negocio más <em>lejos.</em>',
    description: 'Apoyo para compras internacionales y soluciones de financiamiento para empresas brasileñas que importan mercancías de Asia.',
    seo: 'Trade-K: apoyo a las importaciones y soluciones de financiamiento de compras internacionales para empresas brasileñas. Una unidad de GlobalK.',
    alt: 'Contenedores en una terminal de carga, imagen ilustrativa de importaciones', brandAlt: 'Logotipo oficial de Trade-K en blanco y verde', imageCaption: 'Identidad oficial de Trade-K.',
    audience: 'Para empresas brasileñas que quieren planificar sus compras internacionales y evaluar opciones de financiamiento.',
    heading: 'Importar con visión.<br>Crecer con <em>planificación.</em>',
    intro: 'Trade-K conecta la estrategia de compra con las necesidades de la operación. Cada proyecto y sus condiciones se evalúan según la realidad de cada negocio.',
    services: [
      ['Compras internacionales', 'Apoyo en la planificación y adquisición de mercancías en Asia.'],
      ['Financiamiento', 'Evaluación de soluciones para financiar compras y organizar el capital de trabajo.'],
      ['Acompañamiento', 'Apoyo durante el proceso para tomar decisiones de importación con mayor claridad.'],
    ],
    externalLabel: 'Visitar el sitio de Trade-K', cta: 'Tu próxima conexión empieza aquí.', contactLabel: 'Hablar sobre importaciones',
  },
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
];
export const timelineEs = timeline.map((item, index) => ({ year: item.year, title: spanishTimeline[index][0], text: spanishTimeline[index][1] }));

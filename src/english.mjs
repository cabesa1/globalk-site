import { units, timeline } from './content.mjs';

const englishUnits = {
  globalk: {
    category: 'Brazilian market entry', summary: 'A local structure for brands ready to go further in Brazil.',
    title: 'A new market.<br>One partner <em>all the way.</em>',
    description: 'From entering Brazil to day-to-day operations, we connect international brands with local distribution, sales and support.',
    seo: 'Local operations, distribution, sales and support for international brands entering the Brazilian market. Meet GlobalK.',
    alt: 'Shipping containers, an illustrative image of international trade', imageCaption: 'International connections. Local operations in Brazil.',
    audience: 'For international brands building a presence in Brazil with a local partner.',
    heading: 'Your brand in Brazil.<br>An <em>integrated</em> operation.',
    intro: 'We bring the stages of an operation together to connect products, sales channels and customers. Our local base is in Sorocaba.',
    services: [
      ['Market entry', 'Support with business setup and the requirements of operating in Brazil.'],
      ['Logistics and distribution', 'Local operations and distribution from Sorocaba.'],
      ['Sales channels', 'Operations across marketplaces, e-commerce and physical retail.'],
      ['Products and brands', 'Product development and brand revitalization for the local market.'],
      ['After-sales support', 'Customer support connected to commercial operations.'],
    ],
    cta: 'Shall we talk about your operation?', contactLabel: 'Discuss market entry',
  },
  economize: {
    category: 'Open-box & retail', summary: 'New possibilities for products. More choices for shoppers.',
    title: 'Good choices.<br>New <em>possibilities.</em>',
    description: 'New and open-box products selected and checked for resale. Economize connects shopping opportunities with a multichannel retail operation.',
    seo: 'Meet Economize, the GlobalK business unit focused on open-box products, retail and marketplace operations.',
    alt: 'A professional checking inventory in a warehouse, an image published by Economize', imageCaption: 'Selection, organization and another opportunity.',
    audience: 'For shoppers looking for value and companies interested in commercial and marketplace operations.',
    heading: 'Value that lasts.<br>Consumption that <em>makes sense.</em>',
    intro: 'Open-box products may include returned items or items with opened packaging. Clear information about each offer helps customers choose confidently.',
    services: [
      ['Open-box products', 'Product selection and quality control, with information about each item’s condition.'],
      ['Multichannel retail', 'Sales through e-commerce, a physical store and marketplaces.'],
      ['Commercial operations', 'Inventory, pricing and customer service for online sales.'],
    ],
    externalLabel: 'Visit the store', cta: 'An opportunity for your business.', contactLabel: 'Discuss partnerships',
  },
  multik: {
    category: 'Organization & everyday products', summary: 'Simple ways to organize the things you use every day.',
    title: 'Small details.<br>A <em>simpler</em> day.',
    description: 'Organizers, labels and practical solutions that help keep everything in its place. Useful products for home, work and daily life.',
    seo: 'Multi-K: cable organizers, labels and everyday products for home and office. Discover a GlobalK brand.',
    alt: 'A Multi-K cable organizer on a work desk', imageCaption: 'Design that fits your routine.',
    audience: 'For people and businesses looking for practical organization at home, at work and beyond.',
    heading: 'Less clutter.<br>More room to <em>live.</em>',
    intro: 'We create useful organizational products with attention to detail. Small solutions for everyday needs.',
    services: [
      ['Organize', 'Cable organizers keep accessories together and workspaces tidy.'],
      ['Identify', 'Labels make cables and other items easier to recognize and sort.'],
      ['Simplify', 'Everyday products and storage solutions help make better use of space.'],
    ],
    secondaryAlt: 'Multi-K organizers in use', cta: 'Let’s put good ideas to work.', contactLabel: 'Explore the products',
  },
  safek: {
    category: 'Focus & presence', summary: 'Phone-free spaces where each person keeps their device with them.',
    title: 'Fewer distractions.<br>More <em>presence.</em>',
    description: 'A locking pouch that helps create phone-free spaces. People keep their devices with them throughout the experience.',
    seo: 'Safe-K locking pouches help create phone-free spaces in schools, events and workplaces while owners keep their devices.',
    alt: 'Black Safe-K locking pouch for a mobile phone', imageCaption: 'Your phone stays with you. Your focus stays here.',
    audience: 'For schools, universities, companies and events that value attention and participation.',
    heading: 'Keep your phone.<br>Leave distractions <em>behind.</em>',
    intro: 'The process is simple: store the phone, lock the pouch and unlock it in a designated area. There is no need to collect anyone’s device.',
    services: [
      ['Store', 'On arrival, the phone goes into a Safe-K pouch.'],
      ['Lock', 'The pouch closes and remains with its owner during the activity.'],
      ['Unlock', 'A release station in the designated area lets the owner access the phone.'],
    ],
    externalLabel: 'Explore Safe-K', cta: 'A more present space starts with a conversation.', contactLabel: 'Ask about Safe-K',
  },
  tradek: {
    category: 'Imports & financing', summary: 'Connecting Brazilian companies with opportunities in Asia.',
    title: 'A closer world.<br>A business that goes <em>further.</em>',
    description: 'Support for international purchases and financing solutions for Brazilian companies importing goods from Asia.',
    seo: 'Trade-K supports imports and financing of international purchases for Brazilian companies. A GlobalK business unit.',
    alt: 'Shipping containers at a cargo terminal, an illustrative image of imports', imageCaption: 'From an international opportunity to a local operation.',
    audience: 'For Brazilian companies planning international purchases and exploring financing options.',
    heading: 'Import with insight.<br>Grow with <em>a plan.</em>',
    intro: 'Trade-K connects purchasing strategy with operational needs. Each project and its terms are evaluated according to the business.',
    services: [
      ['International purchasing', 'Support with planning and buying goods in Asia.'],
      ['Financing', 'Evaluation of solutions for purchases and working capital.'],
      ['Ongoing support', 'Guidance through the process to support clearer import decisions.'],
    ],
    cta: 'Your next connection starts here.', contactLabel: 'Discuss imports',
  },
};

export const unitsEn = units.map(unit => ({ ...unit, ...englishUnits[unit.slug] }));
const englishTimeline = [
  ['A connection begins.', 'Business development, market studies and early strategic negotiations.'],
  ['New paths with Compaq.', 'An agreement with HP to license the Compaq brand for computers and tablets produced in Brazil.'],
  ['A presence in Sorocaba.', 'The first official store opens, focused on refurbished HP products.'],
  ['A new chapter for Compaq.', 'The brand’s journey in Brazil enters a new phase with Positivo Tecnologia.'],
  ['Economize launches.', 'A platform for new and open-box products expands the group’s retail presence.'],
  ['Organization meets innovation.', 'Multi-K is created with organizational solutions and everyday products.'],
  ['New directions. Shared vision.', 'Safe-K and Trade-K expand the group with phone-free solutions and import support.'],
];
export const timelineEn = timeline.map((item, index) => ({ year: item.year, title: englishTimeline[index][0], text: englishTimeline[index][1] }));

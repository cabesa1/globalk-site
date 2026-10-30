import { units, timeline } from './content.mjs';

const englishUnits = {
  globalk: {
    category: 'Brazilian market entry', summary: 'A local structure for brands ready to go further in Brazil.',
    title: 'A new market.<br>One partner <em>all the way.</em>',
    description: 'From entering Brazil to day-to-day operations, we connect international brands with local distribution, sales and support.',
    seo: 'Local operations, distribution, sales and support for international brands entering the Brazilian market. Meet GlobalK.',
    alt: 'Shipping containers, an illustrative image of international trade', imageCaption: 'Illustrative image of international trade; this is not a GlobalK operation.',
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
    cta: 'Discuss bringing your brand to Brazil.', contactLabel: 'Ask about market entry',
  },
  economize: {
    category: 'Open-box & retail', summary: 'New possibilities for products. More choices for shoppers.',
    title: 'Open-box<br>and <em>retail.</em>',
    description: 'Economize sells new and open-box products through its physical store, e-commerce and marketplaces.',
    seo: 'Discover Economize: new and open-box products in retail, in-store and online. Visit the online store to browse offers.',
    alt: 'A professional checking inventory in a warehouse, an image published by Economize', imageCaption: 'Image published by Economize; check each item’s condition in the store.',
    audience: 'Discover opportunities in new and open-box products to shop in-store or online.',
    heading: 'Understanding<br><em>open-box products.</em>',
    intro: 'Open-box products may include returned items or items with opened packaging. Clear information about each offer helps customers choose confidently.',
    services: [
      ['Each item’s condition', 'Read the offer description to understand the product’s condition before buying.'],
      ['Shopping online', 'Browse offers and information about each item in the Economize online store.'],
    ],
    externalLabel: 'Visit the store', cta: 'Browse offers<br>at <em>Economize.</em>', contactLabel: 'Visit the store',
  },
  multik: {
    category: 'Organization & everyday products', summary: 'Simple ways to organize the things you use every day.',
    title: 'Small details.<br>A <em>simpler</em> day.',
    description: 'Organizers, labels and practical solutions that help keep everything in its place. Useful products for home, work and daily life.',
    seo: 'Multi-K: cable organizers, labels and everyday products for home and office. Discover a GlobalK brand.',
    alt: 'A Multi-K cable organizer on a work desk', brandAlt: 'Official Multi-K logo in white and yellow', imageCaption: 'A Multi-K cable organizer in use.',
    audience: 'For people and businesses looking for practical organization at home, at work and beyond.',
    heading: 'Less clutter.<br>More room to <em>live.</em>',
    intro: 'We create useful organizational products with attention to detail. Small solutions for everyday needs.',
    services: [
      ['Organize', 'Cable organizers keep accessories together and workspaces tidy.'],
      ['Identify', 'Labels make cables and other items easier to recognize and sort.'],
      ['Simplify', 'Everyday products and storage solutions help make better use of space.'],
    ],
    secondaryAlt: 'Multi-K organizers in use', cta: 'Want to know more about Multi-K products?', contactLabel: 'Ask about the products',
  },
  safek: {
    category: 'Focus & presence', summary: 'Phone-free spaces where each person keeps their device with them.',
    title: 'Fewer distractions.<br>More <em>presence.</em>',
    description: 'A locking pouch that helps create phone-free spaces. People keep their devices with them throughout the experience.',
    seo: 'Safe-K locking pouches help create phone-free spaces in schools, events and workplaces while owners keep their devices.',
    alt: 'Black Safe-K pouch on a dark pedestal with blue lighting', brandAlt: 'Official Safe-K logo in white and blue', imageCaption: 'Safe-K product presentation image.',
    audience: 'For schools, universities, companies and events that value attention and participation.',
    heading: 'How it <em>works.</em>',
    intro: 'A pouch and an unlocking station control access to the phone.',
    services: [
      ['Store', 'On arrival, the phone goes into a Safe-K pouch.'],
      ['Lock', 'The pouch closes and remains with its owner during the activity.'],
      ['Unlock', 'A release station in the designated area lets the owner access the phone.'],
    ],
    externalLabel: 'Explore Safe-K',
  },
  tradek: {
    category: 'Imports & financing', summary: 'Connecting Brazilian companies with opportunities in Asia.',
    title: 'Buying in Asia.<br>Importing with <em>a plan.</em>',
    description: 'Support for international purchases and financing solutions for Brazilian companies importing goods from Asia.',
    seo: 'Trade-K supports imports and financing of international purchases for Brazilian companies. A GlobalK business unit.',
    alt: 'Cargo ship at a port in a Trade-K promotional image', brandAlt: 'Official Trade-K logo in white and green', imageCaption: 'Promotional image supplied by the Trade-K team.',
    audience: 'For Brazilian companies planning international purchases and exploring financing options.',
    heading: 'Purchasing and <em>financing.</em>',
    intro: 'Each project and its terms are assessed individually according to the business’s needs.',
    services: [
      ['International purchasing', 'Support with planning and buying goods in Asia.'],
      ['Financing', 'Evaluation of solutions for purchases and working capital.'],
    ],
    externalLabel: 'Visit the Trade-K website',
  },
};

englishUnits.nanium = {
  category: 'Computers & gaming performance', summary: 'Computer production and assembly focused on gaming.',
  title: 'Computers<br>built for <em>gaming.</em>',
  description: 'Nanium produces and assembles computers with a focus on gaming performance.',
  seo: 'Meet Nanium, a GlobalK brand dedicated to producing and assembling computers focused on gaming performance.',
  audience: 'For people looking for a computer focused on gaming performance.',
  heading: 'Assembly focused<br>on <em>performance.</em>',
  intro: 'Nanium combines computer assembly with a focus on gaming use.',
  services: [],
  contactLabel: 'Ask about computers',
};
englishUnits.realize = {
  category: 'Open-box & B2B lots', summary: 'Open-box product lots for small and medium businesses.',
  title: 'Open-box products<br>for your <em>business.</em>',
  description: 'Realize is the B2B arm of Economize, selling open-box products in lots to businesses.',
  seo: 'Meet Realize: B2B sales of open-box product lots for small and medium businesses, with discounts of up to 50%.',
  audience: 'For small and medium businesses interested in buying open-box products in lots.',
  heading: 'Buying opportunities<br>in <em>lots.</em>',
  intro: 'Contact the team to learn about available lots and items.',
  services: [['Product lots', 'Open-box products available for purchase in lots.'], ['Up to 50% off', 'Discounts of up to 50% on items sold.']],
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
  ['A vision of leadership.', 'With Economize, we aim to become Brazil’s leading name in outlet and open-box retail, expanding access to products in-store and through e-commerce.'],
];
export const timelineEn = timeline.map((item, index) => ({ year: item.year, title: englishTimeline[index][0], text: englishTimeline[index][1] }));

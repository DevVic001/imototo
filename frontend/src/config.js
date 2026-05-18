/** Brand logos — drop client PNGs as logo-dark.png / logo-light.png to override SVG */
export const ASSETS = {
  logoDark: '/assets/logo-dark.svg',
  logoLight: '/assets/logo-light.svg',
};

export const SITE = {
  name: 'Imototo Cleaning Services',
  domain: 'imototocleanings.co.uk',
  email: 'info@imototocleanings.co.uk',
  /** Outlook-safe — address only in ?to= (no display name, no <>) */
  mailto: 'mailto:?to=info@imototocleanings.co.uk',
  phone: '+447823893420',
  phoneDisplay: '+44 7823 893420',
  whatsapp: 'https://wa.me/447823893420',
  address: {
    line1: '20 Clarke Street',
    city: 'Bolton',
    postcode: 'BL1 4HP',
    country: 'United Kingdom',
    full: '20 Clarke Street, Bolton, BL1 4HP, United Kingdom',
  },
  areas: 'Manchester, Bolton and surrounding areas',
  tagline: 'clean space, clean mind..',
  hours: {
    weekdays: 'Mon–Fri: 8:00am – 6:00pm',
    saturday: 'Sat: 9:00am – 4:00pm',
    sunday: 'Sun: Closed (emergency quotes via WhatsApp)',
  },
  social: {
    instagram: 'https://www.instagram.com/imototocleaningmanchester',
    facebook: 'https://www.facebook.com/imototocleaningmanchester',
    tiktok: 'https://www.tiktok.com/@imototocleaningltd',
  },
  /** Shown on hero — update when you have verified Google review count */
  rating: {
    score: '5.0',
    label: 'Client-rated service',
    sublabel: 'Across Manchester & Bolton',
  },
  responseTime: 'Quotes within 24 hours',
};

export const HERO_BADGES = ['Fully insured', 'Free quotes', '7 specialist services'];

export const FAQ_ITEMS = [
  {
    q: 'How do I get a quote?',
    a: 'Use our online quote form, call, or message us on WhatsApp with your property type, size, and preferred date. We usually reply within one business day with clear pricing.',
  },
  {
    q: 'Which areas do you cover?',
    a: 'We serve Manchester, Bolton, and surrounding areas across Greater Manchester. Not sure if we cover you? Send your postcode — we will confirm quickly.',
  },
  {
    q: 'Do you clean short-let rentals and end of tenancy properties?',
    a: 'Yes. We offer timed turnovers for holiday lets and short stays, plus deposit-ready end of tenancy cleans to agency standards.',
  },
  {
    q: 'Are your cleaners insured?',
    a: 'Yes. Our team is professional and fully insured. We bring our own products and equipment unless you request otherwise.',
  },
  {
    q: 'Can I book a one-off or regular clean?',
    a: 'Both. We offer weekly, fortnightly, or monthly home and office cleans, as well as one-off deep cleans, move-outs, and post-construction jobs.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'We will confirm payment options when we send your quote — typically bank transfer or agreed method after the job is booked.',
  },
];

export const SERVICES = [
  {
    id: 'residential',
    title: 'Residential Cleaning',
    short: 'Regular and one-off home cleaning across Greater Manchester.',
    description:
      'We keep houses, flats and family homes fresh and hygienic — from weekly upkeep to detailed one-time cleans, tailored to how you live.',
    accent: 'blue',
  },
  {
    id: 'airbnb',
    title: 'Short-Let & Airbnb Turnovers',
    short: 'Timed cleans between guests for holiday lets and short stays.',
    description:
      'We reset your property between check-outs — kitchens, bathrooms and living areas guest-ready for the next booking, on schedule.',
    accent: 'peach',
  },
  {
    id: 'tenancy',
    title: 'End of Tenancy Cleaning',
    short: 'Deposit-ready deep cleans for landlords and tenants.',
    description:
      'Thorough move-out cleaning that meets agency checklists across Manchester, Bolton and nearby areas.',
    accent: 'blue',
  },
  {
    id: 'move',
    title: 'Move-In / Move-Out Cleaning',
    short: 'Start fresh or hand back with confidence.',
    description:
      'From empty properties to fully furnished homes, we leave every room spotless and welcoming.',
    accent: 'peach',
  },
  {
    id: 'office',
    title: 'Office & Commercial Cleaning',
    short: 'Professional spaces that impress clients and staff.',
    description:
      'Regular or one-off commercial cleaning tailored to your workplace schedule and standards.',
    accent: 'blue',
  },
  {
    id: 'construction',
    title: 'Post-Construction Cleaning',
    short: 'Dust-free, move-in ready after building work.',
    description:
      'We remove debris and fine dust so your property is safe, shiny and ready to use or let.',
    accent: 'peach',
  },
  {
    id: 'deep',
    title: 'Deep Cleaning',
    short: 'Intensive cleans for homes and businesses.',
    description:
      'Detailed top-to-bottom cleaning for kitchens, bathrooms, living areas and high-touch surfaces.',
    accent: 'blue',
  },
];

/** In dev, Vite proxies /api to localhost:5000 */
export const API_BASE = import.meta.env.VITE_API_URL || '';

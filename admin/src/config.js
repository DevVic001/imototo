export const SITE = {
  name: 'Imototo Cleaning Services',
  domain: 'imototocleanings.co.uk',
  phoneDisplay: '+44 7823 893420',
  assetsBase: 'https://imototocleanings.co.uk',
};

export const LOGO_LIGHT = `${SITE.assetsBase}/assets/images/logo-lightt.jpg`;
export const LOGO_DARK = `${SITE.assetsBase}/assets/images/logo-dark.jpg`;

/** Dev: Vite proxies /api. Production: set VITE_API_URL to Render API. */
export const API_BASE = import.meta.env.VITE_API_URL || '';

export const SESSION_KEY = 'imototo-admin-token';

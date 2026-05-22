/** Must match vite `base` / _redirects — secret admin URL path */
export const ADMIN_SECRET_PATH = 'rh8437hr84376gr36f74rf6frr3471f6c7g';

export const SITE = {
  name: 'Imototo Cleaning Services',
  domain: 'imototocleanings.co.uk',
  phoneDisplay: '+44 7823 893420',
  assetsBase: 'https://imototocleanings.co.uk',
};

export const LOGO_LIGHT = `${SITE.assetsBase}/assets/images/logo-lightt.jpg`;
export const LOGO_DARK = `${SITE.assetsBase}/assets/images/logo-dark.jpg`;

/** Same as frontend — calls Render when VITE_API_URL is set in admin/.env */
export const API_BASE = import.meta.env.VITE_API_URL || '';

export const SESSION_KEY = 'imototo-admin-token';

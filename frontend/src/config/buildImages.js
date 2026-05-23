const SLIDE_COPY = [
  {
    title: 'Residential & home cleaning',
    subtitle: 'Regular and one-off cleans across Manchester, Bolton and surrounding areas.',
  },
  {
    title: 'Short-let & rental turnovers',
    subtitle: 'Timed cleans between guests or tenants. Free quotes, insured team.',
  },
  {
    title: 'End of tenancy & office cleaning',
    subtitle: 'Deposit-ready move-out cleans and commercial care for workplaces.',
  },
  {
    title: 'Deep & post-construction cleaning',
    subtitle: 'Intensive cleans and dust removal so your space is move-in ready.',
  },
  {
    title: 'Professional cleaning you can trust',
    subtitle: 'Insured team, clear pricing, on time every visit.',
  },
  {
    title: 'Greater Manchester & Bolton',
    subtitle: 'Homes, rentals and workplaces. One team, consistent standards.',
  },
];

function sortImages(paths) {
  const score = (p) => {
    const n = p.toLowerCase();
    if (n.includes('hero')) return 0;
    if (n.includes('intro')) return 1;
    if (n.includes('kitchen')) return 2;
    if (n.includes('bathroom')) return 3;
    if (n.includes('bedroom') || n.includes('living')) return 4;
    if (n.includes('office') || n.includes('commercial')) return 5;
    return 10;
  };
  return [...paths].sort((a, b) => score(a) - score(b) || a.localeCompare(b));
}

const ABOUT_IMAGE = '/assets/images/cleaning3g98h.jpg';
const GALLERY_MAX = 6;

function isAboutOnlyImage(path) {
  return /cleaning3g98h/i.test(path);
}

function isHeroExcluded(path) {
  return /cleaning328g67/i.test(path);
}

function isBrandLogo(path) {
  return /logo[-_]?dark|logo[-_]?lightt?/i.test(path);
}

export function buildSiteImages(assets) {
  const sorted = sortImages(assets.images || []).filter((p) => !isBrandLogo(p));
  const galleryPool = sorted.filter((p) => !isAboutOnlyImage(p));
  /** Homepage hero carousel — never use About or cleaning328g67 */
  const heroPool = galleryPool.filter((p) => !isHeroExcluded(p));
  const fliers = assets.fliers || [];

  const introSrc = sorted.find((p) => isAboutOnlyImage(p)) || ABOUT_IMAGE;

  const servicesSrc =
    heroPool.find((p) => /office|commercial/i.test(p)) ||
    heroPool.find((p) => /bathroom/i.test(p)) ||
    heroPool[2] ||
    heroPool[0] ||
    '';

  const heroSrc = heroPool[0] || '';

  const quoteSrc =
    heroPool.find((p) => /hero/i.test(p)) ||
    heroPool[0] ||
    '';

  const heroSlides = heroPool.slice(0, 6).map((image, i) => {
    const copy = SLIDE_COPY[i % SLIDE_COPY.length];
    return {
      id: `slide-${i}`,
      title: copy.title,
      subtitle: copy.subtitle,
      image,
      alt: 'Imototo professional cleaning service',
    };
  });

  const gallery = galleryPool.slice(0, GALLERY_MAX).map((src) => ({
    src,
    alt: 'Imototo cleaning, professional results',
  }));

  const flyers = fliers.map((src, i) => ({
    src,
    alt: `Imototo Cleaning Services flyer ${i + 1}`,
    caption:
      i === 0
        ? 'Residential, commercial & specialist cleaning'
        : 'Manchester, Bolton & surrounding areas',
  }));

  return {
    IMAGES: {
      hero: {
        src: heroSrc,
        alt: 'Imototo professional cleaner at work',
      },
      intro: {
        src: introSrc,
        alt: 'Imototo professional cleaning team at work',
      },
      services: {
        src: servicesSrc,
        alt: 'Imototo commercial and specialist cleaning',
      },
      quote: {
        src: quoteSrc,
        alt: 'Request a quote from Imototo Cleaning Services',
      },
    },
    HERO_SLIDES: heroSlides,
    GALLERY: gallery,
    FLYERS: flyers,
  };
}

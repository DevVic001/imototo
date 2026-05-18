import { useReveal } from '../hooks/useReveal';
import { SITE, ASSETS } from '../config';
import { IMAGES } from '../config/images';
import FeatureList from '../components/FeatureList';
import LocalImage from '../components/LocalImage';

const ABOUT_COPY = [
  `At Imototo Cleaning Services, we are committed to providing professional, reliable and affordable cleaning solutions across ${SITE.areas}. We specialise in residential cleaning, end of tenancy and move cleans, office and commercial cleaning, deep cleaning and short-let turnovers — delivering high quality results tailored to the needs of every client.`,
  `We understand the importance of a clean and well maintained environment, whether it's a home, rental property or workplace. Our goal is to provide a service you can depend on, with attention to detail, professionalism and customer satisfaction at the heart of everything we do.`,
  `Your space should feel good to walk into — that is exactly what we deliver. We know deadlines matter: a missed check-out clean, a tenancy handover or a busy office week. We treat every job like it matters, because to you, it does.`,
  `No shortcuts. No excuses. Just spotless spaces and a team you can actually rely on. Choose Imototo Cleaning Services for cleaning you can trust and results you can see.`,
];

const MISSION_POINTS = [
  { icon: 'shield', text: 'Fully insured & professional team' },
  { icon: 'location', text: 'Manchester, Bolton & surrounding areas' },
  { icon: 'star', text: 'Free quotes — no obligation' },
];

export default function About() {
  const block = useReveal();

  return (
    <>
      <header className="page-hero page-hero--with-image">
        {IMAGES.intro.src ? (
          <div className="page-hero__media" aria-hidden="true">
            <LocalImage src={IMAGES.intro.src} alt="" loading="eager" />
            <div className="page-hero__scrim" />
          </div>
        ) : null}
        <div className="container page-hero__inner">
          <img src={ASSETS.logoDark} alt={SITE.name} className="page-hero__logo-single" />
          <p className="section__eyebrow">About us</p>
          <h1 className="section__title">{SITE.name}</h1>
          <p className="section__lead">{SITE.tagline}</p>
        </div>
      </header>

      <section className="section section--white">
        <div className={`container about-split about-split--with-media ${block.className}`} ref={block.ref}>
          {IMAGES.intro.src ? (
            <div className="about-split__media">
              <LocalImage src={IMAGES.intro.src} alt={IMAGES.intro.alt} loading="lazy" />
            </div>
          ) : null}
          <div className="about-split__main">
            {ABOUT_COPY.map((p, i) => (
              <p key={i} className={i === 0 ? 'about-para about-para--lead' : 'about-para'}>
                {p}
              </p>
            ))}
            <div className="about-panel">
              <h3>Our mission</h3>
              <p>
                We take pride in creating spotless, fresh and welcoming spaces while keeping our services
                efficient, trustworthy and competitively priced — whether you need a one-time deep clean or
                regular support.
              </p>
              <FeatureList items={MISSION_POINTS} />
            </div>
          </div>
        </div>

        <div className="container about-brand-strip">
          <img src={ASSETS.logoDark} alt={SITE.name} />
          <p>Trusted cleaning across Greater Manchester — residential, rental and commercial.</p>
        </div>
      </section>
    </>
  );
}

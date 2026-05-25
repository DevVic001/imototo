import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { SITE, SERVICES } from '../config';
import Hero from '../components/Hero';
import TrustStrip from '../components/TrustStrip';
import FaqSection from '../components/FaqSection';
import PhotoGallery from '../components/PhotoGallery';
import LocalImage from '../components/LocalImage';
import { IMAGES } from '../config/images';
import ServiceIcon from '../components/ServiceIcon';
import StarRating from '../components/StarRating';

const HOME_SERVICE_IDS = ['residential', 'airbnb', 'tenancy', 'office'];

const VALUES = [
  {
    id: 'residential',
    title: 'Homes kept spotless',
    text: 'Regular and one-off home cleaning for kitchens, bathrooms and living spaces done properly.',
  },
  {
    id: 'tenancy',
    title: 'Deposit-ready standards',
    text: 'End of tenancy and move cleans that meet agency checklists across Greater Manchester.',
  },
  {
    id: 'office',
    title: 'Commercial reliability',
    text: 'Offices and workplaces kept presentable on a schedule that fits your team.',
  },
];

const STEPS = [
  { title: 'Share your requirements', text: 'Quote form, call or WhatsApp with property type, size and preferred date.' },
  { title: 'Receive a clear quote', text: 'Tailored pricing and schedule, usually within one business day.' },
  { title: 'We clean on time', text: 'Our insured team delivers a thorough, consistent finish every visit.' },
];

const TESTIMONIALS = [
  {
    quote:
      "We've had a fortnightly home clean since the start of the year. They're on time, the kitchen and bathrooms are always done properly, and they message ahead if they're delayed.",
    name: 'Michelle O\'Connor',
    role: 'Home clean · Chorlton, Manchester',
    initial: 'MO',
  },
  {
    quote:
      'We used them for an end-of-tenancy clean before moving out. Everything was done properly and the agency signed the check-off without any issues.',
    name: 'David Higgins',
    role: 'End of tenancy · Bolton',
    initial: 'DH',
  },
  {
    quote:
      'Small office near town. They come in Tuesday evenings. Toilets and kitchen are spot on every week. Easy to sort changes on WhatsApp.',
    name: 'Amrita Shah',
    role: 'Office clean · Manchester',
    initial: 'AS',
  },
];

const homeServices = HOME_SERVICE_IDS.map((id) => SERVICES.find((s) => s.id === id)).filter(Boolean);

export default function Home() {
  const intro = useReveal();
  const values = useReveal();
  const process = useReveal();
  const services = useReveal();
  const reviews = useReveal(); 


  return (
    <div className="home-page">
      <Hero />
      <TrustStrip />

      <section className="section section--white">
        <div className={`container intro-split ${intro.className}`} ref={intro.ref}>
          {IMAGES.intro.src ? (
            <div className="intro-split__media">
              <LocalImage src={IMAGES.intro.src} alt={IMAGES.intro.alt} loading="lazy" />
            </div>
          ) : null}
          <div className="intro-split__copy">
            <p className="section__eyebrow">About Imototo</p>
            <h2 className="section__title">Cleaning you can book with confidence</h2>
            <p className="section__lead">
              Whether it is your family home, a rental between tenants or your workplace, we deliver
              thorough, dependable cleaning across {SITE.areas}.
            </p>
            <ul className="intro-list">
              <li>Insured, vetted cleaning professionals</li>
              <li>Transparent quotes with no hidden fees</li>
              <li>Covering {SITE.areas}</li>
            </ul>
            <div className="section__cta">
              <Link to="/about" className="btn btn--primary">
                Learn about us
              </Link>
              <Link to="/contact" className="btn btn--outline">
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PhotoGallery />

      <section className="section section--alt">
        <div className={`container ${services.className}`} ref={services.ref}>
          <header className="section-head">
            <div>
              <p className="section__eyebrow">Services</p>
              <h2 className="section__title">What we clean</h2>
              <p className="section__lead section__lead--tight">
                From weekly home care to post-build dust removal. One team, consistent standards.
              </p>
            </div>
            <Link to="/services" className="section-head__link">
              View all services
            </Link>
          </header>
          <div className="services-grid services-grid--home">
            {homeServices.map((s) => (
              <article key={s.id} className="card card--service card--service-home">
                <span className="icon-box icon-box--brand service-card__icon-wrap">
                  <ServiceIcon name={s.id} />
                </span>
                <h3>{s.title}</h3>
                <p>{s.short}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className={`container ${values.className}`} ref={values.ref}>
          <p className="section__eyebrow section__eyebrow--center">Why clients choose us</p>
          <h2 className="section__title section__title--center">Homes, rentals and workplaces</h2>
          <div className="value-row">
            {VALUES.map((v) => (
              <article key={v.title} className="value-card">
                <span className="icon-box icon-box--brand">
                  <ServiceIcon name={v.id} />
                </span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className={`container ${process.className}`} ref={process.ref}>
          <p className="section__eyebrow section__eyebrow--center">How it works</p>
          <h2 className="section__title section__title--center">Simple from first message to finish</h2>
          <ol className="process-timeline">
            {STEPS.map((s, i) => (
              <li key={s.title} className="process-timeline__step">
                <span className="process-timeline__num">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--white">
        <div className={`container ${reviews.className}`} ref={reviews.ref}>
          <p className="section__eyebrow section__eyebrow--center">Client feedback</p>
          <h2 className="section__title section__title--center">What our clients say</h2>
          <p className="section__lead section__lead--center">
            Homes, rentals and workplaces across Manchester and Bolton.
          </p>
          <div className="testimonials-grid testimonials-grid--premium">
            {TESTIMONIALS.map((t) => (
              <blockquote key={t.name} className="testimonial-card testimonial-card--premium">
                <StarRating />
                <p className="testimonial-card__quote">{t.quote}</p>
                <footer className="testimonial-card__author">
                  <span className="testimonial-card__avatar" aria-hidden="true">
                    {t.initial}
                  </span>
                  <span>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <FaqSection />

      <section className="cta-premium" aria-label="Get in touch">
        <div className="container cta-premium__inner">
          <div className="cta-premium__copy">
            <p className="section__eyebrow cta-premium__eyebrow">Get started</p>
            <h2>Request your free quote today</h2>
            <p>
              {SITE.areas}. Call, WhatsApp or email and we respond quickly with clear pricing.
            </p>
          </div>
          <div className="cta-premium__actions">
            <Link to="/contact" className="btn btn--primary btn--lg">
              Request a quote
            </Link>
            <a href={`tel:${SITE.phone}`} className="btn btn--outline btn--lg">
              {SITE.phoneDisplay}
            </a>
            <a href={SITE.whatsapp} className="btn btn--ghost-dark btn--lg" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

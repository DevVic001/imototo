import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { SERVICES, SITE, ASSETS } from '../config';
import { IMAGES } from '../config/images';
import ServiceIcon from '../components/ServiceIcon';
import LocalImage from '../components/LocalImage';

export default function Services() {
  const grid = useReveal();

  return (
    <>
      <header className="page-hero page-hero--with-image">
        {IMAGES.services.src ? (
          <div className="page-hero__media" aria-hidden="true">
            <LocalImage src={IMAGES.services.src} alt="" loading="eager" fill />
            <div className="page-hero__scrim" />
          </div>
        ) : null}
        <div className="container page-hero__inner">
          <img src={ASSETS.logoDark} alt={SITE.name} className="page-hero__logo-single" />
          <p className="section__eyebrow">Services</p>
          <h1 className="section__title">
            What we <span>offer</span>
          </h1>
          <p className="section__lead">
            Detailed cleaning solutions for homes, rentals, offices and commercial properties across{' '}
            {SITE.areas}.
          </p>
        </div>
      </header>

      <section className="section section--white">
        <div className={`container ${grid.className}`} ref={grid.ref}>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <article key={s.id} className="card">
                <span className={`icon-box service-card__icon-wrap icon-box--${s.accent}`}>
                  <ServiceIcon name={s.id} />
                </span>
                <h3>{s.title}</h3>
                <p className="card__text">{s.description}</p>
                <Link to="/contact" className="btn btn--soft">
                  Get a quote
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

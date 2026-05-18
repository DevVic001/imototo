import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { SERVICES, SITE } from '../config';
import { IMAGES } from '../config/images';
import ServiceIcon from '../components/ServiceIcon';
import PageHero from '../components/PageHero';

export default function Services() {
  const grid = useReveal();

  return (
    <>
      <PageHero
        imageSrc={IMAGES.services.src}
        breadcrumb="Services"
        eyebrow="Services"
        title={
          <>
            What we <span>offer</span>
          </>
        }
        lead={`Detailed cleaning solutions for homes, rentals, offices and commercial properties across ${SITE.areas}.`}
      />

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

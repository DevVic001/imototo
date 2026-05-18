import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { FLYERS } from '../config/images';

function FlyerCard({ flyer }) {
  const [missing, setMissing] = useState(false);

  return (
    <figure className={`flyer-card ${missing ? 'flyer-card--missing' : ''}`}>
      {!missing ? (
        <img src={flyer.src} alt={flyer.alt} loading="lazy" onError={() => setMissing(true)} />
      ) : (
        <div className="flyer-card__placeholder" role="img" aria-label={flyer.alt}>
          <span className="flyer-card__placeholder-icon" aria-hidden="true">
            ◆
          </span>
          <p>
            Add your flyer image to
            <br />
            <code>public/assets/fliers/</code>
          </p>
        </div>
      )}
      <figcaption>{flyer.caption}</figcaption>
    </figure>
  );
}

export default function FlyerShowcase() {
  const block = useReveal();

  if (!FLYERS.length) return null;

  return (
    <section className="section section--white flyer-showcase" aria-label="Marketing flyers">
      <div className={`container ${block.className}`} ref={block.ref}>
        <p className="section__eyebrow section__eyebrow--center">Imototo</p>
        <h2 className="section__title section__title--center">
          Services &amp; <span>areas we cover</span>
        </h2>
        <p className="section__lead section__lead--center">
          From our client flyers — homes, rentals, offices and deep cleaning across Manchester and Bolton.
        </p>
        <div className="flyer-showcase__grid">
          {FLYERS.map((flyer) => (
            <FlyerCard key={flyer.src} flyer={flyer} />
          ))}
        </div>
        <div className="section__cta section__cta--center">
          <Link to="/services" className="btn btn--soft">
            View all services
          </Link>
          <Link to="/contact" className="btn btn--primary">
            Get a Free Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

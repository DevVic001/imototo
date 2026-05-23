import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { FLYERS } from '../config/images';
import LocalImage from './LocalImage';

function FlyerCard({ flyer }) {
  return (
    <figure className="flyer-card">
      <LocalImage
        src={flyer.src}
        alt={flyer.alt}
        loading="lazy"
        onMissing={
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
        }
      />
      <figcaption>{flyer.caption}</figcaption>
    </figure>
  );
}

export default function FlyerShowcase() {
  const block = useReveal();

  if (!FLYERS.length) return null;

  return (
    <section className="section section--alt flyer-showcase" aria-label="Imototo service flyers">
      <div className={`container ${block.className}`} ref={block.ref}>
        <p className="section__eyebrow section__eyebrow--center">Our flyers</p>
        <h2 className="section__title section__title--center">Imototo marketing flyers</h2>
        <p className="section__lead section__lead--center">
          The services we offer across Greater Manchester: homes, Airbnb, end of tenancy, offices
          and more.
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
            Get a free quote
          </Link>
        </div>
      </div>
    </section>
  );
}

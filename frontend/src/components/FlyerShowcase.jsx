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

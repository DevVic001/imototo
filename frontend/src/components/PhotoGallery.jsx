import { useReveal } from '../hooks/useReveal';
import { GALLERY } from '../config/images';
import LocalImage from './LocalImage';

export default function PhotoGallery() {
  const block = useReveal();

  if (!GALLERY.length) return null;

  return (
    <section className="section section--alt photo-gallery" aria-label="Cleaning services we provide">
      <div className={`container ${block.className}`} ref={block.ref}>
        <p className="section__eyebrow section__eyebrow--center">Our services</p>
        <h2 className="section__title section__title--center">The spaces we clean</h2>
        <p className="section__lead section__lead--center">
          Kitchens, bathrooms, living areas and workplaces. Professional cleaning across Manchester,
          Bolton and surrounding areas.
        </p>
        <div className="photo-gallery__grid">
          {GALLERY.map((item) => (
            <figure key={item.src} className="photo-gallery__item">
              <LocalImage src={item.src} alt={item.alt} loading="lazy" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

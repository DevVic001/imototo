import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../config';
import { HERO_SLIDES } from '../config/images';

const AUTOPLAY_MS = 8000;

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const slides = HERO_SLIDES;
  const slide = slides[index] ?? slides[0];
  const multi = slides.length > 1;

  if (!slide) {
    return (
      <section id="home" className="hero-carousel hero-carousel--empty" aria-label="Introduction">
        <div className="container hero-carousel__content">
          <p className="hero-carousel__eyebrow">Imototo · {SITE.areas}</p>
          <h1 className="hero-carousel__title">Professional cleaning you can trust</h1>
          <p className="hero-carousel__subtitle">
            Add photos to <code>public/assets/images/</code> then refresh.
          </p>
        </div>
      </section>
    );
  }

  useEffect(() => {
    if (!multi) return undefined;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [multi, slides.length]);

  return (
    <section id="home" className="hero-carousel" aria-roledescription="carousel">
      <div className="hero-carousel__bg" aria-hidden="true">
        <img
          key={slide.id}
          className="hero-carousel__bg-slide is-active"
          src={slide.image}
          alt=""
          width={1600}
          height={900}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable={false}
        />
        <div className="hero-carousel__scrim" />
        <div className="hero-carousel__noise" />
        <div className="hero-carousel__vignette" />
      </div>

      {multi && (
        <div className="hero-carousel__progress" key={slide.id} aria-hidden="true">
          <div
            className="hero-carousel__progress-fill"
            style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
          />
        </div>
      )}

      <div className="hero-carousel__content container">
        <div className="hero-carousel__copy">
          <div className="hero-carousel__copy-inner" key={slide.id}>
            <p className="hero-carousel__eyebrow">Imototo · {SITE.areas}</p>
            <h1 className="hero-carousel__title">{slide.title}</h1>
            <p className="hero-carousel__subtitle">{slide.subtitle}</p>
            <div className="hero-carousel__cta">
              <Link to="/contact" className="btn btn--hero-solid btn--lg">
                Get a free quote
              </Link>
              <a
                href={SITE.whatsapp}
                className="btn btn--outline-light btn--lg"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="hero-carousel__panel" aria-hidden="true">
          <div className="hero-carousel__panel-frame">
            <img
              key={`${slide.id}-preview`}
              src={slide.image}
              alt={slide.alt}
              width={560}
              height={360}
              loading="eager"
              decoding="async"
              className="hero-carousel__preview-img"
            />
            <div className="hero-carousel__panel-shine" />
          </div>
        </div>
      </div>

      {multi && (
        <div className="hero-carousel__controls container">
          <button
            type="button"
            className="hero-carousel__arrow"
            aria-label="Previous slide"
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
          >
            ‹
          </button>
          <div className="hero-carousel__dots" role="tablist" aria-label="Slides">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={`hero-carousel__dot ${i === index ? 'is-active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}: ${s.title}`}
              />
            ))}
          </div>
          <button
            type="button"
            className="hero-carousel__arrow"
            aria-label="Next slide"
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}

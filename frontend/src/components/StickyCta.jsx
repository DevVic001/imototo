import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../config';

export default function StickyCta() {
  const [pastHero, setPastHero] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('.hero-carousel');
    const footer = document.querySelector('.footer');
    if (!hero) return undefined;

    const heroObserver = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { root: null, threshold: 0, rootMargin: '-80px 0px 0px 0px' }
    );

    heroObserver.observe(hero);

    let footerObserver;
    if (footer) {
      footerObserver = new IntersectionObserver(
        ([entry]) => setFooterInView(entry.isIntersecting),
        { root: null, threshold: 0, rootMargin: '0px 0px -72px 0px' }
      );
      footerObserver.observe(footer);
    }

    return () => {
      heroObserver.disconnect();
      footerObserver?.disconnect();
    };
  }, []);

  const visible = pastHero && !footerInView;

  return (
    <div className={`sticky-cta ${visible ? 'sticky-cta--visible' : ''}`} aria-hidden={!visible}>
      <a href={SITE.whatsapp} className="btn btn--whatsapp btn--sm" target="_blank" rel="noreferrer">
        WhatsApp
      </a>
      <Link to="/contact" className="btn btn--primary btn--sm">
        Free quote
      </Link>
    </div>
  );
}

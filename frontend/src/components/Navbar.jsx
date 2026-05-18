import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { SITE, ASSETS } from '../config';

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/services', label: 'Services' },
    { to: '/contact', label: 'Get a Quote' },
  ];

  const overHero = isHome && !scrolled;
  const navClass = ['nav', overHero ? 'nav--hero' : 'nav--solid', open ? 'nav--open' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={navClass}>
      <div className="container nav__inner">
        <Link to="/" className="nav__logo" onClick={() => setOpen(false)}>
          <img
            src={overHero ? ASSETS.logoLight : ASSETS.logoDark}
            alt={SITE.name}
            width={160}
            height={48}
          />
        </Link>

        <nav className="nav__desktop" aria-label="Main navigation">
          <ul className="nav__links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <a href={SITE.whatsapp} className="btn btn--whatsapp btn--sm" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </nav>

        <button
          type="button"
          className={`nav__toggle ${open ? 'nav__toggle--active' : ''}`}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="nav__toggle-box">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      <button
        type="button"
        className={`nav__backdrop ${open ? 'nav__backdrop--visible' : ''}`}
        aria-hidden={!open}
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
      />

      <aside id="mobile-menu" className={`nav__drawer ${open ? 'nav__drawer--open' : ''}`} aria-hidden={!open}>
        <div className="nav__drawer-head">
          <img src={ASSETS.logoDark} alt="" height={46} />
          <button type="button" className="nav__drawer-close" aria-label="Close menu" onClick={() => setOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <nav className="nav__drawer-nav" aria-label="Mobile navigation">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className="nav__drawer-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav__drawer-actions">
          <a href={SITE.whatsapp} className="btn btn--whatsapp" target="_blank" rel="noreferrer">
            WhatsApp {SITE.phoneDisplay}
          </a>
          <Link to="/contact" className="btn btn--primary" onClick={() => setOpen(false)}>
            Get a Free Quote
          </Link>
          <a href={SITE.mailto} className="nav__drawer-email" title={SITE.email}>
            Email us
          </a>
        </div>
      </aside>
    </header>
  );
}

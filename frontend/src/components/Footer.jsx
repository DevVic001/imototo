import { Link } from 'react-router-dom';
import { SITE, SERVICES, ASSETS } from '../config';

const SOCIAL = [
  { label: 'Instagram', href: SITE.social.instagram },
  { label: 'Facebook', href: SITE.social.facebook },
  { label: 'TikTok', href: SITE.social.tiktok },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src={ASSETS.logoDark} alt={SITE.name} />
            </Link>
            <p className="footer__tagline">{SITE.tagline}</p>
            <p className="footer__areas">Professional cleaning across {SITE.areas}.</p>
            <ul className="footer__social">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__title">Quick links</h4>
            <ul className="contact-info-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Get a Quote</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer__title">Services</h4>
            <ul className="contact-info-list">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <Link to="/services">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="footer__title">Contact</h4>
            <ul className="contact-info-list">
              <li>
                <span>
                  <strong>Based in</strong>
                  {SITE.address.full}
                </span>
              </li>
              <li>
                <span>
                  <strong>Phone / WhatsApp</strong>
                  <a href={SITE.whatsapp}>{SITE.phoneDisplay}</a>
                </span>
              </li>
              <li>
                <span>
                  <strong>Email</strong>
                  <span className="footer__email">{SITE.email}</span>
                  <br />
                  <a href={SITE.mailto} className="footer__email-link">
                    Send email
                  </a>
                </span>
              </li>
              <li>
                <span>
                  <strong>Hours</strong>
                  {SITE.hours.weekdays}
                  <br />
                  {SITE.hours.saturday}
                  <br />
                  {SITE.hours.sunday}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.{' '}
            <a href={`https://${SITE.domain}`}>{SITE.domain}</a>
          </p>
          <p className="footer__credit">
            Developed by{' '}
            <a href="https://wa.me/2349036800604" target="_blank" rel="noreferrer">
              Vicotech Digital Services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

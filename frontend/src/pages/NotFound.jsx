import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../config';

export default function NotFound() {
  useEffect(() => {
    document.title = `Page not found | ${SITE.name}`;
    return () => {
      document.title = `${SITE.name} | Home & Commercial Cleaning Manchester & Bolton`;
    };
  }, []);

  return (
    <section className="section section--alt not-found">
      <div className="container not-found__inner">
        <p className="not-found__code" aria-hidden="true">
          404
        </p>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__lead">
          That link doesn&apos;t exist or may have moved. Try one of the pages below or get a free quote.
        </p>
        <div className="not-found__actions">
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
          <Link to="/contact" className="btn btn--secondary">
            Get a quote
          </Link>
        </div>
        <ul className="not-found__links">
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </div>
    </section>
  );
}

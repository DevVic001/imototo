import { Link } from 'react-router-dom';
import PageHero from './PageHero';
import { SITE } from '../config';
import { IMAGES } from '../config/images';

/**
 * @param {{ breadcrumb: string, title: string, lead: string, updated: string, children: import('react').ReactNode }} props
 */
export default function LegalDocument({ breadcrumb, title, lead, updated, children }) {
  const heroSrc = IMAGES.hero?.src;

  return (
    <>
      <PageHero
        imageSrc={heroSrc}
        breadcrumb={breadcrumb}
        eyebrow="Legal"
        title={title}
        lead={lead}
      />
      <section className="section section--white">
        <div className="container legal-doc">
          <p className="legal-doc__updated">Last updated: {updated}</p>
          {children}
          <nav className="legal-doc__nav" aria-label="Related legal pages">
            <Link to="/terms">Terms &amp; conditions</Link>
            <Link to="/privacy">Privacy &amp; GDPR</Link>
            <Link to="/contact">Contact us</Link>
          </nav>
          <p className="legal-doc__contact">
            Questions? Email{' '}
            <a href={SITE.mailto}>{SITE.email}</a> or call{' '}
            <a href={SITE.whatsapp}>{SITE.phoneDisplay}</a>.
          </p>
        </div>
      </section>
    </>
  );
}

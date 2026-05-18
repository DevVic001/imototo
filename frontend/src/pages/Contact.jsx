import QuoteForm from '../components/QuoteForm';
import ServiceIcon from '../components/ServiceIcon';
import PageHero from '../components/PageHero';
import { SITE } from '../config';
import { IMAGES } from '../config/images';

const CONTACT_ROWS = [
  { icon: 'phone', label: 'WhatsApp / Call', value: SITE.phoneDisplay, href: SITE.whatsapp },
  { icon: 'mail', label: 'Email', value: SITE.email, href: SITE.mailto },
  {
    icon: 'location',
    label: 'Address',
    value: SITE.address.full,
    href: null,
  },
  {
    icon: 'clock',
    label: 'Hours',
    value: `${SITE.hours.weekdays} · ${SITE.hours.saturday}`,
    href: null,
  },
];

export default function Contact() {
  const heroSrc = IMAGES.quote?.src || IMAGES.hero?.src;

  return (
    <>
      <PageHero
        imageSrc={heroSrc}
        breadcrumb="Get a quote"
        eyebrow="Get a quote"
        title={
          <>
            Request a <span>free quote</span>
          </>
        }
        lead={`Tell us about your property — we respond quickly with clear pricing across ${SITE.areas}.`}
      />

      <section className="section section--alt">
        <div className="container quote-layout">
          <QuoteForm />
          <aside className="quote-sidebar">
            <div className="card">
              <h3>Contact us directly</h3>
              {CONTACT_ROWS.map((row) => (
                <div key={row.label} className="contact-info-row">
                  <span className="icon-box icon-box--sm icon-box--soft">
                    <ServiceIcon name={row.icon} />
                  </span>
                  <div className="contact-info-row__body">
                    <strong>{row.label}</strong>
                    {row.href ? (
                      row.icon === 'mail' ? (
                        <>
                          <span>{row.value}</span>
                          <a href={row.href} className="contact-email-send">
                            Send email
                          </a>
                        </>
                      ) : (
                        <a href={row.href}>{row.value}</a>
                      )
                    ) : (
                      <span>{row.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="card social-card">
              <h3>Follow us</h3>
              <p className="social-card__hint">
                @imototocleaningmanchester · @imototocleaningltd
              </p>
              <div className="social-card__links">
                <a href={SITE.social.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a href={SITE.social.facebook} target="_blank" rel="noreferrer">
                  Facebook
                </a>
                <a href={SITE.social.tiktok} target="_blank" rel="noreferrer">
                  TikTok
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

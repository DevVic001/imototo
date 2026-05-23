import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { API_BASE, SITE } from '../config';
import { IMAGES } from '../config/images';

const DEFAULT_TITLE = 'Imototo Cleaning Services | Home & Commercial Cleaning Manchester & Bolton';
const VERIFY_TIMEOUT_MS = 15000;

function hasTokenInUrl() {
  return new URLSearchParams(window.location.search).has('t');
}

export default function QuoteThankYou() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  const [status, setStatus] = useState('loading');

  // No token on first paint or after refresh → never show thank-you (unless verifying now).
  useLayoutEffect(() => {
    sessionStorage.removeItem('imototo-quote-thank-you');
    if (!token) {
      setStatus('denied');
    }
  }, [token]);

  // Browser back/forward cache can restore the old “success” screen — force a real check.
  useEffect(() => {
    const onPageShow = (event) => {
      if (event.persisted && !hasTokenInUrl()) {
        window.location.replace('/contact');
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/quote/thank-you-verify?t=${encodeURIComponent(token)}`,
          { signal: controller.signal }
        );
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;

        if (res.ok && data.ok) {
          setStatus('ok');
          window.history.replaceState(null, '', '/contact/thank-you');
          document.title = 'Quote received | Imototo Cleaning Services';
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'generate_lead', {
              event_category: 'quote',
              event_label: 'contact_form',
            });
          }
        } else {
          setStatus('denied');
        }
      } catch {
        if (!cancelled) setStatus('denied');
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
      controller.abort();
      document.title = DEFAULT_TITLE;
    };
  }, [token]);

  if (status === 'loading') {
    return (
      <section className="section section--alt">
        <div className="container quote-thank-you">
          <p className="quote-thank-you__loading">Confirming your request…</p>
        </div>
      </section>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/contact" replace />;
  }

  const heroSrc = IMAGES.quote?.src || IMAGES.hero?.src;

  return (
    <>
      <PageHero
        imageSrc={heroSrc}
        breadcrumb="Quote received"
        eyebrow="Thank you"
        title={
          <>
            We&apos;ve received your <span>quote request</span>
          </>
        }
        lead="We'll reply as soon as we can, usually within one business day, at the email you provided."
      />

      <section className="section section--alt">
        <div className="container quote-thank-you">
          <div className="quote-thank-you__card card">
            <h2>What happens next?</h2>
            <ul className="quote-thank-you__list">
              <li>We review your property details and service type.</li>
              <li>We send clear pricing and availability to your inbox.</li>
              <li>
                Need it sooner? Call or WhatsApp{' '}
                <a href={SITE.whatsapp}>{SITE.phoneDisplay}</a>.
              </li>
            </ul>
            <div className="quote-thank-you__actions">
              <Link to="/" className="btn btn--secondary">
                Back to home
              </Link>
              <Link to="/services" className="btn btn--primary">
                View services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

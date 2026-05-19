import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE, SERVICES, SITE } from '../config';
import FormToast from './FormToast';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function maxDateIso() {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return d.toISOString().slice(0, 10);
}

/** YYYY-MM-DD only — real calendar date, 4-digit year */
function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, day] = value.split('-').map(Number);
  if (y < 2000 || y > 2100) return null;
  const d = new Date(y, m - 1, day);
  if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== day) return null;
  return d;
}

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  street: '',
  city: '',
  postcode: '',
  service: '',
  propertyType: '',
  bedrooms: '',
  bathrooms: '',
  sqft: '',
  preferredDate: '',
  preferredTime: '',
  message: '',
  heardFrom: '',
  privacyConsent: false,
};

export default function QuoteForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (e) => {
    const { name, value } = e.target;
    let next = value;

    if (name === 'preferredDate' && value) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return;
      if (!parseIsoDate(value)) return;
    }

    if ((name === 'bedrooms' || name === 'bathrooms') && value !== '') {
      const n = Number(value);
      if (Number.isNaN(n) || n < 0 || n > 50) return;
    }

    setForm((f) => ({ ...f, [name]: next }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  };

  const blurDate = (e) => {
    const { value } = e.target;
    if (!value) return;
    const parsed = parseIsoDate(value);
    if (!parsed) {
      setForm((f) => ({ ...f, preferredDate: '' }));
      setErrors((err) => ({ ...err, preferredDate: 'Enter a valid date (year must be 4 digits)' }));
      return;
    }
    const min = parseIsoDate(todayIso());
    const max = parseIsoDate(maxDateIso());
    if (parsed < min || parsed > max) {
      setForm((f) => ({ ...f, preferredDate: '' }));
      setErrors((err) => ({
        ...err,
        preferredDate: 'Choose a date between today and 2 years from now',
      }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) {
      e.phone = 'Enter a valid phone number';
    }
    if (!form.street.trim()) e.street = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.postcode.trim()) e.postcode = 'Required';
    if (!form.service) e.service = 'Select a service';
    if (!form.message.trim()) e.message = 'Tell us about your cleaning needs';
    if (!form.privacyConsent) e.privacyConsent = 'You must agree to the privacy policy';

    if (form.preferredDate.trim()) {
      const parsed = parseIsoDate(form.preferredDate.trim());
      if (!parsed) {
        e.preferredDate = 'Enter a valid date (year must be 4 digits)';
      } else {
        const min = parseIsoDate(todayIso());
        const max = parseIsoDate(maxDateIso());
        if (parsed < min || parsed > max) {
          e.preferredDate = 'Choose a date between today and 2 years from now';
        }
      }
    }

    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/api/quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(form)
              .filter(([key]) => key !== 'privacyConsent')
              .map(([key, value]) => [
                key,
                typeof value === 'string' ? value.trim() : value,
              ])
          )
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      const thankYouToken = data.thankYouToken;
      if (!thankYouToken || typeof thankYouToken !== 'string') {
        throw new Error('Invalid server response');
      }
      navigate(`/contact/thank-you?t=${encodeURIComponent(thankYouToken)}`, { replace: true });
      return;
    } catch (err) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {status === 'error' && (
        <FormToast
          type="error"
          title="Could not send"
          message={`Something went wrong. WhatsApp ${SITE.phoneDisplay} or email ${SITE.email}.`}
          onClose={() => setStatus(null)}
          autoCloseMs={10000}
        />
      )}

    <form className="quote-form-card" onSubmit={submit} noValidate>
      <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>Get a Free Quote</h2>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
        Fill in the form below and we&apos;ll get back to you shortly. Fields marked{' '}
        <span className="form-required-mark">*</span> are required.
      </p>

      <h3 className="quote-section-title">Contact details</h3>
      <div className="form-row">
        <div className={`form-group ${errors.firstName ? 'form-group--error' : ''}`}>
          <label htmlFor="firstName">First name *</label>
          <input id="firstName" name="firstName" value={form.firstName} onChange={set} required aria-required="true" autoComplete="given-name" />
          {errors.firstName && <p className="form-error">{errors.firstName}</p>}
        </div>
        <div className={`form-group ${errors.lastName ? 'form-group--error' : ''}`}>
          <label htmlFor="lastName">Last name *</label>
          <input id="lastName" name="lastName" value={form.lastName} onChange={set} required aria-required="true" autoComplete="family-name" />
          {errors.lastName && <p className="form-error">{errors.lastName}</p>}
        </div>
      </div>
      <div className="form-row">
        <div className={`form-group ${errors.email ? 'form-group--error' : ''}`}>
          <label htmlFor="email">Email *</label>
          <input id="email" name="email" type="email" value={form.email} onChange={set} required aria-required="true" autoComplete="email" />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div className={`form-group ${errors.phone ? 'form-group--error' : ''}`}>
          <label htmlFor="phone">Phone *</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={set} required aria-required="true" autoComplete="tel" inputMode="tel" />
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>
      </div>

      <h3 className="quote-section-title">Address</h3>
      <div className={`form-group ${errors.street ? 'form-group--error' : ''}`}>
        <label htmlFor="street">Street address *</label>
        <input id="street" name="street" value={form.street} onChange={set} required aria-required="true" autoComplete="street-address" />
        {errors.street && <p className="form-error">{errors.street}</p>}
      </div>
      <div className="form-row">
        <div className={`form-group ${errors.city ? 'form-group--error' : ''}`}>
          <label htmlFor="city">City *</label>
          <input id="city" name="city" value={form.city} onChange={set} required aria-required="true" autoComplete="address-level2" />
          {errors.city && <p className="form-error">{errors.city}</p>}
        </div>
        <div className={`form-group ${errors.postcode ? 'form-group--error' : ''}`}>
          <label htmlFor="postcode">Postcode *</label>
          <input id="postcode" name="postcode" value={form.postcode} onChange={set} required aria-required="true" autoComplete="postal-code" />
          {errors.postcode && <p className="form-error">{errors.postcode}</p>}
        </div>
      </div>

      <h3 className="quote-section-title">Service information</h3>
      <div className={`form-group ${errors.service ? 'form-group--error' : ''}`}>
        <label htmlFor="service">Service needed *</label>
        <select id="service" name="service" value={form.service} onChange={set} required aria-required="true">
          <option value="">Select a service</option>
          {SERVICES.map((s) => (
            <option key={s.id} value={s.title}>
              {s.title}
            </option>
          ))}
        </select>
        {errors.service && <p className="form-error">{errors.service}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="propertyType">Property type</label>
        <select id="propertyType" name="propertyType" value={form.propertyType} onChange={set}>
          <option value="">Select type</option>
          <option>Residential home</option>
          <option>Apartment</option>
          <option>House / Bungalow</option>
          <option>Two / Three storey</option>
          <option>Commercial</option>
          <option>Short-let / Holiday rental</option>
          <option>Post-construction</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="bedrooms">Bedrooms</label>
          <input id="bedrooms" name="bedrooms" type="number" min="0" value={form.bedrooms} onChange={set} />
        </div>
        <div className="form-group">
          <label htmlFor="bathrooms">Bathrooms</label>
          <input id="bathrooms" name="bathrooms" type="number" min="0" value={form.bathrooms} onChange={set} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="sqft">Approx. square feet (optional)</label>
        <input id="sqft" name="sqft" value={form.sqft} onChange={set} />
      </div>

      <h3 className="quote-section-title">Your availability</h3>
      <div className="form-row">
        <div className={`form-group ${errors.preferredDate ? 'form-group--error' : ''}`}>
          <label htmlFor="preferredDate">Preferred date (optional)</label>
          <input
            id="preferredDate"
            name="preferredDate"
            type="date"
            value={form.preferredDate}
            onChange={set}
            onBlur={blurDate}
            min={todayIso()}
            max={maxDateIso()}
          />
          {errors.preferredDate && <p className="form-error">{errors.preferredDate}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="preferredTime">Preferred time (optional)</label>
          <select id="preferredTime" name="preferredTime" value={form.preferredTime} onChange={set}>
            <option value="">Any time</option>
            <option>Morning</option>
            <option>Afternoon</option>
            <option>Evening</option>
          </select>
        </div>
      </div>

      <div className={`form-group ${errors.message ? 'form-group--error' : ''}`}>
        <label htmlFor="message">Additional details *</label>
        <textarea id="message" name="message" rows={5} value={form.message} onChange={set} required aria-required="true" placeholder="Areas to clean, pets on site, access codes, etc." />
        {errors.message && <p className="form-error">{errors.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="heardFrom">How did you hear about us?</label>
        <input id="heardFrom" name="heardFrom" value={form.heardFrom} onChange={set} />
      </div>

      <div className={`form-group form-group--checkbox ${errors.privacyConsent ? 'form-group--error' : ''}`}>
        <label className="form-checkbox">
          <input
            type="checkbox"
            name="privacyConsent"
            checked={form.privacyConsent}
            onChange={(e) => {
              setForm((f) => ({ ...f, privacyConsent: e.target.checked }));
              if (errors.privacyConsent) setErrors((err) => ({ ...err, privacyConsent: '' }));
            }}
          />
          <span>
            I agree to the <Link to="/privacy">Privacy Policy</Link> and{' '}
            <Link to="/terms">Terms &amp; conditions</Link>. I understand my details will be used to respond
            to my enquiry.
          </span>
        </label>
        {errors.privacyConsent && <p className="form-error">{errors.privacyConsent}</p>}
      </div>

      <button type="submit" className="btn btn--primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
        {loading ? 'Sending…' : 'Submit quote request'}
      </button>
    </form>
    </>
  );
}

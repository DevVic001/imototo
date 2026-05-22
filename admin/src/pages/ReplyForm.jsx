import { useRef, useState } from 'react';
import { adminLogout, sendCustomerReply } from '../api';
import AdminToast from '../components/AdminToast';
import { LOGO_LIGHT, SITE } from '../config';

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

const initial = {
  to: '',
  customerName: '',
  subject: 'Your cleaning quote',
  message: '',
};

export default function ReplyForm({ onLogout }) {
  const fileInputRef = useRef(null);
  const [form, setForm] = useState(initial);
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);

  const set = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((err) => ({ ...err, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    const email = form.to.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.to = 'Enter the customer email from their quote request';
    }
    if (!form.subject.trim() || form.subject.trim().length < 3) {
      next.subject = 'Subject is required';
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      next.message = 'Message must be at least 10 characters';
    }
    if (attachment && attachment.size > MAX_ATTACHMENT_BYTES) {
      next.attachment = 'File must be 5 MB or smaller';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setAttachment(file);
    if (errors.attachment) setErrors((err) => ({ ...err, attachment: '' }));
  };

  const clearAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setToast(null);
    try {
      await sendCustomerReply(
        {
          to: form.to.trim(),
          customerName: form.customerName.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
        },
        attachment
      );
      setToast({
        type: 'success',
        title: 'Email sent',
        message: attachment
          ? 'Your reply and attachment were delivered to the customer.'
          : 'Your reply was delivered to the customer.',
      });
      setForm((f) => ({ ...initial, to: f.to, customerName: f.customerName }));
      clearAttachment();
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Could not send',
        message: err.message || 'Please try again in a moment.',
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await adminLogout();
    onLogout();
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar admin-topbar--compact">
        <div className="admin-topbar__row">
          <div className="admin-topbar__brand admin-topbar__brand--sm">
            <img src={LOGO_LIGHT} alt="" className="admin-topbar__logo" />
          </div>
          <button type="button" className="admin-logout" onClick={logout}>
            Sign out
          </button>
        </div>
        <h1 className="admin-topbar__title">Send quote reply</h1>
        <p className="admin-topbar__sub">
          Copy the customer email from your inbox, write your reply, then send.
        </p>
      </header>

      <main className="admin-main">
        {toast ? (
          <AdminToast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        ) : null}

        <form className="admin-card quote-form-card" onSubmit={submit}>
          <h2 className="quote-section-title">Customer</h2>

          <div className={`form-group ${errors.to ? 'form-group--error' : ''}`}>
            <label htmlFor="to">
              Customer email <span className="form-required-mark">*</span>
            </label>
            <input
              id="to"
              type="email"
              name="to"
              value={form.to}
              onChange={set}
              placeholder="customer@email.com"
              autoComplete="email"
              disabled={loading}
            />
            {errors.to ? <p className="form-error">{errors.to}</p> : null}
          </div>

          <div className="form-group">
            <label htmlFor="customerName">Customer first name (optional)</label>
            <input
              id="customerName"
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={set}
              placeholder="e.g. Sarah"
              disabled={loading}
            />
          </div>

          <h2 className="quote-section-title">Your reply</h2>

          <div className={`form-group ${errors.subject ? 'form-group--error' : ''}`}>
            <label htmlFor="subject">
              Subject <span className="form-required-mark">*</span>
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={form.subject}
              onChange={set}
              disabled={loading}
            />
            {errors.subject ? <p className="form-error">{errors.subject}</p> : null}
          </div>

          <div className={`form-group ${errors.message ? 'form-group--error' : ''}`}>
            <label htmlFor="message">
              Message <span className="form-required-mark">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={10}
              value={form.message}
              onChange={set}
              placeholder="Thank you for your quote request. Based on your property, our price is…"
              disabled={loading}
            />
            {errors.message ? <p className="form-error">{errors.message}</p> : null}
          </div>

          <div className={`form-group ${errors.attachment ? 'form-group--error' : ''}`}>
            <label htmlFor="attachment">Attachment (optional)</label>
            <input
              ref={fileInputRef}
              id="attachment"
              type="file"
              name="attachment"
              accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,application/pdf,image/*"
              onChange={onFileChange}
              disabled={loading}
            />
            <p className="form-hint">PDF, JPG, PNG, WEBP, DOC or DOCX — max 5 MB</p>
            {attachment ? (
              <p className="form-file-name">
                {attachment.name}{' '}
                <button type="button" className="form-file-clear" onClick={clearAttachment}>
                  Remove
                </button>
              </p>
            ) : null}
            {errors.attachment ? <p className="form-error">{errors.attachment}</p> : null}
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Sending…' : 'Send email to customer'}
          </button>
        </form>

        <p className="admin-footer-note">
          Sends from {SITE.name} with logo and contact details. Replies go to your business inbox.
        </p>
      </main>
    </div>
  );
}

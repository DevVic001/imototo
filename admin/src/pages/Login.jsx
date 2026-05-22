import { useState } from 'react';
import { adminLogin } from '../api';
import { LOGO_DARK, SESSION_KEY, SITE } from '../config';

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!password.trim()) {
      setError('Enter your admin password');
      return;
    }
    setLoading(true);
    try {
      const data = await adminLogin(password);
      sessionStorage.setItem(SESSION_KEY, data.token);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-shell admin-shell--auth">
      <header className="admin-topbar">
        <div className="admin-topbar__brand">
          <img src={LOGO_DARK} alt={SITE.name} className="admin-topbar__logo" />
        </div>
        <p className="admin-topbar__eyebrow">Staff only</p>
        <h1 className="admin-topbar__title">Reply to customers</h1>
      </header>

      <main className="admin-main">
        <form className="admin-card" onSubmit={submit}>
          <p className="admin-card__lead">
            Sign in to send branded quote replies from Imototo.
          </p>

          <div className={`form-group ${error ? 'form-group--error' : ''}`}>
            <label htmlFor="password">Admin password</label>
            <input
              id="password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={loading}
            />
            {error ? <p className="form-error">{error}</p> : null}
          </div>

          <button type="submit" className="btn btn--primary btn--block" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </main>
    </div>
  );
}

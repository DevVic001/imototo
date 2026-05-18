import { useEffect, useState } from 'react';

const DISMISS_KEY = 'imototo-pwa-install-dismissed';
const DISMISS_DAYS = 14;

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

function isIos() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function wasDismissedRecently() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (Number.isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return;

    if (isIos()) {
      const timer = window.setTimeout(() => setIosHint(true), 2500);
      return () => window.clearTimeout(timer);
    }

    const onBip = (e) => {
      e.preventDefault();
      setDeferred(e);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBip);
    return () => window.removeEventListener('beforeinstallprompt', onBip);
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setVisible(false);
    setIosHint(false);
  };

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    const { outcome } = await deferred.userChoice;
    if (outcome === 'accepted') dismiss();
    setDeferred(null);
    setVisible(false);
  };

  if (!visible && !iosHint) return null;

  return (
    <aside
      className="pwa-install"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-desc"
    >
      <div className="pwa-install__card">
        <img
          className="pwa-install__icon"
          src="/pwa/icon-192.png"
          alt=""
          width={56}
          height={56}
          onError={(e) => {
            e.currentTarget.src = '/pwa/icon.svg';
          }}
        />
        <div className="pwa-install__body">
          <p id="pwa-install-title" className="pwa-install__title">
            Install Imototo app
          </p>
          <p id="pwa-install-desc" className="pwa-install__text">
            {iosHint
              ? 'Tap Share, then “Add to Home Screen” for quick quotes and contact.'
              : 'Add to your home screen for fast access — works like an app, no app store needed.'}
          </p>
        </div>
        <div className="pwa-install__actions">
          {!iosHint && (
            <button type="button" className="btn btn--primary btn--sm" onClick={install}>
              Install
            </button>
          )}
          <button type="button" className="btn btn--outline btn--sm" onClick={dismiss}>
            {iosHint ? 'Got it' : 'Not now'}
          </button>
        </div>
        <button
          type="button"
          className="pwa-install__close"
          aria-label="Dismiss"
          onClick={dismiss}
        >
          ×
        </button>
      </div>
    </aside>
  );
}

import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function AdminToast({ type, title, message, onClose, autoCloseMs = 6000 }) {
  useEffect(() => {
    if (!autoCloseMs || !onClose) return undefined;
    const timer = window.setTimeout(onClose, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs, onClose, type]);

  return createPortal(
    <div
      className={`admin-toast-stack admin-toast-stack--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <p className="admin-toast-stack__title">{title}</p>
      <p className="admin-toast-stack__message">{message}</p>
      <button type="button" className="admin-toast-stack__close" aria-label="Dismiss" onClick={onClose}>
        ×
      </button>
    </div>,
    document.body
  );
}

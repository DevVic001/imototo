import { useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function FormToast({ type, title, message, onClose, autoCloseMs = 7000 }) {
  useEffect(() => {
    if (!autoCloseMs || !onClose) return undefined;
    const timer = window.setTimeout(onClose, autoCloseMs);
    return () => window.clearTimeout(timer);
  }, [autoCloseMs, onClose, type]);

  return createPortal(
    <div
      className={`form-toast-stack form-toast-stack--${type}`}
      role={type === 'error' ? 'alert' : 'status'}
      aria-live="polite"
    >
      <p className="form-toast-stack__title">{title}</p>
      <p className="form-toast-stack__message">{message}</p>
      <button type="button" className="form-toast-stack__close" aria-label="Dismiss" onClick={onClose}>
        ×
      </button>
    </div>,
    document.body
  );
}

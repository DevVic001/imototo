function IconReply() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSend() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m22 2-7 20-4-9-9-4 20-7z"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2 11 13"
        stroke="currentColor"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AdminBottomNav({ onReplyTop, onSend, onLogout, sending }) {
  return (
    <nav className="admin-bottom-nav" aria-label="Admin navigation">
      <div className="admin-bottom-nav__bar">
        <button
          type="button"
          className="admin-bottom-nav__item admin-bottom-nav__item--active"
          onClick={onReplyTop}
          aria-label="Back to reply form"
        >
          <span className="admin-bottom-nav__icon">
            <IconReply />
          </span>
          <span className="admin-bottom-nav__label">Reply</span>
        </button>

        <button
          type="button"
          className="admin-bottom-nav__fab"
          onClick={onSend}
          disabled={sending}
          aria-label={sending ? 'Sending email' : 'Send email to customer'}
        >
          <span className="admin-bottom-nav__fab-inner">
            <IconSend />
          </span>
          <span className="admin-bottom-nav__fab-label">{sending ? 'Sending…' : 'Send'}</span>
        </button>

        <button
          type="button"
          className="admin-bottom-nav__item"
          onClick={onLogout}
          aria-label="Sign out"
        >
          <span className="admin-bottom-nav__icon">
            <IconLogout />
          </span>
          <span className="admin-bottom-nav__label">Sign out</span>
        </button>
      </div>
    </nav>
  );
}

import { SITE } from '../config';

function ChatAvatar() {
  return (
    <span className="live-chat__avatar" aria-hidden="true">
      <svg className="live-chat__person" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M4.5 19.75c0-3.15 2.85-5.5 7.5-5.5s7.5 2.35 7.5 5.5H4.5z"
        />
        <circle cx="12" cy="9" r="4.35" fill="currentColor" />
        <g className="live-chat__shades">
          <rect x="7.35" y="7.85" width="3.35" height="2.35" rx="1.1" />
          <rect x="13.3" y="7.85" width="3.35" height="2.35" rx="1.1" />
          <rect x="10.45" y="8.55" width="3.1" height="0.75" rx="0.38" />
        </g>
        <path
          className="live-chat__smile"
          d="M10.15 12.05c0.55 0.65 1.35 1 2.85 1s2.3-0.35 2.85-1"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>
      <span className="live-chat__status" title="Online" />
    </span>
  );
}

export default function LiveChat() {
  return (
    <div className="live-chat">
      <a
        href={SITE.mailto}
        className="live-chat__btn"
        aria-label={`Email ${SITE.email}`}
        title={SITE.email}
      >
        <ChatAvatar />
        <span className="live-chat__label">We&apos;re online — Email us</span>
      </a>
    </div>
  );
}

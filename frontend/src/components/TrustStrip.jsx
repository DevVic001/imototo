const ITEMS = [
  {
    label: 'Fully insured',
    detail: 'Professional team',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3l7 3v6c0 4.2-2.9 7.4-7 9-4.1-1.6-7-4.8-7-9V6l7-3z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Free quotes',
    detail: 'No obligation',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 11l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: 'Greater Manchester',
    detail: 'Bolton & surrounds',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 21s6-5.2 6-10a6 6 0 10-12 0c0 4.8 6 10 6 10z"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="12" cy="11" r="2.25" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: '7 services',
    detail: 'Homes to offices',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.75" />
        <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function TrustStrip() {
  return (
    <div className="trust-strip" aria-label="Why book with Imototo">
      <div className="container trust-strip__inner">
        {ITEMS.map((item, i) => (
          <div key={item.label} className="trust-strip__item">
            <span className="trust-strip__icon">{item.icon}</span>
            <span className="trust-strip__text">
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </span>
            {i < ITEMS.length - 1 && <span className="trust-strip__rule" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}

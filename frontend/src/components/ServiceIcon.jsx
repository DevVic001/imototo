const ICONS = {
  residential: (
    <path
      fill="currentColor"
      d="M12 3L4 9v12h5v-7h6v7h5V9l-8-6zm0 2.8L18 10.5V19h-2v-6H8v6H6v-8.5L12 5.8z"
    />
  ),
  airbnb: (
    <path
      fill="currentColor"
      d="M12 2a5 5 0 00-5 5v1H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2V10a2 2 0 00-2-2h-2V7a5 5 0 00-5-5zm0 2a3 3 0 013 3v1H9V7a3 3 0 013-3zm-7 7h14v10H5V11zm5 2v2h4v-2h-4z"
    />
  ),
  tenancy: (
    <path
      fill="currentColor"
      d="M9 2h6v2h4a2 2 0 012 2v16a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h4V2zm2 2v2h2V4H11zm-6 4v14h14V8H5zm3 3h8v2H8v-2zm0 4h6v2H8v-2z"
    />
  ),
  move: (
    <path
      fill="currentColor"
      d="M3 6h2v2h10l2-3h3l-3 4.5V20a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H8v1a1 1 0 01-1 1H6a1 1 0 01-1-1v-9.2L3 10.5V6zm4 2v10h2v-3h6v3h2V8H7zm2 2h6v2H9v-2z"
    />
  ),
  office: (
    <path
      fill="currentColor"
      d="M4 4h16v16H4V4zm2 2v3h3V6H6zm5 0v3h3V6h-3zm5 0v3h2V6h-2zM6 11v3h3v-3H6zm5 0v3h3v-3h-3zm5 0v3h2v-3h-2zM6 16v2h3v-2H6zm5 0v2h3v-2h-3zm5 0v2h2v-2h-2z"
    />
  ),
  construction: (
    <path
      fill="currentColor"
      d="M2 20h20v2H2v-2zm3.5-16L12 4.5 18.5 4 17 11l-5-1-5 1-1.5-7zM8.2 12.8L12 12l3.8.8.6-2.8L12 9.6 7.6 10l.6 2.8z"
    />
  ),
  deep: (
    <path
      fill="currentColor"
      d="M12 2l2.4 4.8L20 8l-4 3.9.9 5.6L12 15.5 7.1 17.5 8 11.9 4 8l5.6-1.2L12 2zm0 3.2L10.8 8 8.2 8.5l2 2-.5 2.9L12 12.4l2.3 1.1-.5-2.9 2-2-2.6-.5L12 5.2z"
    />
  ),
  check: (
    <path fill="currentColor" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
  ),
  phone: (
    <path
      fill="currentColor"
      d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"
    />
  ),
  mail: (
    <path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  ),
  location: (
    <path
      fill="currentColor"
      d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z"
    />
  ),
  clock: (
    <path
      fill="currentColor"
      d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm1 3v5.4l4.3 2.5-.9 1.6L11 13V7h2z"
    />
  ),
  shield: (
    <path
      fill="currentColor"
      d="M12 2l8 3v6c0 5-3.4 9.7-8 11-4.6-1.3-8-6-8-11V5l8-3zm0 2.2L6 6.3v4.7c0 4.1 2.7 7.9 6 9.1 3.3-1.2 6-5 6-9.1V6.3l-6-2.1z"
    />
  ),
  star: (
    <path
      fill="currentColor"
      d="M12 2l2.4 4.8L20 8l-4 3.9.9 5.6L12 15.5 7.1 17.5 8 11.9 4 8l5.6-1.2L12 2z"
    />
  ),
};

export default function ServiceIcon({ name, className = '' }) {
  const path = ICONS[name] || ICONS.deep;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      {path}
    </svg>
  );
}

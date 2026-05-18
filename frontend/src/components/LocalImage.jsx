import { useState } from 'react';

/** Local file only — no external URLs. Hides if file missing. */
export default function LocalImage({ src, alt, className, loading = 'lazy', onMissing, ...props }) {
  const [ok, setOk] = useState(true);

  if (!ok) {
    return onMissing ?? null;
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setOk(false)}
    />
  );
}

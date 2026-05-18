import { useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Local image with Imototo loading state until the file has loaded. */
export default function LocalImage({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fill = false,
  onMissing,
  ...props
}) {
  const imgRef = useRef(null);
  const [ok, setOk] = useState(true);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setOk(true);
  }, [src]);

  useLayoutEffect(() => {
    const el = imgRef.current;
    if (el?.complete && el.naturalWidth > 0) setLoaded(true);
  }, [src]);

  if (!ok) {
    return onMissing ?? null;
  }

  return (
    <span
      className={[
        'media-loader',
        loaded ? 'media-loader--loaded' : '',
        fill ? 'media-loader--fill' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="media-loader__placeholder" aria-hidden="true">
        <span className="media-loader__ring" />
        <span className="media-loader__mark">i</span>
      </span>
      <img
        {...props}
        ref={imgRef}
        src={src}
        alt={alt}
        className="media-loader__img"
        loading={loading}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setOk(false)}
      />
    </span>
  );
}

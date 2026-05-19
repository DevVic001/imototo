const STAR_PATH =
  'M12 2l2.4 4.8L20 8l-4 3.9.9 5.6L12 15.5 7.1 17.5 8 11.9 4 8l5.6-1.2L12 2z';

export default function StarRating({ count = 5, label = '5 out of 5 stars' }) {
  return (
    <div className="star-rating" role="img" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} className="star-rating__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="currentColor" d={STAR_PATH} />
        </svg>
      ))}
    </div>
  );
}

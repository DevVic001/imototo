import ServiceIcon from './ServiceIcon';

export default function FeatureList({ items, variant = 'default' }) {
  return (
    <ul className={`feature-list feature-list--${variant}`}>
      {items.map((item) => (
        <li key={item.text} className="feature-list__item">
          <span className="icon-box icon-box--sm" aria-hidden="true">
            <ServiceIcon name={item.icon} />
          </span>
          <span className="feature-list__text">{item.text}</span>
        </li>
      ))}
    </ul>
  );
}

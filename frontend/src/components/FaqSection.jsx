import { FAQ_ITEMS } from '../config';

export default function FaqSection() {
  return (
    <section className="section section--alt faq-section" aria-labelledby="faq-heading">
      <div className="container faq-section__inner">
        <div className="faq-section__intro">
          <p className="section__eyebrow">FAQ</p>
          <h2 id="faq-heading" className="section__title">
            Questions before you book
          </h2>
          <p className="section__lead">
            Straight answers — no jargon. Still unsure? Call or WhatsApp and we will help.
          </p>
        </div>
        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="faq-item">
              <summary className="faq-item__q">{item.q}</summary>
              <p className="faq-item__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { SITE, ASSETS } from '../config';
import LocalImage from './LocalImage';

/**
 * Inner-page hero with breadcrumb (Home → current), logo, and title block.
 */
export default function PageHero({ imageSrc, breadcrumb, eyebrow, title, lead }) {
  return (
    <header className="page-hero page-hero--with-image">
      {imageSrc ? (
        <div className="page-hero__media" aria-hidden="true">
          <LocalImage src={imageSrc} alt="" loading="eager" fill />
          <div className="page-hero__scrim" />
        </div>
      ) : null}
      <div className="container page-hero__inner">
        <nav className="page-hero__crumbs" aria-label="Breadcrumb">
          <ol>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-current="page">{breadcrumb}</li>
          </ol>
        </nav>
        <img src={ASSETS.logoLight} alt={SITE.name} className="page-hero__logo-single" />
        {eyebrow ? <p className="section__eyebrow">{eyebrow}</p> : null}
        <h1 className="section__title">{title}</h1>
        {lead ? <p className="section__lead">{lead}</p> : null}
      </div>
    </header>
  );
}

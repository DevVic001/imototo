import { ADMIN_SECRET_PATH } from './config';

function isAllowedAdminPath(pathname) {
  const allowed = [`/${ADMIN_SECRET_PATH}`, `/${ADMIN_SECRET_PATH}/`];
  return allowed.includes(pathname);
}

export default function SecretPathGate({ children }) {
  if (!isAllowedAdminPath(window.location.pathname)) {
    return (
      <div className="admin-shell">
        <main className="admin-main">
          <div className="admin-card">
            <h1 className="admin-not-found__title">404</h1>
            <p className="admin-not-found__text">Page not found.</p>
          </div>
        </main>
      </div>
    );
  }

  return children;
}

import { useEffect, useState } from 'react';
import { checkSession } from './api';
import Login from './pages/Login';
import ReplyForm from './pages/ReplyForm';

export default function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const ok = await checkSession();
      if (!cancelled) {
        setAuthed(ok);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="admin-shell">
        <div className="admin-loading">
          <div className="admin-loading__spinner" aria-hidden />
          <p>Loading…</p>
        </div>
      </div>
    );
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />;
  }

  return <ReplyForm onLogout={() => setAuthed(false)} />;
}

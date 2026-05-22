import { API_BASE, SESSION_KEY } from './config';

function authHeaders() {
  const token = sessionStorage.getItem(SESSION_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(password) {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 503) {
      throw new Error('Add ADMIN_PASSWORD on Render and redeploy the backend.');
    }
    if (res.status === 401) {
      throw new Error(data.error || 'Wrong password');
    }
    if (res.status === 500 || res.status === 502) {
      const hint = API_BASE
        ? 'Render API error — redeploy backend with admin routes, or wait if service is waking up.'
        : 'Start local backend: cd backend → npm run dev';
      throw new Error(data.error || data.details || hint);
    }
    throw new Error(data.error || 'Login failed');
  }
  return data;
}

export async function checkSession() {
  const token = sessionStorage.getItem(SESSION_KEY);
  if (!token) return false;
  const res = await fetch(`${API_BASE}/api/admin/session`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  return Boolean(data.ok);
}

export async function adminLogout() {
  try {
    await fetch(`${API_BASE}/api/admin/logout`, {
      method: 'POST',
      headers: authHeaders(),
    });
  } finally {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

export async function sendCustomerReply(payload) {
  const res = await fetch(`${API_BASE}/api/admin/reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || data.details || 'Failed to send');
  }
  return data;
}

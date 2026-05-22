const crypto = require('crypto');

const DEFAULT_TTL_MS = 8 * 60 * 60 * 1000;
const sessions = new Map();

function getTtlMs() {
  const raw = process.env.ADMIN_SESSION_TTL_MS;
  if (!raw) return DEFAULT_TTL_MS;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_TTL_MS;
}

function createAdminSession() {
  const token = crypto.randomBytes(32).toString('base64url');
  sessions.set(token, Date.now() + getTtlMs());
  return token;
}

function isValidAdminSession(token) {
  if (!token || typeof token !== 'string') return false;
  const expiresAt = sessions.get(token);
  if (!expiresAt) return false;
  if (Date.now() > expiresAt) {
    sessions.delete(token);
    return false;
  }
  return true;
}

function revokeAdminSession(token) {
  if (token) sessions.delete(token);
}

module.exports = {
  createAdminSession,
  isValidAdminSession,
  revokeAdminSession,
};

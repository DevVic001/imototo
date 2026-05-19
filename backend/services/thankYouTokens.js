const crypto = require('crypto');

const TTL_MS = Number(process.env.THANK_YOU_TOKEN_TTL_MS) || 20 * 60 * 1000;
/** @type {Map<string, number>} token -> expiresAt */
const issued = new Map();

function prune() {
  const now = Date.now();
  for (const [token, exp] of issued) {
    if (exp <= now) issued.delete(token);
  }
}

setInterval(prune, 10 * 60 * 1000).unref?.();

/** Create a one-time token after a successful quote email send. */
function issueThankYouToken() {
  prune();
  const token = crypto.randomBytes(32).toString('base64url');
  issued.set(token, Date.now() + TTL_MS);
  return token;
}

/**
 * Validate and consume token (single use). Returns true only once per issued token.
 */
function consumeThankYouToken(token) {
  if (!token || typeof token !== 'string' || token.length < 32 || token.length > 128) {
    return false;
  }
  if (!/^[A-Za-z0-9_-]+$/.test(token)) {
    return false;
  }

  prune();
  const exp = issued.get(token);
  if (!exp) return false;

  issued.delete(token);

  if (Date.now() > exp) {
    return false;
  }

  return true;
}

module.exports = { issueThankYouToken, consumeThankYouToken };

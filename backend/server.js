const express = require('express');
const cors = require('cors');
const https = require('https');
const dotenv = require('dotenv');
const emailService = require('./services/emailService.js');
const { issueThankYouToken, consumeThankYouToken } = require('./services/thankYouTokens.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://imototo.pages.dev',
  'https://imototocleanings.co.uk',
  'https://www.imototocleanings.co.uk',
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
  })
);
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'imototo-api' });
});

function trimStrings(obj) {
  const out = { ...obj };
  for (const key of Object.keys(out)) {
    if (typeof out[key] === 'string') out[key] = out[key].trim();
  }
  return out;
}

function sanitizePreferredDate(value) {
  if (!value || typeof value !== 'string') return '';
  const v = value.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return '';
  const [y, m, day] = v.split('-').map(Number);
  if (y < 2000 || y > 2100) return '';
  const d = new Date(y, m - 1, day);
  if (d.getFullYear() !== y || d.getMonth() !== m - 1 || d.getDate() !== day) return '';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const max = new Date(today);
  max.setFullYear(max.getFullYear() + 2);
  if (d < today || d > max) return '';
  return v;
}

app.post('/api/quote', async (req, res) => {
  try {
    const body = trimStrings({ ...(req.body || {}) });
    if (body.preferredDate) body.preferredDate = sanitizePreferredDate(body.preferredDate);
    const required = ['firstName', 'lastName', 'email', 'phone', 'street', 'city', 'postcode', 'service', 'message'];
    const missing = required.filter((k) => !String(body[k] || '').trim());
    if (missing.length) {
      return res.status(400).json({ error: 'Missing required fields', fields: missing });
    }

    const result = await emailService.sendQuoteEmail(body);
    if (result.success) {
      const thankYouToken = issueThankYouToken();
      return res.json({
        success: true,
        message: 'Quote request submitted successfully',
        thankYouToken,
      });
    }
    return res.status(500).json({ error: 'Failed to send email', details: result.error });
  } catch (err) {
    console.error('Quote error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/quote/thank-you-verify', (req, res) => {
  const token = typeof req.query.t === 'string' ? req.query.t.trim() : '';
  if (!consumeThankYouToken(token)) {
    return res.status(403).json({ ok: false, error: 'Invalid or expired link' });
  }
  return res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = trimStrings(req.body || {});
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await emailService.sendContactEmail(name, email, phone, message);
    if (result.success) {
      return res.json({ success: true });
    }
    return res.status(500).json({ error: 'Failed to send email', details: result.error });
  } catch (err) {
    console.error('Contact error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Imototo API listening on port ${PORT}`);

  const keepAliveUrl = 'https://imototo.onrender.com';
  setInterval(() => {
    https.get(keepAliveUrl, (res) => res.resume()).on('error', () => {});
  }, 5 * 60 * 1000);
});

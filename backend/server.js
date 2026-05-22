const express = require('express');
const cors = require('cors');
const https = require('https');
const dotenv = require('dotenv');
const emailService = require('./services/emailService.js');
const { issueThankYouToken, consumeThankYouToken } = require('./services/thankYouTokens.js');
const {
  createAdminSession,
  isValidAdminSession,
  revokeAdminSession,
} = require('./services/adminSessions.js');
const { adminUpload } = require('./services/adminUpload.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://imototo.pages.dev',
  'https://imototocleanings.co.uk',
  'https://www.imototocleanings.co.uk',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  'https://admin.dashboard.imototocleanings.co.uk',
];

if (process.env.ADMIN_ALLOWED_ORIGINS) {
  for (const origin of process.env.ADMIN_ALLOWED_ORIGINS.split(',')) {
    const trimmed = origin.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  }
}

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

function getBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || typeof header !== 'string') return '';
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : '';
}

function requireAdmin(req, res, next) {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(503).json({ error: 'Admin is not configured on the server' });
  }
  const token = getBearerToken(req);
  if (!isValidAdminSession(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

app.post('/api/admin/login', (req, res) => {
  const configured = process.env.ADMIN_PASSWORD;
  if (!configured) {
    return res.status(503).json({ error: 'Admin is not configured on the server' });
  }
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password || password !== configured) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  const token = createAdminSession();
  return res.json({ success: true, token });
});

app.get('/api/admin/session', (req, res) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.json({ ok: false });
  }
  const token = getBearerToken(req);
  return res.json({ ok: isValidAdminSession(token) });
});

app.post('/api/admin/logout', requireAdmin, (req, res) => {
  revokeAdminSession(getBearerToken(req));
  return res.json({ success: true });
});

app.post('/api/admin/reply', requireAdmin, adminUpload.single('attachment'), async (req, res) => {
  try {
    const body = trimStrings(req.body || {});
    const to = body.to;
    const subject = body.subject;
    const message = body.message;
    const customerName = body.customerName || '';

    if (!to || !isValidEmail(to)) {
      return res.status(400).json({ error: 'Valid customer email is required' });
    }
    if (!subject || subject.length < 3 || subject.length > 200) {
      return res.status(400).json({ error: 'Subject must be between 3 and 200 characters' });
    }
    if (!message || message.length < 10 || message.length > 10000) {
      return res.status(400).json({ error: 'Message must be between 10 and 10000 characters' });
    }

    const result = await emailService.sendCustomerReply({
      to,
      subject,
      message,
      customerName,
      attachment: req.file,
    });

    if (result.success) {
      return res.json({ success: true, messageId: result.messageId });
    }
    return res.status(500).json({ error: 'Failed to send email', details: result.error });
  } catch (err) {
    console.error('Admin reply error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
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

app.use((err, req, res, next) => {
  if (err?.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Attachment must be 5 MB or smaller' });
  }
  if (err?.message?.includes('File type not allowed')) {
    return res.status(400).json({ error: err.message });
  }
  if (err?.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({ error: 'Only one attachment is allowed' });
  }
  return next(err);
});

app.listen(PORT, () => {
  console.log(`Imototo API listening on port ${PORT}`);
  if (!process.env.ADMIN_PASSWORD) {
    console.warn('ADMIN_PASSWORD is not set — admin login will return 503');
  }

  const keepAliveUrl = 'https://imototo.onrender.com';
  setInterval(() => {
    https.get(keepAliveUrl, (res) => res.resume()).on('error', () => {});
  }, 5 * 60 * 1000);
});

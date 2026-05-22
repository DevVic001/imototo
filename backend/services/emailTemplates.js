const BRAND = {
  primary: '#02333f',
  primaryDark: '#011a21',
  primaryMuted: '#0a4a5c',
  secondary: '#d0d5cd',
  secondarySoft: '#eef0ec',
  text: '#1a2b30',
  muted: '#5c6b70',
  border: '#d8deda',
  white: '#ffffff',
  site: 'https://imototocleanings.co.uk',
  name: 'Imototo Cleaning Services',
  /** White logo on teal — public/assets/images/logo-dark.jpg */
  logoUrl: 'https://imototocleanings.co.uk/assets/images/logo-dark.jpg',
  /** Dark logo on light — public/assets/images/logo-lightt.jpg */
  logoOnLightUrl: 'https://imototocleanings.co.uk/assets/images/logo-lightt.jpg',
  phone: '+44 7823 893420',
  phoneE164: '+447823893420',
  whatsappUrl: 'https://wa.me/447823893420',
  email: 'info@imototocleanings.co.uk',
};

/** Wide layout — reads premium, not narrow/slim */
const EMAIL_WIDTH = 640;

const QUOTE_FIELD_ORDER = [
  'firstName',
  'lastName',
  'email',
  'phone',
  'service',
  'street',
  'city',
  'postcode',
  'message',
];

const FIELD_LABELS = {
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  phone: 'Phone',
  service: 'Service',
  street: 'Street address',
  city: 'City',
  postcode: 'Postcode',
  message: 'Message',
};

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function labelForKey(key) {
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

/** Outlook ignores gradients/rgba — solid bgcolor on <td> always */
function tdBg(color, extraStyle = '') {
  return `bgcolor="${color}" style="background-color:${color};${extraStyle}"`;
}

function layout({ preheader, badge, title, subtitle, bodyHtml, footerNote }) {
  const preheaderText = escapeHtml(preheader || title);
  const badgeHtml = badge
    ? `<p style="margin:0 0 14px;display:inline-block;padding:8px 16px;background-color:#0a4a5c;border:1px solid ${BRAND.secondary};font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${BRAND.secondary};">${escapeHtml(badge)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .email-container { width: ${EMAIL_WIDTH}px !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:${BRAND.secondarySoft};font-family:'Segoe UI',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheaderText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.secondarySoft};padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="${EMAIL_WIDTH}" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:${EMAIL_WIDTH}px;background-color:${BRAND.white};border:1px solid ${BRAND.border};">
          <!-- Brand header (solid teal — works in Outlook even if logo URL fails) -->
          <tr>
            <td align="center" ${tdBg(BRAND.primary, 'padding:32px 40px 24px;')}>
              <p style="margin:0 0 14px;font-size:22px;line-height:1.25;font-weight:800;color:${BRAND.white};letter-spacing:0.02em;text-align:center;">
                ${escapeHtml(BRAND.name)}
              </p>
              <a href="${BRAND.site}" style="text-decoration:none;">
                <img
                  src="${BRAND.logoUrl}"
                  width="320"
                  alt="${escapeHtml(BRAND.name)}"
                  style="display:block;width:100%;max-width:320px;height:auto;margin:0 auto;border:0;border-radius:8px;"
                />
              </a>
            </td>
          </tr>
          <!-- Hero -->
          <tr>
            <td ${tdBg(BRAND.primary, 'padding:8px 48px 36px;')}>
              ${badgeHtml}
              <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:800;color:${BRAND.white};letter-spacing:-0.02em;">${escapeHtml(title)}</h1>
              ${subtitle ? `<p style="margin:14px 0 0;font-size:17px;line-height:1.45;font-weight:500;color:${BRAND.secondary};">${escapeHtml(subtitle)}</p>` : ''}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px 48px 44px;font-size:16px;line-height:1.65;color:${BRAND.text};">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td ${tdBg(BRAND.secondarySoft, `padding:32px 48px 40px;border-top:1px solid ${BRAND.border};`)}>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:${BRAND.muted};font-weight:500;">
                ${footerNote || 'Reply directly to this email to reach the customer.'}
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
                <tr>
                  <td style="padding-right:10px;padding-bottom:10px;">
                    <a href="${BRAND.site}/contact" style="display:inline-block;padding:14px 28px;background:${BRAND.primary};color:${BRAND.white};text-decoration:none;font-size:15px;font-weight:700;border-radius:8px;">View website</a>
                  </td>
                  <td style="padding-right:10px;padding-bottom:10px;">
                    <a href="tel:${escapeHtml(BRAND.phoneE164)}" style="display:inline-block;padding:14px 28px;background:${BRAND.white};color:${BRAND.primary};text-decoration:none;font-size:15px;font-weight:700;border-radius:8px;border:2px solid ${BRAND.primary};">${escapeHtml(BRAND.phone)}</a>
                  </td>
                  <td style="padding-bottom:10px;">
                    <a href="${BRAND.whatsappUrl}" style="display:inline-block;padding:14px 28px;background:#25D366;color:${BRAND.white};text-decoration:none;font-size:15px;font-weight:700;border-radius:8px;">WhatsApp</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.muted};">
                <strong style="color:${BRAND.primary};">${escapeHtml(BRAND.name)}</strong><br />
                <a href="${BRAND.site}" style="color:${BRAND.primary};text-decoration:none;font-weight:600;">imototocleanings.co.uk</a>
                &nbsp;·&nbsp; Manchester, Bolton &amp; surrounding areas<br />
                <a href="mailto:${BRAND.email}" style="color:${BRAND.primary};text-decoration:none;">${BRAND.email}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function dataRows(entries) {
  return entries
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:18px 22px;width:34%;font-size:14px;font-weight:700;letter-spacing:0.02em;color:${BRAND.muted};background:${BRAND.secondarySoft};border-bottom:2px solid ${BRAND.white};vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:18px 22px;font-size:16px;font-weight:500;line-height:1.5;color:${BRAND.text};border-bottom:2px solid ${BRAND.secondarySoft};vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join('');
}

function orderedQuoteEntries(data) {
  const used = new Set();
  const entries = [];

  for (const key of QUOTE_FIELD_ORDER) {
    const value = data[key];
    if (value != null && String(value).trim()) {
      entries.push([labelForKey(key), String(value).trim()]);
      used.add(key);
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (used.has(key) || value == null || !String(value).trim()) continue;
    entries.push([labelForKey(key), String(value).trim()]);
  }

  return entries;
}

function quoteRequestEmail(data) {
  const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || 'Customer';
  const entries = orderedQuoteEntries(data);

  const bodyHtml = `
    <p style="margin:0 0 28px;font-size:17px;line-height:1.6;color:${BRAND.text};">
      You have a new <strong style="color:${BRAND.primary};">quote request</strong> from your website.
      Hit <strong>Reply</strong> to respond to
      <a href="mailto:${escapeHtml(data.email || '')}" style="color:${BRAND.primary};font-weight:700;text-decoration:none;">${escapeHtml(data.email || name)}</a>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:2px solid ${BRAND.border};border-radius:10px;overflow:hidden;border-collapse:separate;">
      ${dataRows(entries)}
    </table>
    ${
      data.phone
        ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
        <tr>
          <td>
            <a href="tel:${escapeHtml(String(data.phone).replace(/\s/g, ''))}" style="display:inline-block;padding:16px 32px;background:${BRAND.primary};color:${BRAND.white};text-decoration:none;font-size:16px;font-weight:700;border-radius:8px;">Call ${escapeHtml(data.phone)}</a>
          </td>
        </tr>
      </table>`
        : ''
    }`;

  return layout({
    preheader: `New quote from ${name} — ${data.service || 'cleaning enquiry'}`,
    badge: 'Website enquiry',
    title: 'New quote request',
    subtitle: `${name}${data.service ? ` · ${data.service}` : ''}`,
    bodyHtml,
  });
}

function contactFormEmail({ name, email, phone, message }) {
  const bodyHtml = `
    <p style="margin:0 0 28px;font-size:17px;line-height:1.6;color:${BRAND.text};">
      A new message came in from the <strong style="color:${BRAND.primary};">contact form</strong>.
      Reply to
      <a href="mailto:${escapeHtml(email)}" style="color:${BRAND.primary};font-weight:700;text-decoration:none;">${escapeHtml(email)}</a>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:2px solid ${BRAND.border};border-radius:10px;overflow:hidden;border-collapse:separate;">
      ${dataRows([
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
      ])}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
      <tr>
        <td style="padding:24px 28px;background:${BRAND.secondarySoft};border-radius:10px;border-left:6px solid ${BRAND.primary};">
          <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND.muted};">Their message</p>
          <p style="margin:0;font-size:17px;line-height:1.65;color:${BRAND.text};white-space:pre-wrap;">${escapeHtml(message)}</p>
        </td>
      </tr>
    </table>`;

  return layout({
    preheader: `Contact form — ${name}`,
    badge: 'Contact form',
    title: 'New contact message',
    subtitle: name,
    bodyHtml,
  });
}

function messageToHtmlBlocks(message) {
  const text = String(message ?? '').trim();
  if (!text) return '';
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const inner = escapeHtml(block).replace(/\n/g, '<br />');
      return `<p style="margin:0 0 18px;font-size:17px;line-height:1.65;color:${BRAND.text};">${inner}</p>`;
    })
    .join('');
}

function customerReplyEmail({ customerName, subject, message }) {
  const greeting = customerName
    ? `Hi ${escapeHtml(customerName.trim())},`
    : 'Hello,';
  const safeSubject = String(subject || 'Your cleaning quote').trim();

  const bodyHtml = `
    <p style="margin:0 0 24px;font-size:17px;line-height:1.6;color:${BRAND.text};">
      ${greeting}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 8px;">
      <tr>
        <td style="padding:28px 32px;background:${BRAND.secondarySoft};border-radius:10px;border-left:6px solid ${BRAND.primary};">
          ${messageToHtmlBlocks(message)}
        </td>
      </tr>
    </table>
    <p style="margin:24px 0 0;font-size:16px;line-height:1.6;color:${BRAND.muted};">
      Thank you for choosing <strong style="color:${BRAND.primary};">${escapeHtml(BRAND.name)}</strong>.
      We look forward to helping you.
    </p>`;

  return layout({
    preheader: safeSubject,
    badge: 'Your quote',
    title: safeSubject,
    subtitle: 'Manchester, Bolton & surrounding areas',
    bodyHtml,
    footerNote:
      'You received this email because you requested a quote on our website. Reply to this email or use WhatsApp if you have any questions.',
  });
}

module.exports = {
  quoteRequestEmail,
  contactFormEmail,
  customerReplyEmail,
};

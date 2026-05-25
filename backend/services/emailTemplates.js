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
  /** Dark logo on light — public/assets/logo-light.jpg */
  logoOnLightUrl: 'https://imototocleanings.co.uk/assets/logo-light.jpg',
  phone: '+44 7823 893420',
  phoneE164: '+447823893420',
  whatsappUrl: 'https://wa.me/447823893420',
  email: 'info@imototocleanings.co.uk',
};

/** Slim, balanced layout — not jam-packed, not stretched */
const EMAIL_WIDTH = 600;

/** Email-safe font stacks (Google Fonts + fallbacks for Outlook/Gmail) */
const FONT_BODY = "'Source Sans 3', 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_DISPLAY = "'Outfit', 'Segoe UI', Helvetica, Arial, sans-serif";
const FONT_LINK =
  'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=Source+Sans+3:wght@400;500;600&display=swap';

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

/**
 * Email-safe button: line-height matches text size so the label sits
 * vertically centred in every client (Gmail, Outlook, Apple Mail).
 */
function emailButton({ href, label, variant = 'solid' }) {
  const styles = {
    solid: { bg: BRAND.primary, color: BRAND.white, border: BRAND.primary },
    outline: { bg: BRAND.white, color: BRAND.primary, border: BRAND.primary },
    whatsapp: { bg: '#25D366', color: BRAND.white, border: '#25D366' },
  };
  const v = styles[variant] || styles.solid;
  return `<a href="${href}" style="display:inline-block;padding:10px 18px;background:${v.bg};color:${v.color};text-decoration:none;font-family:${FONT_DISPLAY};font-size:14px;font-weight:600;line-height:20px;border-radius:6px;border:1.5px solid ${v.border};mso-padding-alt:0;">${label}</a>`;
}

function layout({ preheader, badge, title, subtitle, bodyHtml, footerNote, kind = 'staff' }) {
  const preheaderText = escapeHtml(preheader || title);
  const isCustomer = kind === 'customer';

  // Tight, balanced spacing — same on desktop & mobile (mobile shrinks via @media)
  const logoWidth = isCustomer ? 120 : 150;
  const titleSize = isCustomer ? '20px' : '22px';
  const subtitleSize = '14px';
  const bodySize = isCustomer ? '15px' : '15px';
  const headerPad = '20px 24px 14px';
  const heroPad = '0 24px 22px';
  const contentPad = '24px';
  const footerPad = '20px 24px 22px';

  const badgeHtml = badge
    ? `<p style="margin:0 0 10px;display:inline-block;padding:5px 12px;background-color:#0a4a5c;border:1px solid ${BRAND.secondary};font-family:${FONT_DISPLAY};font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.secondary};line-height:14px;">${escapeHtml(badge)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(title)}</title>
  <link href="${FONT_LINK}" rel="stylesheet" type="text/css" />
  <style type="text/css">
    @import url('${FONT_LINK}');
    body, table, td, p, a { font-family: ${FONT_BODY}; }
    h1 { font-family: ${FONT_DISPLAY}; }

    /* Mobile: shrink padding & logo so content breathes, not jam-packs */
    @media only screen and (max-width: 540px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .px-side { padding-left: 16px !important; padding-right: 16px !important; }
      .px-content { padding-left: 16px !important; padding-right: 16px !important; }
      .logo-img { width: 110px !important; max-width: 110px !important; }
      .hero-title { font-size: 19px !important; }
      .body-text { font-size: 14.5px !important; }
      .footer-btn-row td { display: block !important; width: 100% !important; padding: 0 0 8px 0 !important; }
      .footer-btn-row .btn-cell a { display: block !important; text-align: center !important; }
      .data-cell-label, .data-cell-value { padding: 12px 14px !important; font-size: 13.5px !important; }
    }
  </style>
  <!--[if mso]>
  <style type="text/css">
    table { border-collapse: collapse; }
    .email-container { width: ${EMAIL_WIDTH}px !important; }
    body, table, td, p, a { font-family: 'Segoe UI', Helvetica, Arial, sans-serif !important; }
    h1 { font-family: 'Segoe UI', Helvetica, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:${BRAND.secondarySoft};font-family:${FONT_BODY};font-size:${bodySize};line-height:1.55;color:${BRAND.text};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${preheaderText}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${BRAND.secondarySoft};padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" class="email-container" width="${EMAIL_WIDTH}" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:${EMAIL_WIDTH}px;background-color:${BRAND.white};border:1px solid ${BRAND.border};border-radius:10px;overflow:hidden;">
          <!-- Brand header -->
          <tr>
            <td align="center" class="px-side" ${tdBg(BRAND.primary, `padding:${headerPad};`)}>
              <a href="${BRAND.site}" style="text-decoration:none;display:inline-block;">
                <img
                  src="${BRAND.logoUrl}"
                  width="${logoWidth}"
                  alt="${escapeHtml(BRAND.name)}"
                  class="logo-img"
                  style="display:block;width:${logoWidth}px;max-width:${logoWidth}px;height:auto;border:0;"
                />
              </a>
            </td>
          </tr>
          <!-- Hero -->
          <tr>
            <td class="px-side" ${tdBg(BRAND.primary, `padding:${heroPad};text-align:center;`)}>
              ${badgeHtml}
              <h1 class="hero-title" style="margin:0;font-family:${FONT_DISPLAY};font-size:${titleSize};line-height:1.3;font-weight:700;color:${BRAND.white};letter-spacing:-0.01em;">${escapeHtml(title)}</h1>
              ${subtitle ? `<p style="margin:8px 0 0;font-family:${FONT_BODY};font-size:${subtitleSize};line-height:1.45;font-weight:500;color:${BRAND.secondary};">${escapeHtml(subtitle)}</p>` : ''}
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td class="px-content body-text" style="padding:${contentPad};font-family:${FONT_BODY};font-size:${bodySize};line-height:1.6;color:${BRAND.text};">
              ${bodyHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td class="px-content" ${tdBg(BRAND.secondarySoft, `padding:${footerPad};border-top:1px solid ${BRAND.border};`)}>
              <p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:13.5px;line-height:1.55;color:${BRAND.muted};font-weight:500;">
                ${footerNote || 'Reply directly to this email to reach the customer.'}
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" class="footer-btn-row" style="margin:0 0 14px;">
                <tr>
                  <td class="btn-cell" style="padding:0 8px 6px 0;">
                    ${emailButton({ href: `${BRAND.site}/contact`, label: 'Visit website', variant: 'solid' })}
                  </td>
                  <td class="btn-cell" style="padding:0 8px 6px 0;">
                    ${emailButton({ href: `tel:${BRAND.phoneE164}`, label: escapeHtml(BRAND.phone), variant: 'outline' })}
                  </td>
                  <td class="btn-cell" style="padding:0 0 6px 0;">
                    ${emailButton({ href: BRAND.whatsappUrl, label: 'WhatsApp', variant: 'whatsapp' })}
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-family:${FONT_BODY};font-size:12.5px;line-height:1.55;color:${BRAND.muted};">
                <strong style="color:${BRAND.primary};font-weight:600;">${escapeHtml(BRAND.name)}</strong><br />
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
        <td class="data-cell-label" style="padding:13px 16px;width:32%;font-family:${FONT_BODY};font-size:13px;font-weight:700;letter-spacing:0.02em;color:${BRAND.muted};background:${BRAND.secondarySoft};border-bottom:1px solid ${BRAND.white};vertical-align:top;">${escapeHtml(label)}</td>
        <td class="data-cell-value" style="padding:13px 16px;font-family:${FONT_BODY};font-size:14.5px;font-weight:500;line-height:1.5;color:${BRAND.text};border-bottom:1px solid ${BRAND.secondarySoft};vertical-align:top;">${escapeHtml(value)}</td>
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
    <p style="margin:0 0 18px;font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${BRAND.text};">
      You have a new <strong style="color:${BRAND.primary};font-weight:600;">quote request</strong> from your website.
      Hit <strong>Reply</strong> to respond to
      <a href="mailto:${escapeHtml(data.email || '')}" style="color:${BRAND.primary};font-weight:600;text-decoration:none;">${escapeHtml(data.email || name)}</a>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;border-collapse:separate;">
      ${dataRows(entries)}
    </table>
    ${
      data.phone
        ? `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
        <tr>
          <td>
            ${emailButton({
              href: `tel:${escapeHtml(String(data.phone).replace(/\s/g, ''))}`,
              label: `Call ${escapeHtml(data.phone)}`,
              variant: 'solid',
            })}
          </td>
        </tr>
      </table>`
        : ''
    }`;

  return layout({
    preheader: `New quote from ${name} · ${data.service || 'cleaning enquiry'}`,
    badge: 'Website enquiry',
    title: 'New quote request',
    subtitle: `${name}${data.service ? ` · ${data.service}` : ''}`,
    bodyHtml,
  });
}

function contactFormEmail({ name, email, phone, message }) {
  const bodyHtml = `
    <p style="margin:0 0 18px;font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${BRAND.text};">
      A new message came in from the <strong style="color:${BRAND.primary};font-weight:600;">contact form</strong>.
      Reply to
      <a href="mailto:${escapeHtml(email)}" style="color:${BRAND.primary};font-weight:600;text-decoration:none;">${escapeHtml(email)}</a>.
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-radius:8px;overflow:hidden;border-collapse:separate;">
      ${dataRows([
        ['Name', name],
        ['Email', email],
        ['Phone', phone],
      ])}
    </table>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:18px;">
      <tr>
        <td style="padding:18px 20px;background:${BRAND.secondarySoft};border-radius:8px;border-left:4px solid ${BRAND.primary};">
          <p style="margin:0 0 8px;font-family:${FONT_DISPLAY};font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${BRAND.muted};">Their message</p>
          <p style="margin:0;font-family:${FONT_BODY};font-size:15px;line-height:1.6;color:${BRAND.text};white-space:pre-wrap;">${escapeHtml(message)}</p>
        </td>
      </tr>
    </table>`;

  return layout({
    preheader: `Contact form · ${name}`,
    badge: 'Contact form',
    title: 'New contact message',
    subtitle: name,
    bodyHtml,
  });
}

function messageToHtmlBlocks(message, fontSize = '15px') {
  const text = String(message ?? '').trim();
  if (!text) return '';
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const inner = escapeHtml(block).replace(/\n/g, '<br />');
      return `<p style="margin:0 0 12px;font-family:${FONT_BODY};font-size:${fontSize};line-height:1.6;color:${BRAND.text};">${inner}</p>`;
    })
    .join('');
}

function customerReplyEmail({ customerName, subject, message, hasAttachment, attachmentName }) {
  const greeting = customerName
    ? `Hi ${escapeHtml(customerName.trim())},`
    : 'Hello,';
  const safeSubject = String(subject || 'Your cleaning quote').trim();

  const bodyHtml = `
    <p style="margin:0 0 14px;font-family:${FONT_BODY};font-size:15px;line-height:1.55;color:${BRAND.text};">
      ${greeting}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0;">
      <tr>
        <td style="padding:18px 20px;background:${BRAND.secondarySoft};border-radius:8px;border-left:4px solid ${BRAND.primary};">
          ${messageToHtmlBlocks(message, '15px')}
        </td>
      </tr>
    </table>
    ${
      hasAttachment
        ? `<p style="margin:14px 0 0;font-family:${FONT_BODY};font-size:13.5px;line-height:1.55;color:${BRAND.muted};">
      <strong style="color:${BRAND.primary};font-weight:600;">Attachment:</strong> ${escapeHtml(attachmentName || 'See attached file')}
    </p>`
        : ''
    }
    <p style="margin:16px 0 0;font-family:${FONT_BODY};font-size:14px;line-height:1.55;color:${BRAND.muted};">
      Thank you for choosing <strong style="color:${BRAND.primary};font-weight:600;">${escapeHtml(BRAND.name)}</strong>.
      We look forward to helping you.
    </p>`;

  return layout({
    kind: 'customer',
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

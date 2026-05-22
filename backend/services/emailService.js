const dotenv = require('dotenv');
const { Resend } = require('resend');
const { quoteRequestEmail, contactFormEmail, customerReplyEmail } = require('./emailTemplates.js');

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

function getFromAddress() {
  if (process.env.EMAIL_FROM) return process.env.EMAIL_FROM;
  const name = process.env.SENDER_NAME || 'Imototo Cleaning Services';
  const email = process.env.SENDER_EMAIL || 'info@imototocleanings.co.uk';
  return `${name} <${email}>`;
}

class EmailService {
  async sendEmail(to, subject, html, { replyTo } = {}) {
    if (!process.env.RESEND_API_KEY) {
      return { success: false, error: 'RESEND_API_KEY is not configured' };
    }

    try {
      const recipients = Array.isArray(to) ? to : [to];
      const payload = {
        from: getFromAddress(),
        to: recipients,
        subject,
        html,
      };
      if (replyTo) payload.replyTo = replyTo;

      const { data, error } = await resend.emails.send(payload);

      if (error) {
        console.error('Resend send failed:', error);
        return { success: false, error: error.message || JSON.stringify(error) };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Resend send failed:', error);
      return { success: false, error: error?.message || String(error) };
    }
  }

  async sendQuoteEmail(data) {
    const name = [data.firstName, data.lastName].filter(Boolean).join(' ').trim() || 'Customer';
    const html = quoteRequestEmail(data);

    return this.sendEmail(
      process.env.RECIPIENT_EMAIL,
      `Quote request — ${name}${data.service ? ` · ${data.service}` : ''}`,
      html,
      { replyTo: data.email }
    );
  }

  async sendContactEmail(name, email, phone, message) {
    const html = contactFormEmail({ name, email, phone, message });

    return this.sendEmail(
      process.env.RECIPIENT_EMAIL,
      `Contact — ${name}`,
      html,
      { replyTo: email }
    );
  }

  async sendCustomerReply({ to, subject, message, customerName }) {
    const email = String(to || '').trim();
    const subjectLine = String(subject || '').trim();
    const body = String(message || '').trim();
    const html = customerReplyEmail({
      customerName: customerName?.trim() || '',
      subject: subjectLine,
      message: body,
    });
    const recipientEmail = process.env.RECIPIENT_EMAIL || process.env.SENDER_EMAIL;

    return this.sendEmail(email, subjectLine, html, {
      replyTo: recipientEmail,
    });
  }
}

module.exports = new EmailService();

import { Link } from 'react-router-dom';
import LegalDocument from '../components/LegalDocument';
import { SITE } from '../config';

export default function Privacy() {
  return (
    <LegalDocument
      breadcrumb="Privacy & GDPR"
      title="Privacy Policy & GDPR"
      lead={`How ${SITE.name} collects, uses and protects your personal information (UK GDPR).`}
    >
      <p className="legal-doc__intro">
        {SITE.name} respects your privacy. This policy explains what information we collect, why we use it,
        and your rights under UK data protection law (UK GDPR).
      </p>

      <h2>Who we are (data controller)</h2>
      <p>
        <strong>{SITE.name}</strong>
        <br />
        Based in {SITE.address.full}
        <br />
        Email: <a href={SITE.mailto}>{SITE.email}</a>
        <br />
        Phone / WhatsApp: <a href={SITE.whatsapp}>{SITE.phoneDisplay}</a>
      </p>

      <h2>What information we collect</h2>
      <p>We may collect and process:</p>
      <ul>
        <li>Name, phone number, email address and property address</li>
        <li>Service details you provide (property type, rooms, preferred dates, messages)</li>
        <li>Communications when you contact us by phone, WhatsApp, email or our website forms</li>
        <li>Basic technical data when you use our website (e.g. browser type, pages visited) if analytics or cookies are enabled</li>
      </ul>

      <h2>How we use your information</h2>
      <p>We use personal information only to:</p>
      <ul>
        <li>Respond to quote and contact enquiries</li>
        <li>Arrange, deliver and manage cleaning bookings</li>
        <li>Communicate about appointments, payments and service issues</li>
        <li>Improve our website and services where appropriate</li>
        <li>Meet legal or insurance requirements when applicable</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>Lawful bases (UK GDPR)</h2>
      <ul>
        <li>
          <strong>Contract:</strong> to provide cleaning services you have booked or requested
        </li>
        <li>
          <strong>Legitimate interests:</strong> to reply to enquiries and run our business safely and
          efficiently
        </li>
        <li>
          <strong>Consent:</strong> where you tick a box on our forms or agree to optional marketing (if
          offered)
        </li>
        <li>
          <strong>Legal obligation:</strong> where we must keep records for tax, insurance or law
        </li>
      </ul>

      <h2>Sharing your information</h2>
      <p>
        Client information is not sold or shared for marketing. We may use trusted providers who process data
        on our behalf, for example:
      </p>
      <ul>
        <li>Email delivery (e.g. to send form submissions to our inbox)</li>
        <li>Website hosting and security</li>
        <li>Payment or booking tools if we use them in future</li>
      </ul>
      <p>These providers may only use your data as instructed by us and must keep it secure.</p>

      <h2>How long we keep data</h2>
      <p>
        We keep enquiry and booking information only as long as needed for the purposes above, typically
        while we are in contact with you and for a reasonable period afterwards for records (e.g. up to 6
        years for business records where required). We delete or anonymise data when it is no longer needed.
      </p>

      <h2>Security</h2>
      <p>
        We take reasonable steps to protect personal information, including secure handling of emails and
        limiting access to customer details to those who need them for their work.
      </p>

      <h2>Your rights</h2>
      <p>Under UK GDPR you may have the right to:</p>
      <ul>
        <li>Access the personal data we hold about you</li>
        <li>Ask us to correct inaccurate data</li>
        <li>Ask us to delete your data in certain circumstances</li>
        <li>Object to or restrict some processing</li>
        <li>Withdraw consent where processing is based on consent</li>
        <li>Request a copy of your data in a portable format where applicable</li>
      </ul>
      <p>
        To exercise these rights, contact us at <a href={SITE.mailto}>{SITE.email}</a>. We will respond within
        one month in most cases.
      </p>
      <p>
        If you are unhappy with how we have handled your data, please contact us first so we can try to
        put things right. You also have the right to contact the UK Information Commissioner&apos;s Office
        (ICO), the UK regulator for data protection, at{' '}
        <a href="https://ico.org.uk" target="_blank" rel="noreferrer">
          ico.org.uk
        </a>
        . This is a standard right under UK law and does not mean there is a problem with our service.
      </p>

      <h2>Cookies &amp; analytics</h2>
      <p>
        Our website may use essential cookies for basic operation. If we enable tools such as Google
        Analytics or advertising pixels, we will update this policy. You can control non-essential cookies in
        your browser settings.
      </p>

      <h2>Website forms</h2>
      <p>
        When you submit our quote or contact form, you agree that we may use the details you provide to
        respond to your enquiry and provide our services, as described in this policy and our{' '}
        <Link to="/terms">Terms &amp; conditions</Link>.
      </p>

      <h2>Policy updates</h2>
      <p>
        {SITE.name} may update this Privacy Policy from time to time. Continued use of our services after
        changes constitutes notice of the updated policy where appropriate.
      </p>
    </LegalDocument>
  );
}

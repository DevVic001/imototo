import { Link } from 'react-router-dom';
import LegalDocument from '../components/LegalDocument';
import { SITE } from '../config';

const UPDATED = '19 May 2026';

export default function Terms() {
  return (
    <LegalDocument
      breadcrumb="Terms & conditions"
      title="Terms & conditions"
      lead={`Company policies for bookings, payments and services at ${SITE.name}.`}
      updated={UPDATED}
    >
      <p className="legal-doc__intro">
        At {SITE.name}, we are committed to providing reliable, professional and high-quality cleaning
        services. To ensure a smooth experience for both our customers and our team, we kindly ask clients
        to review the policies below before booking.
      </p>

      <h2>Booking &amp; appointments</h2>
      <p>
        Once a booking has been confirmed, <strong>60% of the agreed service fee</strong> must be paid as a
        deposit to secure the appointment.
      </p>
      <ul>
        <li>
          Cancellations must be made within <strong>24 hours of booking confirmation</strong> for a full
          refund of the deposit.
        </li>
        <li>
          If cancellation is made after 24 hours, only <strong>50% of the deposit paid</strong> will be
          refunded.
        </li>
        <li>
          Rescheduling requests should be made within 24 hours of the original booking confirmation. We
          kindly ask clients to provide adequate notice to help us manage appointments efficiently.
        </li>
      </ul>

      <h2>Payments</h2>
      <p>
        The remaining balance must be paid upon completion of the cleaning service unless otherwise agreed in
        advance. We accept bank transfer and other agreed payment methods.
      </p>

      <h2>Access &amp; safety</h2>
      <p>
        Clients are responsible for ensuring safe and reasonable access to the property at the scheduled
        cleaning time. Any areas requiring special attention or handling should be communicated before the
        appointment.
      </p>

      <h2>Customer satisfaction</h2>
      <p>
        Customer satisfaction is very important to us. If there are any concerns regarding the service
        provided, clients should contact us within <strong>24 hours</strong> so we can address the issue
        promptly and professionally.
      </p>

      <h2>Damages</h2>
      <p>
        While every care is taken during our cleaning services, any accidental damages or concerns should be
        reported immediately. We are committed to handling all situations fairly and professionally.
      </p>

      <h2>Professional conduct</h2>
      <p>
        We aim to provide respectful, dependable and trustworthy service at all times and kindly expect the
        same courtesy and respect in return.
      </p>

      <h2>Terms &amp; conditions</h2>
      <p>
        By booking a service with {SITE.name}, clients agree to the company&apos;s booking, payment and
        cancellation policies. Prices quoted are based on the information provided by the client and may be
        adjusted if the condition or size of the property differs significantly from the original description.
      </p>
      <p>
        {SITE.name} reserves the right to refuse or discontinue services where conditions are unsafe,
        inappropriate or beyond the agreed scope of work.
      </p>
      <p>
        For how we handle personal data, see our{' '}
        <Link to="/privacy">Privacy Policy &amp; GDPR information</Link>.
      </p>
    </LegalDocument>
  );
}

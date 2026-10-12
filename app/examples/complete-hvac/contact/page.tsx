import RequestForm from '@/components/complete-hvac/RequestForm';
import { addressLine, hours, phone, phoneHref } from '@/lib/complete-hvac-data';

export default function ContactPage() {
  return (
    <section className="hv-sec">
      <div className="hv-wrap hv-contact">
        <div className="hv-facts">
          <h1 className="hv-rule">Contact</h1>
          <p>
            <b>Phone</b>
            <a href={phoneHref}>{phone}</a>
          </p>
          <p>
            <b>Hours</b>
            {hours.map((row) => (
              <span key={row.days}>
                {row.days}: {row.time}
                <br />
              </span>
            ))}
          </p>
          <p>
            <b>Address</b>
            {addressLine}
          </p>
        </div>
        <RequestForm />
      </div>
    </section>
  );
}

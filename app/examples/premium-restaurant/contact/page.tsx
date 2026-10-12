import InquiryForm from '@/components/ridge-bistro/InquiryForm';
import { addressLine, hours, parking, phone, phoneHref } from '@/lib/ridge-bistro-data';

export default function ContactPage() {
  return (
    <section className="rb-sec">
      <div className="rb-wrap rb-split">
        <div>
          <h1>Contact</h1>
          <p className="rb-note">
            <a href={phoneHref}>{phone}</a>
          </p>
          <table className="rb-hours">
            <tbody>
              {hours.map((row) => (
                <tr key={row.days}>
                  <th scope="row">{row.days}</th>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="rb-note">{parking}</p>
          <p className="rb-note">{addressLine}</p>
        </div>
        <InquiryForm fields={['name', 'phone', 'note']} submitLabel="Send a note" />
      </div>
    </section>
  );
}

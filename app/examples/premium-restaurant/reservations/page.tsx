import InquiryForm from '@/components/ridge-bistro/InquiryForm';
import { hours, phone, phoneHref } from '@/lib/ridge-bistro-data';

export default function ReservationsPage() {
  return (
    <section className="rb-sec">
      <div className="rb-wrap rb-split">
        <div>
          <h1>Reservations</h1>
          <p className="rb-deck">A table, held for the evening.</p>
          <p className="rb-note">
            Call to reserve{' '}
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
        </div>
        <InquiryForm
          fields={['date', 'time', 'party', 'name', 'phone']}
          submitLabel="Request a table"
        />
      </div>
    </section>
  );
}

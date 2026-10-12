import Link from 'next/link';
import RequestForm from '@/components/complete-hvac/RequestForm';
import { planTable, plans, requestLabel, whyPlan } from '@/lib/complete-hvac-data';

export default function MaintenancePlansPage() {
  return (
    <>
      <section className="hv-sec">
        <div className="hv-wrap">
          <h1 className="hv-rule">Maintenance plans</h1>
          <p className="hv-lead">Two fictional plans. Prices are samples, not an offer.</p>
          <div className="hv-plans">
            {plans.map((plan) => (
              <article className="hv-plan-card" key={plan.name}>
                <h2>{plan.name}</h2>
                <p className="hv-price">{plan.price}</p>
                <p>{plan.blurb}</p>
              </article>
            ))}
          </div>
          <table className="hv-table">
            <thead>
              <tr>
                <th scope="col">Included</th>
                <th scope="col">Basic</th>
                <th scope="col">Plus</th>
              </tr>
            </thead>
            <tbody>
              {planTable.map((row) => (
                <tr key={row.feature}>
                  <th scope="row">{row.feature}</th>
                  <td>{row.basic}</td>
                  <td>{row.plus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="hv-sec hv-reveal">
        <div className="hv-wrap hv-contact">
          <div>
            <h2 className="hv-rule">Why a plan</h2>
            <p className="hv-lead">{whyPlan}</p>
            <p className="hv-lead">
              <Link href="/examples/complete-hvac/contact">{requestLabel}</Link>
            </p>
          </div>
          <RequestForm />
        </div>
      </section>
    </>
  );
}

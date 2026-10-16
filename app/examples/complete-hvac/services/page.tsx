import Image from 'next/image';
import { services } from '@/lib/complete-hvac-data';

export default function ServicesPage() {
  return (
    <section className="hv-sec">
      <div className="hv-wrap">
        <h1 className="hv-rule">Services</h1>
        <p className="hv-lead">Heating, cooling, the air in the house, and when it quits.</p>
        {services.map((service, index) => (
          <article className="hv-service hv-reveal" id={service.id} key={service.id}>
            <div className="hv-mount">
              <div className="hv-photo">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 760px) 100vw, 420px"
                />
              </div>
            </div>
            <div>
              <h2>{service.title}</h2>
              <p className="hv-lead">{service.body}</p>
              <ul>
                {service.included.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

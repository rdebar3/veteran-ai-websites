import Image from 'next/image';
import { about, serviceArea } from '@/lib/complete-hvac-data';

export default function AboutPage() {
  return (
    <section className="hv-sec">
      <div className="hv-wrap hv-about">
        <div className="hv-mount">
          <div className="hv-photo">
            <Image
              src={about.photo.src}
              alt={about.photo.alt}
              fill
              priority
              sizes="(max-width: 760px) 100vw, 480px"
            />
          </div>
        </div>
        <div>
          <h1 className="hv-rule">About</h1>
          <p className="hv-lead">{about.lead}</p>
          <p className="hv-lead">License {about.license}.</p>
          <h2 className="hv-rule hv-space">
            Where we drive
          </h2>
          <ul className="hv-towns">
            {serviceArea.towns.map((town) => (
              <li key={town}>{town}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

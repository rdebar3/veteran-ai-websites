import Image from 'next/image';
import InquiryForm from '@/components/ridge-bistro/InquiryForm';
import { privateDining } from '@/lib/ridge-bistro-data';

export default function PrivateDiningPage() {
  return (
    <section className="rb-sec">
      <div className="rb-wrap rb-room">
        <div className="rb-photo">
          <Image
            src={privateDining.photo.src}
            alt={privateDining.photo.alt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 460px"
          />
        </div>
        <div>
          <h1>{privateDining.title}</h1>
          <p className="rb-deck">{privateDining.lead}</p>
          <ul className="rb-menus">
            {privateDining.menus.map((menu) => (
              <li key={menu.name}>
                <strong>{menu.name}</strong>
                <p>{menu.detail}</p>
              </li>
            ))}
          </ul>
          <div className="rb-gap">
            <InquiryForm
              fields={['name', 'phone', 'date', 'party', 'note']}
              submitLabel="Ask about the room"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

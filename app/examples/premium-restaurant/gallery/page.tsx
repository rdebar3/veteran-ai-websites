import Image from 'next/image';
import { gallery } from '@/lib/ridge-bistro-data';

const wide = '/demos/ridge-bistro/private-dining.jpg';

export default function GalleryPage() {
  return (
    <section className="rb-sec">
      <div className="rb-wrap">
        <h1>Gallery</h1>
        <p className="rb-deck">The room, and a few plates from the week.</p>
        <div className="rb-masonry">
          {gallery.map((shot, index) => {
            const landscape = shot.src === wide;
            return (
              <figure key={shot.src}>
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={landscape ? 1280 : 864}
                  height={landscape ? 720 : 1152}
                  priority={index === 0}
                  sizes="(max-width: 760px) 100vw, 50vw"
                  style={{ width: '100%', height: 'auto' }}
                />
                <figcaption>{shot.caption}</figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}

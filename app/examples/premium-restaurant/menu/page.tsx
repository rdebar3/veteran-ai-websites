import { menu, menuNote } from '@/lib/ridge-bistro-data';

export default function MenuPage() {
  return (
    <section className="rb-sec">
      <div className="rb-wrap">
        <h1>Menu</h1>
        <p className="rb-deck">Starters, mains, and a short finish. Prices are samples.</p>
        {menu.map((group) => (
          <div className="rb-group" key={group.id} id={group.id}>
            <h2>{group.title}</h2>
            {group.items.map((item) => (
              <article className="rb-item" key={item.name}>
                <div>
                  <h3>
                    {item.name}
                    {item.mark ? <span className="rb-mark">{item.mark}</span> : null}
                  </h3>
                  <p>{item.desc}</p>
                </div>
                <p className="rb-price">{item.price}</p>
              </article>
            ))}
          </div>
        ))}
        <p className="rb-note">{menuNote}</p>
      </div>
    </section>
  );
}

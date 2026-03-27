import { upcomingEvents } from "@/data/events";
import { getNews } from "@/data/news";
import { merch } from "@/data/merch";
import { Link } from "react-router-dom";

const NewsSidebar = () => {
  const latestPosts = getNews().slice(0, 7);
  const events = upcomingEvents();

  return (
    <aside className="border-l border-black pl-6">
      <div className="space-y-10">
        <section>
          <h3 className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">PRÓXIMOS EVENTOS</h3>
          <div className="mt-4 space-y-3">
            {events.length ? (
              events.map((e) => (
                <div key={e.id} className="border border-black p-3">
                  <div className="font-body text-[10px] font-light tracking-[0.3em] text-black uppercase">{e.dateISO}</div>
                  <div className="mt-1 font-heading text-xs font-black tracking-tight text-black">{e.title}</div>
                  <div className="mt-1 font-body text-[9px] tracking-[0.2em] text-black/60 uppercase">{e.location}</div>
                </div>
              ))
            ) : (
              <div className="border border-black p-3 font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">
                Sin eventos por ahora
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">ÚLTIMAS ENTRADAS</h3>
          <div className="mt-4 space-y-3">
            {latestPosts.map((p) => (
              <Link key={p.slug} to={`/noticias/${p.slug}`} className="block border border-black p-3 hover:bg-black hover:text-white transition-colors">
                <div className="font-heading text-xs font-black tracking-tight">{p.title}</div>
                <div className="mt-1 font-body text-[9px] tracking-[0.2em] uppercase opacity-60">{p.dateISO}</div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">MERCH OFICIAL</h3>
          <div className="mt-4 grid gap-4">
            {merch.map((m) => (
              <Link key={m.id} to={m.url} className="group block border border-black p-2">
                <div className="aspect-square overflow-hidden bg-black">
                  <img src={m.image} alt={m.name} loading="lazy" className="h-full w-full object-cover grayscale group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-heading text-[10px] font-black tracking-[0.2em] text-black uppercase">{m.name}</div>
                  <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase">{m.price}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
};

export default NewsSidebar;


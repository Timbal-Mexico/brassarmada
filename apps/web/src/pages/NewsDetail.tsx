import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import NewsSidebar from "@/components/NewsSidebar";
import { getNewsBySlug } from "@/data/news";

const NewsDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getNewsBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navigation />
        <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-black tracking-tighter text-black">ENTRADA NO ENCONTRADA</h1>
          <Link to="/noticias" className="mt-6 inline-block border border-black px-6 py-3 font-heading text-[10px] font-black tracking-[0.2em] text-black">
            VOLVER A NOTICIAS
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid gap-10 md:grid-cols-12">
            <article className="md:col-span-8">
              <div className="flex items-center justify-between">
                <h1 className="font-heading text-3xl font-black tracking-tighter text-black md:text-5xl">{post.title}</h1>
                <div className="font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">{post.dateISO}</div>
              </div>
              <div className="mt-2 font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">Por {post.author}</div>
              {post.image ? (
                <div className="mt-8 border border-black bg-black p-1">
                  <div className="aspect-[16/9]">
                    <img src={post.image} alt={post.title} className="h-full w-full object-cover grayscale" />
                  </div>
                </div>
              ) : null}
              <div className="mt-10 font-body text-sm leading-relaxed tracking-widest text-black uppercase font-light">
                {post.content}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link key={t} to={`/noticias?q=${encodeURIComponent(t)}`} className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white">
                    {t}
                  </Link>
                ))}
              </div>
              <div className="mt-10">
                <Link to="/noticias" className="inline-block border border-black px-6 py-3 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors">
                  ← VOLVER AL LISTADO
                </Link>
              </div>
            </article>
            <div className="md:col-span-4">
              <NewsSidebar />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NewsDetail;


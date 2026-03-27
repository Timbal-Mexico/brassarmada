import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { bands } from "@/data/bands";
import { Calendar } from "@/components/ui/calendar";
import { getArtistBySlug, saveArtistOverride } from "@/data/artists";
import type { Artist } from "@/data/artists";
import { AlertCircle } from "lucide-react";

const isoFromDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const STATS_KEY = "brassarmada_artist_stats_v1";

const ArtistAdmin = () => {
  const { slug } = useParams<{ slug: string }>();
  const base = useMemo(() => (slug ? getArtistBySlug(slug) : undefined), [slug]);
  const [saved, setSaved] = useState(false);

  const [draft, setDraft] = useState<Artist | undefined>(() => base);
  const [statusForCalendar, setStatusForCalendar] = useState<"disponible" | "reservado" | "pendiente">("reservado");

  const bandOptions = bands.map((b) => ({ slug: b.slug, name: b.name }));

  const update = (patch: Partial<Artist>) => {
    setSaved(false);
    setDraft((d) => (d ? { ...d, ...patch } : d));
  };

  const updateContact = (patch: NonNullable<Artist["contact"]>) => {
    setSaved(false);
    setDraft((d) => {
      if (!d) return d;
      return { ...d, contact: { ...(d.contact ?? {}), ...patch } };
    });
  };

  const updateTimelineItem = (idx: number, patch: Partial<Artist["timeline"][number]>) => {
    setSaved(false);
    setDraft((d) => {
      if (!d) return d;
      const next = d.timeline.map((t, i) => (i === idx ? { ...t, ...patch } : t));
      return { ...d, timeline: next };
    });
  };

  const updateInstrumentItem = (idx: number, patch: Partial<Artist["instruments"][number]>) => {
    setSaved(false);
    setDraft((d) => {
      if (!d) return d;
      const next = d.instruments.map((t, i) => (i === idx ? { ...t, ...patch } : t));
      return { ...d, instruments: next };
    });
  };

  const updateAvailabilityItem = (idx: number, patch: Partial<Artist["availability"][number]>) => {
    setSaved(false);
    setDraft((d) => {
      if (!d) return d;
      const next = d.availability.map((t, i) => (i === idx ? { ...t, ...patch } : t));
      return { ...d, availability: next };
    });
  };

  const addStyle = (value: string) => {
    const v = value.trim().toUpperCase();
    if (!v) return;
    if (draft.styles.includes(v)) return;
    update({ styles: [...draft.styles, v] });
  };

  const removeStyle = (value: string) => {
    update({ styles: draft.styles.filter((s) => s !== value) });
  };

  const save = () => {
    if (!draft) return;
    saveArtistOverride(draft.slug, draft);
    setSaved(true);
  };

  const selectedDates = useMemo(() => {
    return (draft?.availability ?? []).map((a) => {
      const [y, m, d] = a.date.split("-").map(Number);
      return new Date(y, m - 1, d);
    });
  }, [draft?.availability]);

  const stats = useMemo(() => {
    if (!draft?.slug) return { views: 0, hireClicks: 0 };
    if (typeof window === "undefined") return { views: 0, hireClicks: 0 };
    try {
      const raw = window.localStorage.getItem(STATS_KEY);
      if (!raw) return { views: 0, hireClicks: 0 };
      const parsed = JSON.parse(raw) as Record<string, { views?: number; hireClicks?: number }>;
      const s = parsed[draft.slug] ?? {};
      return { views: s.views ?? 0, hireClicks: s.hireClicks ?? 0 };
    } catch {
      return { views: 0, hireClicks: 0 };
    }
  }, [draft?.slug]);

  if (!base || !draft) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <Navigation />
        <div className="mx-auto w-full max-w-5xl px-4 py-20 text-center">
          <h1 className="font-heading text-3xl font-black tracking-tighter text-black">ARTISTA NO ENCONTRADO</h1>
          <Link
            to="/artistas"
            className="mt-6 inline-block border border-black px-6 py-3 font-heading text-[10px] font-black tracking-[0.2em] text-black"
          >
            VOLVER
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const youtubeId = (url: string) => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
    ];
    for (const re of patterns) {
      const m = url.match(re);
      if (m?.[1]) return m[1];
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-background pt-16">
      <Navigation />

      <section className="border-b border-black bg-white px-4 py-16">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-heading text-4xl font-black tracking-tighter text-black md:text-6xl">PANEL / ARTISTA</h1>
              <div className="mt-4 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                {draft.name} · {draft.slug}
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/artistas/${draft.slug}`}
                className="h-11 border border-black bg-white px-6 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors flex items-center justify-center"
              >
                VER PERFIL
              </Link>
              <button
                type="button"
                onClick={save}
                className="h-11 border border-black bg-black px-6 font-heading text-[10px] font-black tracking-[0.2em] text-white hover:opacity-80"
              >
                GUARDAR
              </button>
            </div>
          </div>

          {saved ? (
            <div className="mt-6 border border-black bg-white p-4 font-body text-[10px] tracking-[0.2em] text-black uppercase">
              Cambios guardados (simulado en localStorage)
            </div>
          ) : null}

          <div className="mt-10 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="border border-black p-8 mb-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">ESTADÍSTICAS</div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="border border-black p-6">
                    <div className="font-heading text-3xl font-black tracking-tighter text-black">{stats.views}</div>
                    <div className="mt-2 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">VISTAS</div>
                  </div>
                  <div className="border border-black p-6">
                    <div className="font-heading text-3xl font-black tracking-tighter text-black">{stats.hireClicks}</div>
                    <div className="mt-2 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">CLICS CONTRATAR</div>
                  </div>
                </div>
              </div>

              <div className="border border-black p-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">BÁSICOS</div>
                <div className="mt-6 grid gap-4">
                  <input
                    value={draft.name}
                    onChange={(e) => update({ name: e.target.value.toUpperCase() })}
                    className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                    aria-label="Nombre"
                  />
                  <input
                    value={draft.image}
                    onChange={(e) => update({ image: e.target.value })}
                    className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                    aria-label="URL de foto"
                  />
                  <input
                    value={draft.cvUrl ?? ""}
                    onChange={(e) => update({ cvUrl: e.target.value })}
                    className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                    aria-label="URL de CV"
                    placeholder="URL CV (PDF)"
                  />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <input
                      value={draft.contact?.email ?? ""}
                      onChange={(e) => updateContact({ email: e.target.value })}
                      className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                      aria-label="Email de contacto"
                      placeholder="EMAIL"
                    />
                    <input
                      value={draft.contact?.phone ?? ""}
                      onChange={(e) => updateContact({ phone: e.target.value.replace(/\s+/g, "") })}
                      className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                      aria-label="Teléfono de contacto"
                      placeholder="TELÉFONO"
                    />
                    <select
                      value={draft.contact?.preferred ?? "whatsapp"}
                      onChange={(e) => updateContact({ preferred: e.target.value as NonNullable<Artist["contact"]>["preferred"] })}
                      className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                      aria-label="Preferencia de contacto"
                    >
                      <option value="whatsapp">WHATSAPP</option>
                      <option value="email">EMAIL</option>
                      <option value="phone">TELÉFONO</option>
                    </select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      value={draft.genre}
                      onChange={(e) => update({ genre: e.target.value })}
                      className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                      aria-label="Género"
                    />
                    <input
                      value={draft.debutYear}
                      onChange={(e) => update({ debutYear: Number(e.target.value) })}
                      className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                      aria-label="Año debut"
                      type="number"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="flex h-11 items-center justify-between border border-black px-3">
                      <span className="font-body text-[10px] tracking-[0.2em] text-black uppercase">ACTIVO</span>
                      <input
                        type="checkbox"
                        checked={draft.active}
                        onChange={(e) => update({ active: e.target.checked })}
                        className="h-4 w-4 accent-black"
                        aria-label="Activo"
                      />
                    </label>
                    <select
                      value={draft.availabilityStatus}
                      onChange={(e) => update({ availabilityStatus: e.target.value as Artist["availabilityStatus"] })}
                      className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                      aria-label="Estado de disponibilidad"
                    >
                      <option value="disponible">DISPONIBLE</option>
                      <option value="pendiente">PENDIENTE</option>
                      <option value="reservado">RESERVADO</option>
                    </select>
                  </div>
                  <textarea
                    value={draft.bio}
                    onChange={(e) => update({ bio: e.target.value })}
                    className="min-h-40 w-full border border-black bg-white p-3 font-body text-[10px] tracking-[0.2em] text-black"
                    aria-label="Bio"
                  />
                </div>
              </div>

              <div className="mt-8 border border-black p-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">ESTILOS</div>
                <div className="mt-6 flex flex-wrap gap-2">
                  {draft.styles.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => removeStyle(s)}
                      className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase hover:bg-black hover:text-white transition-colors"
                    >
                      {s} ✕
                    </button>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <input
                    className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                    aria-label="Nuevo estilo"
                    placeholder="AGREGAR ESTILO"
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      addStyle((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = "";
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 border border-black p-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">INSTRUMENTOS</div>
                <div className="mt-6 grid gap-4">
                  {draft.instruments.map((inst, idx) => (
                    <div key={`${inst.name}-${idx}`} className="grid gap-3 border border-black p-4 sm:grid-cols-3 sm:items-center">
                      <input
                        value={inst.name}
                        onChange={(e) => updateInstrumentItem(idx, { name: e.target.value.toUpperCase() })}
                        className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                        aria-label={`Instrumento ${idx + 1}`}
                      />
                      <select
                        value={inst.level}
                        onChange={(e) => updateInstrumentItem(idx, { level: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
                        className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                        aria-label={`Nivel ${idx + 1}`}
                      >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setSaved(false);
                          update({ instruments: draft.instruments.filter((_, i) => i !== idx) });
                        }}
                        className="h-10 border border-black bg-white px-3 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                      >
                        ELIMINAR
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update({ instruments: [...draft.instruments, { name: "NUEVO", level: 3 }] })}
                    className="h-11 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                  >
                    AGREGAR INSTRUMENTO
                  </button>
                </div>
              </div>

              <div className="mt-8 border border-black p-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">MULTIMEDIA</div>
                <div className="mt-6 grid gap-4">
                  {(draft.gallery ?? []).map((src, idx) => (
                    <div key={`${src}-${idx}`} className="grid gap-3 sm:grid-cols-6 sm:items-center">
                      <input
                        value={src}
                        onChange={(e) => {
                          setSaved(false);
                          const next = [...(draft.gallery ?? [])];
                          next[idx] = e.target.value;
                          update({ gallery: next });
                        }}
                        className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black sm:col-span-5"
                        aria-label={`Galería ${idx + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSaved(false);
                          const next = (draft.gallery ?? []).filter((_, i) => i !== idx);
                          update({ gallery: next });
                        }}
                        className="h-10 border border-black bg-white px-3 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors sm:col-span-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => update({ gallery: [...(draft.gallery ?? []), "https://"] })}
                    className="h-11 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                  >
                    AGREGAR FOTO/VIDEO
                  </button>
                </div>
              </div>

              <div className="mt-8 border border-black p-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">MIS JAMS (YouTube)</div>
                <div className="mt-2 flex items-center gap-2 text-black">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase opacity-60">
                    Pega la URL de YouTube (watch, youtu.be o embed). Se valida y se muestra previsualización.
                  </span>
                </div>
                <div className="mt-6 grid gap-4">
                  {(draft.jams ?? []).map((url, idx) => {
                    const id = youtubeId(url);
                    const isValid = !!id;
                    return (
                      <div key={`${url}-${idx}`} className="grid gap-4 md:grid-cols-2">
                        <input
                          value={url}
                          onChange={(e) => {
                            setSaved(false);
                            const next = [...(draft.jams ?? [])];
                            next[idx] = e.target.value;
                            update({ jams: next });
                          }}
                          className={`h-11 w-full border px-3 font-body text-[10px] tracking-[0.2em] ${isValid ? "border-black bg-white text-black" : "border-red-600 bg-white text-black"}`}
                          aria-label={`Jam ${idx + 1}`}
                          placeholder="https://www.youtube.com/watch?v=XXXXXXXXXXX"
                        />
                        <div className="border border-black bg-black p-1">
                          {isValid ? (
                            <div className="aspect-video">
                              <iframe
                                src={`https://www.youtube.com/embed/${id}`}
                                width="100%"
                                height="100%"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                loading="lazy"
                                title={`Jam ${idx + 1}`}
                                className="grayscale"
                              />
                            </div>
                          ) : (
                            <div className="flex aspect-video items-center justify-center bg-white font-body text-[10px] tracking-[0.2em] text-black">
                              URL inválida
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSaved(false);
                              const next = (draft.jams ?? []).filter((_, i) => i !== idx);
                              update({ jams: next });
                            }}
                            className="h-10 border border-black bg-white px-3 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                          >
                            ELIMINAR
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => update({ jams: [...(draft.jams ?? []), "https://www.youtube.com/watch?v="] })}
                    className="h-11 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                  >
                    AGREGAR JAM
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="border border-black p-8">
                <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">TIMELINE</div>
                <div className="mt-6 grid gap-4">
                  {draft.timeline.map((t, idx) => (
                    <div key={`${t.year}-${idx}`} className="border border-black p-4">
                      <div className="grid gap-3 sm:grid-cols-3">
                        <input
                          type="number"
                          value={t.year}
                          onChange={(e) => updateTimelineItem(idx, { year: Number(e.target.value) })}
                          className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                          aria-label={`Año ${idx + 1}`}
                        />
                        <input
                          value={t.title}
                          onChange={(e) => updateTimelineItem(idx, { title: e.target.value })}
                          className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                          aria-label={`Título ${idx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSaved(false);
                            update({ timeline: draft.timeline.filter((_, i) => i !== idx) });
                          }}
                          className="h-10 border border-black bg-white px-3 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                        >
                          ELIMINAR
                        </button>
                      </div>
                      <textarea
                        value={t.description}
                        onChange={(e) => updateTimelineItem(idx, { description: e.target.value })}
                        className="mt-3 min-h-24 w-full border border-black bg-white p-3 font-body text-[10px] tracking-[0.2em] text-black"
                        aria-label={`Descripción ${idx + 1}`}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() =>
                      update({
                        timeline: [
                          ...draft.timeline,
                          { year: new Date().getFullYear(), title: "NUEVO HITO", description: "Descripción…" },
                        ],
                      })
                    }
                    className="h-11 border border-black bg-white px-4 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                  >
                    AGREGAR HITO
                  </button>
                </div>
              </div>

              <div className="mt-8 border border-black p-8">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">CALENDARIO</div>
                    <div className="mt-2 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
                      Selecciona fechas para marcar disponibilidad
                    </div>
                  </div>
                  <select
                    value={statusForCalendar}
                    onChange={(e) => setStatusForCalendar(e.target.value as typeof statusForCalendar)}
                    className="h-11 border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                    aria-label="Estado para asignar"
                  >
                    <option value="disponible">DISPONIBLE</option>
                    <option value="pendiente">PENDIENTE</option>
                    <option value="reservado">RESERVADO</option>
                  </select>
                </div>

                <div className="mt-8 border border-black">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={(dates) => {
                      const nextDates = dates ?? [];
                      const nextIso = new Set(nextDates.map(isoFromDate));
                      const existing = new Map(draft.availability.map((a) => [a.date, a]));
                      const next: Artist["availability"] = [];

                      for (const iso of nextIso) {
                        const prev = existing.get(iso);
                        next.push(
                          prev
                            ? { ...prev, status: statusForCalendar }
                            : {
                                date: iso,
                                status: statusForCalendar,
                                bandSlug: draft.bandSlugs[0],
                                location: "",
                                eventType: "",
                                durationHours: 2,
                              },
                        );
                      }

                      setSaved(false);
                      update({ availability: next.sort((a, b) => a.date.localeCompare(b.date)) });
                    }}
                    className="p-4"
                  />
                </div>

                <div className="mt-8 grid gap-4">
                  {draft.availability
                    .slice()
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((a, idx) => (
                      <div key={`${a.date}-${idx}`} className="border border-black p-4">
                        <div className="grid gap-3 md:grid-cols-6">
                          <input
                            value={a.date}
                            onChange={(e) => updateAvailabilityItem(idx, { date: e.target.value })}
                            className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                            aria-label={`Fecha ${idx + 1}`}
                          />
                          <select
                            value={a.status}
                            onChange={(e) => updateAvailabilityItem(idx, { status: e.target.value as Artist["availability"][number]["status"] })}
                            className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                            aria-label={`Estado ${idx + 1}`}
                          >
                            <option value="disponible">DISPONIBLE</option>
                            <option value="pendiente">PENDIENTE</option>
                            <option value="reservado">RESERVADO</option>
                          </select>
                          <select
                            value={a.bandSlug ?? ""}
                            onChange={(e) => updateAvailabilityItem(idx, { bandSlug: e.target.value })}
                            className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                            aria-label={`Banda ${idx + 1}`}
                          >
                            <option value="">BANDA</option>
                            {bandOptions.map((b) => (
                              <option key={b.slug} value={b.slug}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                          <input
                            value={a.location ?? ""}
                            onChange={(e) => updateAvailabilityItem(idx, { location: e.target.value.toUpperCase() })}
                            className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                            aria-label={`Ubicación ${idx + 1}`}
                            placeholder="UBICACIÓN"
                          />
                          <input
                            value={a.eventType ?? ""}
                            onChange={(e) => updateAvailabilityItem(idx, { eventType: e.target.value.toUpperCase() })}
                            className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
                            aria-label={`Tipo evento ${idx + 1}`}
                            placeholder="EVENTO"
                          />
                          <div className="flex gap-3">
                            <input
                              value={a.durationHours ?? 2}
                              onChange={(e) => updateAvailabilityItem(idx, { durationHours: Number(e.target.value) })}
                              className="h-10 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black"
                              aria-label={`Duración ${idx + 1}`}
                              type="number"
                              min={1}
                              max={12}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSaved(false);
                                update({ availability: draft.availability.filter((_, i) => i !== idx) });
                              }}
                              className="h-10 shrink-0 border border-black bg-white px-3 font-heading text-[10px] font-black tracking-[0.2em] text-black hover:bg-black hover:text-white transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ArtistAdmin;

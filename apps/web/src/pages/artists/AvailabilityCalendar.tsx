import { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export type AvailabilityItem = {
  date: string;
  status: "disponible" | "reservado" | "pendiente";
  bandSlug?: string;
  location?: string;
  eventType?: string;
  durationHours?: number;
};

export type AvailabilityFilters = {
  bandSlug: string;
  location: string;
  eventType: string;
  durationHours: string;
};

const parseISODate = (iso: string) => {
  const [y, m, d] = iso.split("-").map((v) => Number(v));
  return new Date(y, m - 1, d);
};

const formatISO = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const AvailabilityCalendar = ({
  items,
  availableBandSlugs,
}: {
  items: AvailabilityItem[];
  availableBandSlugs: { slug: string; name: string }[];
}) => {
  const [view, setView] = useState<"mes" | "semana">("mes");
  const [filters, setFilters] = useState<AvailabilityFilters>({
    bandSlug: "",
    location: "",
    eventType: "",
    durationHours: "",
  });

  const options = useMemo(() => {
    const locations = Array.from(new Set(items.map((i) => i.location).filter(Boolean))).sort();
    const eventTypes = Array.from(new Set(items.map((i) => i.eventType).filter(Boolean))).sort();
    const durations = Array.from(new Set(items.map((i) => i.durationHours).filter(Boolean)))
      .map((n) => String(n))
      .sort((a, b) => Number(a) - Number(b));

    return { locations, eventTypes, durations };
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (filters.bandSlug && i.bandSlug !== filters.bandSlug) return false;
      if (filters.location && (i.location ?? "") !== filters.location) return false;
      if (filters.eventType && (i.eventType ?? "") !== filters.eventType) return false;
      if (filters.durationHours && String(i.durationHours ?? "") !== filters.durationHours) return false;
      return true;
    });
  }, [filters, items]);

  const byDate = useMemo(() => {
    const map = new Map<string, AvailabilityItem>();
    for (const item of filtered) map.set(item.date, item);
    return map;
  }, [filtered]);

  const reservedDays = useMemo(() => {
    return filtered.filter((i) => i.status === "reservado").map((i) => parseISODate(i.date));
  }, [filtered]);

  const pendingDays = useMemo(() => {
    return filtered.filter((i) => i.status === "pendiente").map((i) => parseISODate(i.date));
  }, [filtered]);

  const startOfWeek = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const day = d.getDay();
    const diff = (day + 6) % 7;
    d.setDate(d.getDate() - diff);
    return d;
  }, []);

  const weekDays = useMemo(() => {
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  }, [startOfWeek]);

  return (
    <div className="border border-black bg-white">
      <div className="border-b border-black p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-heading text-xl font-black tracking-tight text-black">DISPONIBILIDAD</h3>
            <div className="mt-2 font-body text-[10px] font-light tracking-[0.3em] text-black uppercase opacity-60">
              Filtros acumulativos por artista/banda
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              aria-pressed={view === "mes"}
              onClick={() => setView("mes")}
              className={`h-10 border border-black px-4 font-heading text-[10px] font-black tracking-[0.2em] ${
                view === "mes" ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              MES
            </button>
            <button
              type="button"
              aria-pressed={view === "semana"}
              onClick={() => setView("semana")}
              className={`h-10 border border-black px-4 font-heading text-[10px] font-black tracking-[0.2em] ${
                view === "semana" ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
              }`}
            >
              SEMANA
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <select
            value={filters.bandSlug}
            onChange={(e) => setFilters((f) => ({ ...f, bandSlug: e.target.value }))}
            aria-label="Filtrar por banda"
            className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
          >
            <option value="">BANDA / PROYECTO</option>
            {availableBandSlugs.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
          <select
            value={filters.location}
            onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
            aria-label="Filtrar por ubicación"
            className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
          >
            <option value="">UBICACIÓN</option>
            {options.locations.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={filters.eventType}
            onChange={(e) => setFilters((f) => ({ ...f, eventType: e.target.value }))}
            aria-label="Filtrar por tipo de evento"
            className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
          >
            <option value="">TIPO DE EVENTO</option>
            {options.eventTypes.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <select
            value={filters.durationHours}
            onChange={(e) => setFilters((f) => ({ ...f, durationHours: e.target.value }))}
            aria-label="Filtrar por duración"
            className="h-11 w-full border border-black bg-white px-3 font-body text-[10px] tracking-[0.2em] text-black uppercase"
          >
            <option value="">DURACIÓN</option>
            {options.durations.map((v) => (
              <option key={v} value={v}>
                {v} HRS
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border border-black bg-black" />
            <span className="font-body text-[10px] tracking-[0.2em] text-black uppercase">RESERVADO</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border border-black bg-white" />
            <span className="font-body text-[10px] tracking-[0.2em] text-black uppercase">DISPONIBLE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 border border-black bg-white outline outline-1 outline-black/40" />
            <span className="font-body text-[10px] tracking-[0.2em] text-black uppercase">PENDIENTE</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {view === "mes" ? (
          <Calendar
            mode="single"
            modifiers={{
              reserved: reservedDays,
              pending: pendingDays,
            }}
            modifiersClassNames={{
              reserved: "bg-black text-white hover:bg-black hover:text-white",
              pending: "border border-black bg-white text-black",
            }}
            className="p-0"
            classNames={{
              months: "flex flex-col",
              month: "space-y-4",
              caption_label: "font-heading font-black tracking-[0.2em] text-black uppercase text-xs",
              nav_button: "h-8 w-8 border border-black rounded-none bg-white text-black hover:bg-black hover:text-white",
              head_cell: "w-10 text-black font-body text-[10px] tracking-[0.2em] uppercase opacity-60",
              cell: "h-10 w-10 p-0",
              day: "h-10 w-10 rounded-none border border-black/10 font-body text-[10px] text-black hover:bg-black hover:text-white",
              day_today: "border border-black",
              day_selected: "bg-black text-white hover:bg-black hover:text-white",
            }}
            onSelect={(date) => {
              if (!date) return;
              const iso = formatISO(date);
              const item = byDate.get(iso);
              if (!item) return;
              const el = document.getElementById("availability-detail");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
          />
        ) : (
          <div className="grid gap-3">
            {weekDays.map((d) => {
              const iso = formatISO(d);
              const item = byDate.get(iso);
              const status = item?.status ?? "disponible";
              return (
                <div key={iso} className="flex items-center justify-between border border-black px-4 py-3">
                  <div className="font-body text-[10px] font-light tracking-[0.3em] text-black uppercase">
                    {iso}
                  </div>
                  <div className="flex items-center gap-3">
                    {item?.bandSlug ? (
                      <span className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
                        {item.bandSlug}
                      </span>
                    ) : null}
                    <span
                      className={`border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] uppercase ${
                        status === "reservado" ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    >
                      {status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div id="availability-detail" className="mt-10 border-t border-black pt-8">
          <div className="font-heading text-[10px] font-black tracking-[0.3em] text-black uppercase">DETALLE</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {filtered.length ? (
              filtered
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((i) => (
                  <div key={`${i.date}-${i.bandSlug ?? ""}`} className="border border-black p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-body text-[10px] font-light tracking-[0.3em] text-black uppercase">{i.date}</div>
                      <span
                        className={`border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] uppercase ${
                          i.status === "reservado" ? "bg-black text-white" : "bg-white text-black"
                        }`}
                      >
                        {i.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {i.bandSlug ? (
                        <span className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
                          {availableBandSlugs.find((b) => b.slug === i.bandSlug)?.name ?? i.bandSlug}
                        </span>
                      ) : null}
                      {i.location ? (
                        <span className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
                          {i.location}
                        </span>
                      ) : null}
                      {i.eventType ? (
                        <span className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
                          {i.eventType}
                        </span>
                      ) : null}
                      {i.durationHours ? (
                        <span className="border border-black px-2 py-1 font-body text-[9px] tracking-[0.2em] text-black uppercase">
                          {i.durationHours} HRS
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))
            ) : (
              <div className="border border-black p-6 font-body text-[10px] tracking-[0.2em] text-black uppercase opacity-60">
                Sin resultados para los filtros actuales
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendar;

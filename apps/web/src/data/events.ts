export type BandEvent = {
  id: string;
  bandSlug: string;
  title: string;
  dateISO: string;
  location: string;
};

export const events: BandEvent[] = [
  { id: "e1", bandSlug: "arturo-de-la-torre", title: "Gala Jazz", dateISO: "2026-04-12", location: "CDMX" },
  { id: "e2", bandSlug: "la-conzatti", title: "Residencia Club", dateISO: "2026-04-08", location: "CDMX" },
  { id: "e3", bandSlug: "arturo-de-la-torre-jazz-orchestra", title: "Festival Orquestal", dateISO: "2026-04-21", location: "GDL" },
  { id: "e4", bandSlug: "beloit", title: "Show Corporativo", dateISO: "2026-04-17", location: "CDMX" },
];

export const upcomingEvents = (fromISO?: string): BandEvent[] => {
  const today = fromISO ? new Date(fromISO) : new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");
  const iso = `${y}-${m}-${d}`;
  return events
    .filter((e) => e.dateISO >= iso)
    .sort((a, b) => a.dateISO.localeCompare(b.dateISO));
};


import DashboardLayout from "@/components/DashboardLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";

const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const events: Record<number, { label: string; type: "gig" | "rehearsal" | "busy" }> = {
  5: { label: "Ensayo", type: "rehearsal" },
  14: { label: "Neon Horizon", type: "gig" },
  18: { label: "Sapphire Lounge", type: "gig" },
  22: { label: "Beat Gala", type: "gig" },
  25: { label: "No disponible", type: "busy" },
};

const CalendarPage = () => {
  const totalCells = 35;
  const startOffset = 5; // March 2026 starts on Sunday (offset 6, 0-indexed Mon=0 so Sun=6, shifted to 5 for display)

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Calendario</h1>
      <p className="text-muted-foreground mb-8">Tu disponibilidad y eventos programados</p>

      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-6">
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-display font-semibold text-foreground">Marzo 2026</h2>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
          ))}
          {Array.from({ length: totalCells }).map((_, i) => {
            const dayNum = i - startOffset + 1;
            const isValid = dayNum >= 1 && dayNum <= 31;
            const event = isValid ? events[dayNum] : undefined;
            return (
              <div
                key={i}
                className={`relative h-16 rounded-lg p-1 text-sm transition-colors ${
                  isValid ? "hover:bg-muted/50 cursor-pointer" : ""
                } ${event?.type === "gig" ? "bg-primary/10 border border-primary/20" : ""} ${
                  event?.type === "busy" ? "bg-destructive/10 border border-destructive/20" : ""
                } ${event?.type === "rehearsal" ? "bg-secondary/10 border border-secondary/20" : ""}`}
              >
                {isValid && (
                  <>
                    <span className="text-xs text-muted-foreground">{dayNum}</span>
                    {event && (
                      <p className={`text-[9px] font-medium mt-0.5 truncate ${
                        event.type === "gig" ? "text-primary" : event.type === "busy" ? "text-destructive" : "text-secondary"
                      }`}>
                        {event.label}
                      </p>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-6 mt-6">
          {[
            { color: "bg-primary", label: "Gigs" },
            { color: "bg-secondary", label: "Ensayos" },
            { color: "bg-destructive", label: "No Disponible" },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${l.color}`} />
              <span className="text-xs text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;

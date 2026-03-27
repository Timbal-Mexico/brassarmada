import DashboardLayout from "@/components/DashboardLayout";
import { Guitar, Users, Plus } from "lucide-react";

const bands = [
  { name: "Neon Pulse", role: "Guitarrista Lead", members: 5, genre: "Rock Alternativo", status: "active" },
  { name: "Midnight Echo", role: "Bajista", members: 4, genre: "Jazz Fusión", status: "active" },
  { name: "Static Haze", role: "Vocalista", members: 3, genre: "Indie Electronic", status: "inactive" },
];

const Bands = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Mis Bandas</h1>
          <p className="text-muted-foreground">Gestiona tus proyectos musicales</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all">
          <Plus className="h-4 w-4" />
          Nueva Banda
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bands.map((band) => (
          <div key={band.name} className="glass-card p-6 hover:neon-border transition-all cursor-pointer">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                <Guitar className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{band.name}</p>
                <p className="text-xs text-primary">{band.role}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                <span>{band.members} miembros</span>
              </div>
              <span className="text-xs text-muted-foreground">{band.genre}</span>
            </div>
            <div className="mt-3">
              <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                band.status === "active" ? "status-confirmed" : "bg-muted text-muted-foreground"
              }`}>
                {band.status === "active" ? "Activa" : "Inactiva"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Bands;

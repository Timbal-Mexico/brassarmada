import { Users, CheckCircle, FileText } from "lucide-react";

const stats = [
  { icon: Users, label: "TOTAL BANDAS", value: "12", color: "text-secondary" },
  { icon: CheckCircle, label: "GIGS COMPLETADOS", value: "248", color: "text-primary" },
  { icon: FileText, label: "COTIZACIONES PENDIENTES", value: "07", color: "text-neon-pink" },
];

const StatsCards = () => {
  return (
    <div className="flex flex-col gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-4 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
            <stat.icon className={`h-5 w-5 ${stat.color}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground tracking-wider">{stat.label}</p>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;

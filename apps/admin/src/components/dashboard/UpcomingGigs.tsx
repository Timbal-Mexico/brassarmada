const gigs = [
  {
    month: "MAR",
    day: "14",
    name: "Neon Horizon Festival",
    location: "Los Angeles, CA • Main Stage",
    status: "confirmed" as const,
    amount: "$12,500.00",
  },
  {
    month: "MAR",
    day: "18",
    name: "The Sapphire Lounge",
    location: "Seattle, WA • Acoustic Set",
    status: "action" as const,
    amount: "$4,200.00",
  },
  {
    month: "MAR",
    day: "22",
    name: "Underground Beat Gala",
    location: "Chicago, IL • Corporate Event",
    status: "confirmed" as const,
    amount: "$8,900.00",
  },
];

const UpcomingGigs = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground">
          Próximos Eventos
        </h3>
        <button className="text-sm text-primary hover:text-primary/80 transition-colors">
          Ver Calendario
        </button>
      </div>
      <div className="space-y-4">
        {gigs.map((gig) => (
          <div key={gig.name} className="flex items-center gap-4">
            <div className="flex flex-col items-center rounded-lg bg-muted px-3 py-2 min-w-[52px]">
              <span className="text-[10px] font-semibold text-primary">{gig.month}</span>
              <span className="text-lg font-display font-bold text-foreground">{gig.day}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{gig.name}</p>
              <p className="text-xs text-muted-foreground truncate">{gig.location}</p>
            </div>
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                gig.status === "confirmed" ? "status-confirmed" : "status-action"
              }`}
            >
              {gig.status === "confirmed" ? "Confirmado" : "Acción Req."}
            </span>
            <span className="text-sm font-medium text-foreground whitespace-nowrap">{gig.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingGigs;

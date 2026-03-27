import DashboardLayout from "@/components/DashboardLayout";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const quotations = [
  { id: "COT-001", client: "Eventos MX", event: "Boda Premium", date: "Mar 10", amount: "$15,000", status: "sent" },
  { id: "COT-002", client: "Festival Norte", event: "Main Stage Set", date: "Mar 08", amount: "$22,500", status: "accepted" },
  { id: "COT-003", client: "Bar Eclipse", event: "Noche de Jazz", date: "Mar 05", amount: "$4,800", status: "declined" },
  { id: "COT-004", client: "Corp Solutions", event: "Evento Corporativo", date: "Mar 12", amount: "$18,000", status: "draft" },
];

const statusConfig = {
  sent: { label: "Enviada", icon: Clock, class: "status-action" },
  accepted: { label: "Aceptada", icon: CheckCircle, class: "status-confirmed" },
  declined: { label: "Rechazada", icon: XCircle, class: "bg-destructive/20 text-destructive border border-destructive/30" },
  draft: { label: "Borrador", icon: FileText, class: "bg-muted text-muted-foreground" },
};

const Quotations = () => {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Cotizaciones</h1>
          <p className="text-muted-foreground">Gestiona tus propuestas y cotizaciones</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:shadow-lg hover:shadow-primary/25 transition-all">
          <Plus className="h-4 w-4" />
          Nueva Cotización
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "Cliente", "Evento", "Fecha", "Monto", "Estado"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotations.map((q) => {
              const s = statusConfig[q.status as keyof typeof statusConfig];
              return (
                <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3 text-sm font-mono text-primary">{q.id}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{q.client}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{q.event}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{q.date}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">{q.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${s.class}`}>
                      <s.icon className="h-3 w-3" />
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Quotations;

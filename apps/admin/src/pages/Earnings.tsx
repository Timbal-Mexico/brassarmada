import DashboardLayout from "@/components/DashboardLayout";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

const monthlyData = [
  { month: "SEP", amount: 15200 },
  { month: "OCT", amount: 18000 },
  { month: "NOV", amount: 22000 },
  { month: "DEC", amount: 19500 },
  { month: "ENE", amount: 31000 },
  { month: "FEB", amount: 28400 },
];

const transactions = [
  { date: "Mar 14", event: "Neon Horizon Festival", amount: 12500, status: "paid" },
  { date: "Feb 28", event: "Studio Session - Album", amount: 3200, status: "paid" },
  { date: "Feb 15", event: "Private Corporate Event", amount: 8900, status: "paid" },
  { date: "Mar 18", event: "The Sapphire Lounge", amount: 4200, status: "pending" },
  { date: "Mar 22", event: "Underground Beat Gala", amount: 8900, status: "pending" },
];

const Earnings = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-display font-bold text-foreground mb-2">Ganancias</h1>
      <p className="text-muted-foreground mb-8">Resumen financiero y transacciones</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Este Mes", value: "$31,000", change: "+12.5%", up: true },
          { label: "Pendiente", value: "$13,100", change: "2 pagos", up: false },
          { label: "Total Anual", value: "$124,842", change: "+28%", up: true },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5">
            <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
            <p className="text-2xl font-display font-bold text-primary neon-text">{s.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {s.up ? <TrendingUp className="h-3 w-3 text-primary" /> : <DollarSign className="h-3 w-3 text-warning" />}
              <span className={`text-xs ${s.up ? "text-primary" : "text-warning"}`}>{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-6 mb-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Tendencia</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorEarn" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }} />
            <YAxis hide />
            <Tooltip contentStyle={{ background: 'hsl(240, 8%, 10%)', border: '1px solid hsl(240, 6%, 18%)', borderRadius: '8px', color: 'hsl(0, 0%, 95%)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Ganancias']} />
            <Area type="monotone" dataKey="amount" stroke="hsl(160, 100%, 50%)" strokeWidth={2} fill="url(#colorEarn)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-display font-semibold text-foreground mb-4">Transacciones</h3>
        <div className="space-y-3">
          {transactions.map((t) => (
            <div key={t.event + t.date} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{t.event}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                  t.status === "paid" ? "status-confirmed" : "status-action"
                }`}>
                  {t.status === "paid" ? "Pagado" : "Pendiente"}
                </span>
                <span className="text-sm font-semibold text-foreground">${t.amount.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;

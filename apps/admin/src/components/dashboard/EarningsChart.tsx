import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { TrendingUp } from "lucide-react";

const data = [
  { month: "OCT", amount: 18000 },
  { month: "NOV", amount: 22000 },
  { month: "DEC", amount: 19500 },
  { month: "ENE", amount: 31000 },
];

const EarningsChart = () => {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Total Ganancias</p>
          <p className="text-xs text-muted-foreground">Q4 Resumen de Rendimiento</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-display font-bold text-primary neon-text">$124,842.00</p>
          <div className="flex items-center gap-1 justify-end">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span className="text-xs text-primary">+12.5% este mes</span>
          </div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(160, 100%, 50%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(240, 5%, 55%)', fontSize: 12 }} />
          <YAxis hide />
          <Tooltip
            contentStyle={{
              background: 'hsl(240, 8%, 10%)',
              border: '1px solid hsl(240, 6%, 18%)',
              borderRadius: '8px',
              color: 'hsl(0, 0%, 95%)',
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Ganancias']}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(160, 100%, 50%)"
            strokeWidth={2}
            fill="url(#colorAmount)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;

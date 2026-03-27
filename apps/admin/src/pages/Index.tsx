import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/dashboard/StatsCards";
import EarningsChart from "@/components/dashboard/EarningsChart";
import UpcomingGigs from "@/components/dashboard/UpcomingGigs";
import ClientChat from "@/components/dashboard/ClientChat";
import BannerCTA from "@/components/dashboard/BannerCTA";
import { Circle } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-1">
            Centro de Comando del Artista
          </p>
          <h1 className="text-4xl font-display font-bold text-foreground">The Pulse</h1>
        </div>
        <div className="glass-card px-4 py-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estado en Vivo</p>
          <div className="flex items-center gap-2">
            <Circle className="h-2.5 w-2.5 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">De Gira</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          <EarningsChart />
          <UpcomingGigs />
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          <StatsCards />
          <ClientChat />
        </div>
      </div>

      <BannerCTA />
    </DashboardLayout>
  );
};

export default Index;

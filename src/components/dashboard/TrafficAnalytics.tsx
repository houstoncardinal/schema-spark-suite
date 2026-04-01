import { motion } from "framer-motion";
import { TrendingUp, Globe, MousePointer, Eye, MapPin } from "lucide-react";
import { MetricCard } from "@/components/charts/MetricCard";
import type { DashboardData } from "@/lib/dashboard-engine";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar, Legend } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--info))", "hsl(var(--chart-4))", "hsl(var(--destructive))", "hsl(var(--chart-5))", "hsl(var(--muted-foreground))"];

export function TrafficAnalytics({ data }: { data: DashboardData }) {
  const { trafficData, geoTraffic, project } = data;

  const totalTraffic = trafficData.reduce((s, d) => s + d.organic + d.paid + d.direct + d.referral + d.social, 0);
  const organicPct = Math.round(trafficData.reduce((s, d) => s + d.organic, 0) / totalTraffic * 100);

  const sourceData = [
    { name: "Organic", value: trafficData.reduce((s, d) => s + d.organic, 0) },
    { name: "Direct", value: trafficData.reduce((s, d) => s + d.direct, 0) },
    { name: "Referral", value: trafficData.reduce((s, d) => s + d.referral, 0) },
    { name: "Paid", value: trafficData.reduce((s, d) => s + d.paid, 0) },
    { name: "Social", value: trafficData.reduce((s, d) => s + d.social, 0) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={TrendingUp} label="Total Sessions" value={totalTraffic.toLocaleString()} change="+14.2%" changePositive subtitle="all sources" />
        <MetricCard icon={Globe} label="Organic Share" value={`${organicPct}%`} change="+3.1%" changePositive subtitle="of total traffic" />
        <MetricCard icon={MousePointer} label="Est. Clicks" value={data.estimatedClicks.toLocaleString()} change="+22%" changePositive subtitle="from search" />
        <MetricCard icon={Eye} label="Impressions" value={data.estimatedImpressions.toLocaleString()} change="+8.5%" changePositive subtitle="search visibility" />
      </div>

      {/* Traffic trend */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Traffic Trends</h3>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={trafficData}>
            <defs>
              <linearGradient id="tOrgGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tDirGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <Tooltip {...chartTooltipStyle} />
            <Legend />
            <Area type="monotone" dataKey="organic" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#tOrgGrad)" />
            <Area type="monotone" dataKey="direct" stroke="hsl(var(--success))" strokeWidth={1.5} fill="url(#tDirGrad)" />
            <Area type="monotone" dataKey="referral" stroke="hsl(var(--warning))" strokeWidth={1.5} fillOpacity={0} />
            <Area type="monotone" dataKey="paid" stroke="hsl(var(--chart-4))" strokeWidth={1.5} fillOpacity={0} />
            <Area type="monotone" dataKey="social" stroke="hsl(var(--info))" strokeWidth={1.5} fillOpacity={0} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Source breakdown */}
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3} stroke="none">
                {sourceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {sourceData.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i] }} />
                {s.name} ({Math.round(s.value / totalTraffic * 100)}%)
              </span>
            ))}
          </div>
        </div>

        {/* Geo distribution */}
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" /> Geographic Distribution
          </h3>
          <div className="space-y-3">
            {geoTraffic.map((geo, i) => (
              <motion.div key={geo.country} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3">
                <span className="text-sm text-foreground w-32 truncate">{geo.country}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${geo.percentage}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="h-full rounded-full bg-accent" />
                </div>
                <span className="text-xs data-cell text-muted-foreground w-16 text-right">{geo.sessions.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground w-10 text-right">{geo.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

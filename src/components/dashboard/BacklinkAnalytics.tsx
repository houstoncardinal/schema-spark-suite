import { motion } from "framer-motion";
import { Link2, Shield, AlertTriangle, ExternalLink } from "lucide-react";
import { MetricCard } from "@/components/charts/MetricCard";
import type { DashboardData } from "@/lib/dashboard-engine";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--info))", "hsl(var(--chart-4))", "hsl(var(--destructive))"];

export function BacklinkAnalytics({ data }: { data: DashboardData }) {
  const { backlinks } = data;

  const linkTypeData = [
    { name: "Dofollow", value: backlinks.dofollow },
    { name: "Nofollow", value: backlinks.nofollow },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Link2} label="Total Backlinks" value={backlinks.totalBacklinks.toLocaleString()} change="+12%" changePositive />
        <MetricCard icon={ExternalLink} label="Referring Domains" value={backlinks.referringDomains.toLocaleString()} change="+8" changePositive />
        <MetricCard icon={Shield} label="Trust Score" value={`${backlinks.trustScore}/100`} change="+3" changePositive />
        <MetricCard icon={AlertTriangle} label="Spam Score" value={`${backlinks.spamScore}%`} change="-2%" changePositive />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Growth chart */}
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Backlink Growth</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={backlinks.growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="links" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Links" />
              <Bar dataKey="domains" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Domains" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Link type + anchor text */}
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Anchor Text Distribution</h3>
          <div className="space-y-3">
            {backlinks.anchorDistribution.map((a, i) => (
              <motion.div key={a.anchor} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3">
                <span className="text-sm text-foreground w-28 truncate">{a.anchor}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${a.percentage}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                    className="h-full rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                </div>
                <span className="text-xs data-cell text-muted-foreground w-14 text-right">{a.percentage}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top referrers */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Top Referring Domains</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-medium text-xs">Domain</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs">Authority</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs">Links</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs">Type</th>
              </tr>
            </thead>
            <tbody>
              {backlinks.topReferrers.map((ref, i) => (
                <motion.tr key={ref.domain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                  <td className="py-3 font-medium text-foreground flex items-center gap-2">
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    {ref.domain}
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex h-7 px-2 items-center justify-center rounded-md text-xs font-bold ${
                      ref.authority >= 70 ? "bg-success/10 text-success" : ref.authority >= 40 ? "bg-accent/10 text-accent" : "bg-secondary text-foreground"
                    }`}>{ref.authority}</span>
                  </td>
                  <td className="py-3 text-center data-cell text-muted-foreground">{ref.links}</td>
                  <td className="py-3 text-center">
                    <span className={`text-[10px] font-semibold uppercase rounded-full px-2 py-0.5 ${
                      ref.type === "dofollow" ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"
                    }`}>{ref.type}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

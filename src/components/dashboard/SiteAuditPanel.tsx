import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle, AlertCircle, Info, CheckCircle, Filter } from "lucide-react";
import { MetricCard } from "@/components/charts/MetricCard";
import type { DashboardData } from "@/lib/dashboard-engine";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function SiteAuditPanel({ data }: { data: DashboardData }) {
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const { auditIssues } = data;

  const criticalCount = auditIssues.filter(i => i.severity === "critical").length;
  const warningCount = auditIssues.filter(i => i.severity === "warning").length;
  const noticeCount = auditIssues.filter(i => i.severity === "notice").length;

  const filtered = auditIssues.filter(i => filterSeverity === "all" || i.severity === filterSeverity)
    .sort((a, b) => a.fixPriority - b.fixPriority);

  const categoryData = [...new Set(auditIssues.map(i => i.category))].map(cat => ({
    category: cat,
    critical: auditIssues.filter(i => i.category === cat && i.severity === "critical").length,
    warning: auditIssues.filter(i => i.category === cat && i.severity === "warning").length,
    notice: auditIssues.filter(i => i.category === cat && i.severity === "notice").length,
  }));

  const pieData = [
    { name: "Critical", value: criticalCount, color: "hsl(var(--destructive))" },
    { name: "Warning", value: warningCount, color: "hsl(var(--warning))" },
    { name: "Notice", value: noticeCount, color: "hsl(var(--info))" },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Shield} label="Crawled Pages" value={data.crawledPages} subtitle="total pages found" />
        <MetricCard icon={CheckCircle} label="Indexed Pages" value={data.indexedPages} change={`${Math.round(data.indexedPages / data.crawledPages * 100)}%`} changePositive />
        <MetricCard icon={AlertTriangle} label="Critical Issues" value={criticalCount} subtitle="need immediate fix" />
        <MetricCard icon={AlertCircle} label="Total Issues" value={auditIssues.length} change={`-${Math.round(auditIssues.length * 0.15)}`} changePositive subtitle="vs last scan" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Issues by category */}
        <div className="lg:col-span-2 glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Issues by Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={categoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis type="category" dataKey="category" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} width={90} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="critical" stackId="a" fill="hsl(var(--destructive))" name="Critical" />
              <Bar dataKey="warning" stackId="a" fill="hsl(var(--warning))" name="Warning" />
              <Bar dataKey="notice" stackId="a" fill="hsl(var(--info))" name="Notice" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Severity pie */}
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Issue Severity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={4} stroke="none">
                {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip {...chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: d.color }} />{d.name} ({d.value})
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Issue list */}
      <div className="glass-card-float p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-semibold text-foreground">All Issues</h3>
          <div className="flex items-center gap-2">
            {["all", "critical", "warning", "notice"].map(s => (
              <button key={s} onClick={() => setFilterSeverity(s)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all capitalize ${
                  filterSeverity === s ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground bg-secondary/50"
                }`}>{s === "all" ? "All" : s}</button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((issue, i) => (
            <motion.div key={issue.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-start gap-3 rounded-xl border border-border/50 p-4 bg-background/50 hover:bg-secondary/30 transition-colors cursor-pointer">
              {issue.severity === "critical" && <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
              {issue.severity === "warning" && <AlertCircle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
              {issue.severity === "notice" && <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    issue.severity === "critical" ? "text-destructive" : issue.severity === "warning" ? "text-warning" : "text-info"
                  }`}>{issue.severity}</span>
                  <span className="text-[10px] text-muted-foreground">• {issue.category}</span>
                </div>
                <p className="text-sm font-medium text-foreground">{issue.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{issue.affectedPages} pages affected</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

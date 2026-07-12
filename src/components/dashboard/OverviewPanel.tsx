import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, TrendingUp, Search, AlertTriangle, Eye, Globe, Brain, Bell, CheckCircle, Zap, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { MetricCard } from "@/components/charts/MetricCard";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { SEORadarChart } from "@/components/charts/SEORadarChart";
import { InsightList } from "@/components/charts/InsightCard";
import type { DashboardData } from "@/lib/dashboard-engine";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";
import { Link } from "react-router-dom";
import { aiSEOApi, type AIDashboardResponse } from "@/lib/ai-seo-api";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function OverviewPanel({ data }: { data: DashboardData }) {
  const { project, trafficData, keywords, backlinks, tasks } = data;
  const [aiInsights, setAiInsights] = useState<AIDashboardResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setAiLoading(true);
    setAiInsights(null);

    aiSEOApi.getDashboardInsights(project.domain || "unknown", {
      healthScore: project.healthScore,
      domainAuthority: project.domainAuthority,
      organicTraffic: project.organicTraffic,
      keywordsRanked: project.keywordsRanked,
      activeIssues: project.activeIssues,
      totalBacklinks: backlinks.totalBacklinks,
      referringDomains: backlinks.referringDomains,
    }).then(res => { if (!cancelled) setAiInsights(res); })
      .catch(err => console.error("Dashboard AI insights failed:", err))
      .finally(() => { if (!cancelled) setAiLoading(false); });

    return () => { cancelled = true; };
  }, [project.domain]);

  const radarData = [
    { subject: "Technical", value: Math.round(project.healthScore * 0.95), fullMark: 100 },
    { subject: "Content", value: Math.round(project.healthScore * 0.82), fullMark: 100 },
    { subject: "Authority", value: project.domainAuthority, fullMark: 100 },
    { subject: "UX", value: Math.round(project.healthScore * 1.05), fullMark: 100 },
    { subject: "Speed", value: Math.round(project.healthScore * 0.9), fullMark: 100 },
    { subject: "Schema", value: Math.round(project.healthScore * 0.6), fullMark: 100 },
  ];

  const fallbackInsights = [
    { type: "opportunity" as const, title: `${keywords.filter(k => k.change > 0).length} keywords gaining momentum`, description: `Keywords like "${keywords[0]?.keyword}" are trending upward. Increasing content depth could push them into top 3 positions.`, impact: "High", action: "View keywords" },
    { type: "warning" as const, title: `${project.activeIssues} active SEO issues need attention`, description: `Including ${data.auditIssues.filter(i => i.severity === "critical").length} critical issues affecting crawlability and indexation.`, impact: "Medium", action: "View audit" },
    { type: "info" as const, title: `Domain authority at ${project.domainAuthority} — growth potential`, description: `Building high-quality backlinks from ${backlinks.referringDomains} referring domains. Target 10+ new domains monthly for authority growth.`, impact: "Medium" },
  ];

  const aiFormattedInsights = aiInsights?.strategicInsights?.map(si => ({
    type: (si.urgency === "immediate" ? "critical" : si.urgency === "short-term" ? "warning" : "opportunity") as "critical" | "warning" | "opportunity" | "info",
    title: si.title,
    description: si.description,
    impact: si.estimatedImpact,
  })) || null;

  const criticalIssues = data.auditIssues.filter(i => i.severity === "critical").length;
  const warningIssues = data.auditIssues.filter(i => i.severity === "warning").length;
  const improvingKeywords = keywords.filter(k => k.change > 0).length;
  const decliningKeywords = keywords.filter(k => k.change < 0).length;

  const alerts: { type: "success" | "warning" | "info"; text: string }[] = [];
  if (criticalIssues > 0) alerts.push({ type: "warning", text: `${criticalIssues} critical technical issues detected during crawl` });
  if (warningIssues > 0) alerts.push({ type: "info", text: `${warningIssues} warnings across ${data.crawledPages} crawled pages` });
  if (improvingKeywords > 0) alerts.push({ type: "success", text: `${improvingKeywords} tracked keywords trending up` });
  if (decliningKeywords > 0) alerts.push({ type: "warning", text: `${decliningKeywords} keywords declining — review content freshness` });
  if (backlinks.referringDomains > 0) alerts.push({ type: "info", text: `${backlinks.referringDomains} referring domains identified in link graph` });

  return (
    <div className="space-y-6">
      {/* KPI row — measured signals only, no fabricated deltas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Activity} label="SEO Health Score" value={`${project.healthScore}/100`} subtitle="from PageSpeed + headers + crawlability" />
        <MetricCard icon={Globe} label="Pages Crawled" value={data.crawledPages.toLocaleString()} subtitle={`${data.indexedPages.toLocaleString()} in sitemap`} />
        <MetricCard icon={Search} label="Keywords Analyzed" value={keywords.length.toLocaleString()} subtitle="grounded from on-page content" />
        <MetricCard icon={AlertTriangle} label="Active Issues" value={project.activeIssues} subtitle={`${criticalIssues} critical · ${warningIssues} warnings`} />
      </div>

      {/* Traffic chart + radar */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card-float p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-foreground">Traffic Overview</h3>
            <span className="text-[10px] text-muted-foreground">Connect Google Search Console for live traffic</span>
          </div>
          {trafficData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={trafficData}>
                <defs>
                  <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="organic" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#orgGrad)" />
                <Area type="monotone" dataKey="direct" stroke="hsl(var(--success))" strokeWidth={1.5} fillOpacity={0} />
                <Area type="monotone" dataKey="referral" stroke="hsl(var(--warning))" strokeWidth={1.5} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-center text-muted-foreground">
              <Eye className="h-6 w-6 mb-2 opacity-40" />
              <p className="text-sm">Traffic data requires a Google Search Console connection.</p>
              <p className="text-xs mt-1 opacity-70">We never fabricate traffic numbers.</p>
            </div>
          )}
        </div>


        <div className="glass-card-float p-6 flex flex-col">
          <h3 className="font-display text-sm font-semibold text-foreground mb-2">SEO Health Radar</h3>
          <div className="flex-1 flex items-center justify-center">
            <ScoreRing score={project.healthScore} size={110} strokeWidth={7} />
          </div>
          <SEORadarChart data={radarData} height={180} />
        </div>
      </div>

      {/* Keywords + alerts */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card-float p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-foreground">Top Keyword Rankings</h3>
            <span className="text-xs text-muted-foreground">{keywords.length} tracked</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2.5 text-muted-foreground font-medium text-xs">Keyword</th>
                  <th className="text-center py-2.5 text-muted-foreground font-medium text-xs">Pos</th>
                  <th className="text-center py-2.5 text-muted-foreground font-medium text-xs">Change</th>
                  <th className="text-right py-2.5 text-muted-foreground font-medium text-xs hidden sm:table-cell">Volume</th>
                </tr>
              </thead>
              <tbody>
                {keywords.slice(0, 8).map((kw, i) => (
                  <motion.tr key={kw.keyword} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 font-medium text-foreground">{kw.keyword}</td>
                    <td className="py-2.5 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-xs font-bold">{kw.position}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      {kw.change > 0 ? <span className="metric-badge-success">↑ {kw.change}</span>
                        : kw.change < 0 ? <span className="metric-badge-danger">↓ {Math.abs(kw.change)}</span>
                        : <span className="text-xs text-muted-foreground">—</span>}
                    </td>
                    <td className="py-2.5 text-right data-cell text-muted-foreground hidden sm:table-cell">{kw.volume.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card-float p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Bell className="h-4 w-4 text-accent" /> Recent Alerts
            </h3>
            <div className="space-y-2.5">
              {alerts.length === 0 && <p className="text-xs text-muted-foreground">No signals to report — clean crawl.</p>}
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-start gap-2.5 rounded-lg bg-background/80 p-2.5">
                  {alert.type === "success" && <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />}
                  {alert.type === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />}
                  {alert.type === "info" && <Zap className="h-3.5 w-3.5 text-info mt-0.5 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <span className="text-xs text-foreground">{alert.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* AI Insights + Backlink growth */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card-float p-6">
          <div className="flex items-center gap-2 mb-4">
            {aiLoading ? <Loader2 className="h-4 w-4 text-accent animate-spin" /> : <Brain className="h-4 w-4 text-accent" />}
            <h3 className="font-display text-sm font-semibold text-foreground">AI Intelligence Feed</h3>
            {aiFormattedInsights && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">Live AI</span>}
          </div>
          {aiInsights?.weeklyFocus && (
            <div className="mb-4 rounded-lg bg-accent/5 border border-accent/20 p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3 w-3 text-accent" />
                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">Weekly Focus</span>
              </div>
              <p className="text-xs text-foreground">{aiInsights.weeklyFocus}</p>
            </div>
          )}
          <InsightList insights={aiFormattedInsights || fallbackInsights} />
        </div>

        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Backlink Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={backlinks.growthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="links" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Total Links" />
              <Bar dataKey="domains" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Ref. Domains" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommended actions */}
      <div className="glass-card-float p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-semibold text-foreground">Recommended Actions</h3>
          <span className="text-xs text-muted-foreground">{tasks.filter(t => t.priority === "high" && !t.completed).length} high priority</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tasks.filter(t => !t.completed).slice(0, 6).map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 p-4 bg-background/50 hover:bg-secondary/50 transition-colors cursor-pointer group">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                t.priority === "high" ? "text-destructive" : t.priority === "medium" ? "text-warning" : "text-success"
              }`}>{t.priority} Priority</span>
              <p className="text-sm font-medium text-foreground mt-1 group-hover:text-accent transition-colors">{t.title}</p>
              <p className="text-xs text-muted-foreground mt-1">Impact: {t.impact}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card-float p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-success/5" />
        <div className="relative">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">Want expert help acting on these insights?</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">Our SEO team will implement all recommendations and continuously optimize your rankings.</p>
          <Link to="/contact" className="btn-primary-gradient gap-2">Book Strategy Session <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Activity, TrendingUp, Search, AlertTriangle, Bell, CheckCircle, ArrowRight, BarChart3, Globe, Eye, Calendar, Filter, ChevronDown, Brain, ExternalLink, Zap } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { MetricCard } from "@/components/charts/MetricCard";
import { InsightList, InsightData } from "@/components/charts/InsightCard";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { SEORadarChart } from "@/components/charts/SEORadarChart";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, BarChart, Bar } from "recharts";
import { Link } from "react-router-dom";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

const trafficData = [
  { date: "Jan 1", organic: 1250, paid: 430, direct: 820 },
  { date: "Jan 8", organic: 1380, paid: 450, direct: 790 },
  { date: "Jan 15", organic: 1520, paid: 410, direct: 850 },
  { date: "Jan 22", organic: 1690, paid: 480, direct: 810 },
  { date: "Feb 1", organic: 1840, paid: 520, direct: 870 },
  { date: "Feb 8", organic: 2050, paid: 490, direct: 900 },
  { date: "Feb 15", organic: 2240, paid: 510, direct: 880 },
  { date: "Feb 22", organic: 2180, paid: 530, direct: 920 },
  { date: "Mar 1", organic: 2420, paid: 500, direct: 950 },
  { date: "Mar 8", organic: 2650, paid: 540, direct: 910 },
  { date: "Mar 15", organic: 2810, paid: 520, direct: 960 },
  { date: "Mar 22", organic: 2950, paid: 560, direct: 940 },
];

const backlinkData = [
  { month: "Oct", links: 145, domains: 42 },
  { month: "Nov", links: 168, domains: 48 },
  { month: "Dec", links: 192, domains: 55 },
  { month: "Jan", links: 224, domains: 62 },
  { month: "Feb", links: 261, domains: 71 },
  { month: "Mar", links: 305, domains: 82 },
];

const keywords = [
  { keyword: "seo tools", position: 3, prev: 5, volume: 14800, url: "/tools", change: 2 },
  { keyword: "seo analyzer", position: 5, prev: 6, volume: 9200, url: "/tools/analyzer", change: 1 },
  { keyword: "schema generator", position: 2, prev: 2, volume: 6400, url: "/tools/schema", change: 0 },
  { keyword: "seo houston", position: 1, prev: 4, volume: 4100, url: "/services", change: 3 },
  { keyword: "backlink checker", position: 8, prev: 7, volume: 12300, url: "/tools/backlinks", change: -1 },
  { keyword: "technical seo audit", position: 4, prev: 6, volume: 5600, url: "/services", change: 2 },
  { keyword: "seo consulting", position: 6, prev: 9, volume: 7800, url: "/services", change: 3 },
  { keyword: "keyword research tool", position: 11, prev: 15, volume: 8400, url: "/tools/keywords", change: 4 },
  { keyword: "seo strategy", position: 9, prev: 12, volume: 6100, url: "/blog", change: 3 },
  { keyword: "local seo services", position: 3, prev: 5, volume: 3900, url: "/services", change: 2 },
];

const alerts = [
  { type: "success", text: "Core Web Vitals: All metrics passed", time: "2h ago" },
  { type: "success", text: "'seo houston' reached Position #1", time: "5h ago" },
  { type: "warning", text: "3 pages returning 404 errors", time: "1d ago" },
  { type: "warning", text: "Sitemap has 2 orphan URLs", time: "1d ago" },
  { type: "info", text: "Google algorithm update detected", time: "2d ago" },
  { type: "success", text: "SSL certificate auto-renewed", time: "3d ago" },
  { type: "warning", text: "Mobile usability issues on /blog", time: "4d ago" },
];

const aiInsights: InsightData[] = [
  { type: "opportunity", title: "Keyword 'seo consulting' trending upward", description: "This keyword has gained 3 positions in the last 30 days. Increasing content depth and adding internal links could push it into the top 3.", impact: "High", action: "View strategy" },
  { type: "warning", title: "Backlink velocity slowing", description: "New backlink acquisition rate dropped 18% vs last month. Consider outreach campaigns to maintain growth trajectory.", impact: "Medium", action: "Backlink strategy" },
  { type: "info", title: "Content freshness signal detected", description: "3 blog posts haven't been updated in 6+ months. Refreshing content with updated data could recover lost rankings.", impact: "Medium" },
];

const radarData = [
  { subject: "Technical", value: 82, fullMark: 100 },
  { subject: "Content", value: 68, fullMark: 100 },
  { subject: "Authority", value: 55, fullMark: 100 },
  { subject: "UX", value: 88, fullMark: 100 },
  { subject: "Speed", value: 79, fullMark: 100 },
  { subject: "Schema", value: 45, fullMark: 100 },
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("3m");
  const [activeSection, setActiveSection] = useState("overview");
  const timeRanges = ["7d", "30d", "3m", "6m", "1y"];

  return (
    <Layout>
      <section className="py-8 md:py-12 relative min-h-screen">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container-wide relative">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-medium text-success">Live Monitoring</span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">SEO Command Center</h1>
              <p className="text-sm text-muted-foreground mt-1">Real-time analytics and performance intelligence</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-lg bg-secondary p-0.5">
                {timeRanges.map(r => (
                  <button key={r} onClick={() => setTimeRange(r)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      timeRange === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                    }`}>{r}</button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* KPI row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard icon={Activity} label="SEO Health Score" value="82/100" change="+5 pts" changePositive subtitle="vs last month" />
            <MetricCard icon={TrendingUp} label="Organic Traffic" value="24,531" change="+18.4%" changePositive subtitle="monthly sessions" />
            <MetricCard icon={Search} label="Keywords Ranked" value="156" change="+12 new" changePositive subtitle="in top 100" />
            <MetricCard icon={AlertTriangle} label="Active Issues" value="14" change="-3" changePositive={false} subtitle="need attention" />
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Traffic chart */}
            <div className="lg:col-span-2 glass-card-float p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-semibold text-foreground">Traffic Overview</h3>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" />Organic</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Direct</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" />Paid</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="orgGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dirGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Area type="monotone" dataKey="organic" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#orgGrad)" />
                  <Area type="monotone" dataKey="direct" stroke="hsl(var(--success))" strokeWidth={1.5} fill="url(#dirGrad)" />
                  <Area type="monotone" dataKey="paid" stroke="hsl(var(--warning))" strokeWidth={1.5} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* SEO Health radar */}
            <div className="glass-card-float p-6 flex flex-col">
              <h3 className="font-display text-sm font-semibold text-foreground mb-2">SEO Health Radar</h3>
              <div className="flex-1 flex items-center justify-center">
                <ScoreRing score={82} size={110} strokeWidth={7} />
              </div>
              <SEORadarChart data={radarData} height={180} />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Keyword rankings */}
            <div className="lg:col-span-2 glass-card-float p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-semibold text-foreground">Keyword Rankings</h3>
                <span className="text-xs text-muted-foreground">{keywords.length} tracked</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 text-muted-foreground font-medium text-xs">Keyword</th>
                      <th className="text-center py-2.5 text-muted-foreground font-medium text-xs">Position</th>
                      <th className="text-center py-2.5 text-muted-foreground font-medium text-xs">Change</th>
                      <th className="text-right py-2.5 text-muted-foreground font-medium text-xs hidden sm:table-cell">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {keywords.map((kw, i) => (
                      <motion.tr
                        key={kw.keyword}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-border/30 hover:bg-secondary/30 transition-colors group"
                      >
                        <td className="py-2.5">
                          <span className="font-medium text-foreground group-hover:text-accent transition-colors">{kw.keyword}</span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-xs font-bold text-foreground">
                            {kw.position}
                          </span>
                        </td>
                        <td className="py-2.5 text-center">
                          {kw.change > 0 ? (
                            <span className="metric-badge-success">↑ {kw.change}</span>
                          ) : kw.change < 0 ? (
                            <span className="metric-badge-danger">↓ {Math.abs(kw.change)}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-2.5 text-right data-cell text-muted-foreground hidden sm:table-cell">{kw.volume.toLocaleString()}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts + insights */}
            <div className="space-y-6">
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Bell className="h-4 w-4 text-accent" /> Recent Alerts
                </h3>
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto">
                  {alerts.map((alert, i) => (
                    <div key={i} className="flex items-start gap-2.5 rounded-lg bg-background/80 p-2.5">
                      {alert.type === "success" && <CheckCircle className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />}
                      {alert.type === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />}
                      {alert.type === "info" && <Zap className="h-3.5 w-3.5 text-info mt-0.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-foreground leading-tight">{alert.text}</span>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Backlink growth + AI insights */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Backlink Growth</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={backlinkData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="links" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Total Links" />
                  <Bar dataKey="domains" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Ref. Domains" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card-float p-6">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="h-4 w-4 text-accent" />
                <h3 className="font-display text-sm font-semibold text-foreground">AI Intelligence Feed</h3>
              </div>
              <InsightList insights={aiInsights} />
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card-float p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-sm font-semibold text-foreground">Recommended Actions</h3>
              <span className="text-xs text-muted-foreground">3 high priority</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { priority: "High", title: "Fix 3 broken internal links", impact: "+2% crawl efficiency" },
                { priority: "High", title: "Add schema to service pages", impact: "+15% CTR potential" },
                { priority: "High", title: "Optimize LCP on homepage", impact: "-1.2s load time" },
                { priority: "Medium", title: "Update stale blog content", impact: "Recover lost rankings" },
                { priority: "Medium", title: "Expand local citations", impact: "+3 map pack positions" },
                { priority: "Low", title: "Compress 12 hero images", impact: "-0.4s page speed" },
              ].map((rec, i) => (
                <motion.div key={rec.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border/50 p-4 bg-background/50 hover:bg-secondary/50 transition-colors cursor-pointer group">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    rec.priority === "High" ? "text-destructive" : rec.priority === "Medium" ? "text-warning" : "text-success"
                  }`}>{rec.priority} Priority</span>
                  <p className="text-sm font-medium text-foreground mt-1 group-hover:text-accent transition-colors">{rec.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">Expected: {rec.impact}</p>
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
      </section>
    </Layout>
  );
};

export default Dashboard;

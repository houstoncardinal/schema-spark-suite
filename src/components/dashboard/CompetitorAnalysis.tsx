import { motion } from "framer-motion";
import { Users, TrendingUp, Search, Link2, Target } from "lucide-react";
import type { DashboardData } from "@/lib/dashboard-engine";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function CompetitorAnalysis({ data }: { data: DashboardData }) {
  const { competitors, project } = data;

  const comparisonData = competitors.map(c => ({
    domain: c.domain.split(".")[0],
    authority: c.authority,
    traffic: Math.round(c.traffic / 1000),
    keywords: c.keywords,
    backlinks: Math.round(c.backlinks / 100),
  }));
  comparisonData.unshift({
    domain: project.name,
    authority: project.domainAuthority,
    traffic: Math.round(project.organicTraffic / 1000),
    keywords: project.keywordsRanked,
    backlinks: Math.round(project.totalBacklinks / 100),
  });

  const radarData = [
    { metric: "Authority", ...Object.fromEntries(comparisonData.slice(0, 4).map(c => [c.domain, c.authority])) },
    { metric: "Traffic (K)", ...Object.fromEntries(comparisonData.slice(0, 4).map(c => [c.domain, c.traffic])) },
    { metric: "Keywords", ...Object.fromEntries(comparisonData.slice(0, 4).map(c => [c.domain, Math.min(c.keywords, 500)])) },
    { metric: "Backlinks", ...Object.fromEntries(comparisonData.slice(0, 4).map(c => [c.domain, Math.min(c.backlinks, 500)])) },
  ];

  const radarDomains = comparisonData.slice(0, 4).map(c => c.domain);
  const radarColors = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--chart-4))"];

  return (
    <div className="space-y-6">
      {/* Competitor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.map((comp, i) => (
          <motion.div key={comp.domain} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card-float p-5 hover:border-accent/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center">
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{comp.domain}</p>
                <p className="text-[10px] text-muted-foreground">DA: {comp.authority}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><p className="text-[10px] text-muted-foreground">Traffic</p><p className="text-sm font-bold text-foreground">{comp.traffic.toLocaleString()}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Keywords</p><p className="text-sm font-bold text-foreground">{comp.keywords.toLocaleString()}</p></div>
              <div><p className="text-[10px] text-muted-foreground">Backlinks</p><p className="text-sm font-bold text-foreground">{comp.backlinks.toLocaleString()}</p></div>
              <div>
                <p className="text-[10px] text-muted-foreground">Gap Keywords</p>
                <p className="text-sm font-bold text-accent">{comp.gapKeywords.toLocaleString()}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Authority comparison */}
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Authority Comparison</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="domain" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip {...chartTooltipStyle} />
              <Bar dataKey="authority" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Domain Authority" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar comparison */}
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Competitive Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
              {radarDomains.map((domain, i) => (
                <Radar key={domain} name={domain} dataKey={domain} stroke={radarColors[i]} fill={radarColors[i]} fillOpacity={i === 0 ? 0.15 : 0.05} strokeWidth={i === 0 ? 2.5 : 1.5} />
              ))}
              <Legend />
              <Tooltip {...chartTooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Keyword gap */}
      <div className="glass-card-float p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-accent" />
          <h3 className="font-display text-sm font-semibold text-foreground">Keyword Gap Analysis</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Keywords your competitors rank for that you don't — representing growth opportunities.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {competitors.slice(0, 3).map((comp, i) => (
            <motion.div key={comp.domain} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-border/50 p-4 bg-background/50">
              <p className="text-xs text-muted-foreground">{comp.domain}</p>
              <p className="font-display text-2xl font-bold text-accent mt-1">{comp.gapKeywords}</p>
              <p className="text-[10px] text-muted-foreground mt-1">keywords you're missing</p>
              <p className="text-xs text-success font-semibold mt-2">{comp.commonKeywords} shared keywords</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

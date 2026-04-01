import { motion } from "framer-motion";
import { Network, TrendingUp, AlertTriangle } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import type { PredictiveData, TopicCluster } from "@/lib/predictive-engine";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Treemap } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

const sentimentColors: Record<string, string> = {
  strong: "border-success bg-success/5",
  moderate: "border-accent bg-accent/5",
  weak: "border-warning bg-warning/5",
  missing: "border-destructive bg-destructive/5",
};

const sentimentDot: Record<string, string> = {
  strong: "bg-success",
  moderate: "bg-accent",
  weak: "bg-warning",
  missing: "bg-destructive",
};

function CustomTreemapContent(props: any) {
  const { x, y, width, height, name, authority } = props;
  if (width < 40 || height < 30) return null;
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} rx={6}
        fill={authority > 65 ? "hsl(var(--success))" : authority > 40 ? "hsl(var(--accent))" : "hsl(var(--warning))"}
        fillOpacity={0.15 + authority / 300}
        stroke="hsl(var(--border))" strokeWidth={1} />
      <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="hsl(var(--foreground))" fontSize={width > 80 ? 11 : 9} fontWeight={600}>
        {name?.length > 15 ? name.slice(0, 14) + "…" : name}
      </text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize={9}>
        {authority}%
      </text>
    </g>
  );
}

export function TopicalAuthorityPanel({ data }: { data: PredictiveData }) {
  const { topicalAuthority } = data;

  const treemapData = topicalAuthority.clusters.map(c => ({
    name: c.name,
    value: c.authority * c.keywords,
    authority: c.authority,
  }));

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="glass-card-float p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-success/5" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-5">
            <ScoreRing score={topicalAuthority.overall} size={100} strokeWidth={7} />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Network className="h-4 w-4 text-accent" />
                <span className="text-xs font-bold uppercase tracking-wider text-accent">Topical Authority</span>
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{topicalAuthority.overall}/100</p>
              <p className="text-sm text-muted-foreground">{topicalAuthority.coveragePercentage}% topic coverage</p>
            </div>
          </div>
          {topicalAuthority.missingTopics.length > 0 && (
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                <span className="text-xs font-semibold text-warning">Missing/Weak Topics</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {topicalAuthority.missingTopics.map(t => (
                  <span key={t} className="rounded-full bg-warning/10 text-warning px-2.5 py-0.5 text-[10px] font-medium">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Treemap visualization */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Topic Authority Map</h3>
        <ResponsiveContainer width="100%" height={320}>
          <Treemap data={treemapData} dataKey="value" aspectRatio={4 / 3}
            content={<CustomTreemapContent />} />
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-3">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-success" />Strong (65+)</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-accent" />Moderate (40-65)</span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="h-2 w-2 rounded-full bg-warning" />Weak (&lt;40)</span>
        </div>
      </div>

      {/* Authority trend */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Authority Growth Trend</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={topicalAuthority.authorityTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} domain={[0, 100]} />
            <Tooltip {...chartTooltipStyle} />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cluster details */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Topic Cluster Details</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {topicalAuthority.clusters.map((cluster, i) => (
            <motion.div key={cluster.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-xl border p-4 transition-colors ${sentimentColors[cluster.sentiment]}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-foreground">{cluster.name}</span>
                <span className={`h-2 w-2 rounded-full ${sentimentDot[cluster.sentiment]}`} />
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div><p className="text-lg font-bold text-foreground">{cluster.authority}</p><p className="text-[9px] text-muted-foreground">Authority</p></div>
                <div><p className="text-lg font-bold text-foreground">{cluster.keywords}</p><p className="text-[9px] text-muted-foreground">Keywords</p></div>
                <div><p className="text-lg font-bold text-foreground">{cluster.contentPieces}</p><p className="text-[9px] text-muted-foreground">Content</p></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${cluster.coverage > 65 ? "bg-success" : cluster.coverage > 35 ? "bg-accent" : "bg-warning"}`}
                    style={{ width: `${cluster.coverage}%` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{cluster.coverage}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

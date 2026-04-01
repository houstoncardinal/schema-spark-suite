import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown, Minus, TrendingUp, Search, Filter, Eye } from "lucide-react";
import type { DashboardData, KeywordTracking } from "@/lib/dashboard-engine";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function KeywordTracker({ data }: { data: DashboardData }) {
  const [sortBy, setSortBy] = useState<"position" | "change" | "volume">("position");
  const [filterIntent, setFilterIntent] = useState<string>("all");
  const [selectedKeyword, setSelectedKeyword] = useState<KeywordTracking | null>(null);

  const intents = ["all", ...new Set(data.keywords.map(k => k.intent))];
  const filtered = data.keywords
    .filter(k => filterIntent === "all" || k.intent === filterIntent)
    .sort((a, b) => sortBy === "position" ? a.position - b.position : sortBy === "change" ? b.change - a.change : b.volume - a.volume);

  const improvingCount = data.keywords.filter(k => k.change > 0).length;
  const decliningCount = data.keywords.filter(k => k.change < 0).length;
  const top10Count = data.keywords.filter(k => k.position <= 10).length;

  return (
    <div className="space-y-6">
      {/* KPI summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Tracked", value: data.keywords.length, icon: Search },
          { label: "Top 10 Rankings", value: top10Count, icon: TrendingUp },
          { label: "Improving", value: improvingCount, icon: ArrowUp, color: "text-success" },
          { label: "Declining", value: decliningCount, icon: ArrowDown, color: "text-destructive" },
        ].map((m, i) => (
          <motion.div key={m.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass-card-float p-5">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`h-4 w-4 ${m.color || "text-accent"}`} />
              <span className="text-xs text-muted-foreground">{m.label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Trend chart for selected keyword */}
      {selectedKeyword && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card-float p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-sm font-semibold text-foreground">
              Position History: <span className="text-accent">{selectedKeyword.keyword}</span>
            </h3>
            <button onClick={() => setSelectedKeyword(null)} className="text-xs text-muted-foreground hover:text-foreground">Close</button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={selectedKeyword.trend.map((v, i) => ({ day: `Day ${(i + 1) * 5}`, position: v }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <YAxis reversed tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip {...chartTooltipStyle} />
              <Line type="monotone" dataKey="position" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Filters & table */}
      <div className="glass-card-float p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display text-sm font-semibold text-foreground">Keyword Rankings</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg bg-secondary p-0.5 text-xs">
              {(["position", "change", "volume"] as const).map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className={`rounded-md px-3 py-1.5 font-medium transition-all capitalize ${
                    sortBy === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}>{s}</button>
              ))}
            </div>
            <select value={filterIntent} onChange={e => setFilterIntent(e.target.value)}
              className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground border-0 focus:ring-1 focus:ring-accent">
              {intents.map(i => <option key={i} value={i}>{i === "all" ? "All Intents" : i}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-medium text-xs">Keyword</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs">Position</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs">Change</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs hidden md:table-cell">Difficulty</th>
                <th className="text-right py-3 text-muted-foreground font-medium text-xs">Volume</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs hidden lg:table-cell">Intent</th>
                <th className="text-right py-3 text-muted-foreground font-medium text-xs hidden lg:table-cell">CPC</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((kw, i) => (
                <motion.tr key={kw.keyword} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                  onClick={() => setSelectedKeyword(kw)}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer group">
                  <td className="py-3">
                    <span className="font-medium text-foreground group-hover:text-accent transition-colors">{kw.keyword}</span>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{kw.url}</p>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-xs font-bold ${
                      kw.position <= 3 ? "bg-success/10 text-success" : kw.position <= 10 ? "bg-accent/10 text-accent" : "bg-secondary text-foreground"
                    }`}>{kw.position}</span>
                  </td>
                  <td className="py-3 text-center">
                    {kw.change > 0 ? <span className="metric-badge-success">↑ {kw.change}</span>
                      : kw.change < 0 ? <span className="metric-badge-danger">↓ {Math.abs(kw.change)}</span>
                      : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="py-3 text-center hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full rounded-full ${kw.difficulty > 70 ? "bg-destructive" : kw.difficulty > 40 ? "bg-warning" : "bg-success"}`}
                          style={{ width: `${kw.difficulty}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{kw.difficulty}</span>
                    </div>
                  </td>
                  <td className="py-3 text-right data-cell text-muted-foreground">{kw.volume.toLocaleString()}</td>
                  <td className="py-3 text-center hidden lg:table-cell">
                    <span className="text-[10px] font-medium text-muted-foreground rounded-full bg-secondary px-2 py-0.5">{kw.intent}</span>
                  </td>
                  <td className="py-3 text-right data-cell text-muted-foreground hidden lg:table-cell">${kw.cpc}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

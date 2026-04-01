import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { researchKeyword } from "@/lib/keyword-engine";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function KeywordResearchTool() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof researchKeyword> | null>(null);

  const search = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults(researchKeyword(keyword));
    }, 2000);
  };

  const diffColor = (d: number) => d >= 70 ? "text-destructive bg-destructive/10" : d >= 40 ? "text-warning bg-warning/10" : "text-success bg-success/10";

  return (
    <div>
      <div className="glass-card-float p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3.5">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Enter a keyword to research..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={search} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-8 py-3.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Research <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-float p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="font-medium text-foreground">Analyzing keyword data...</p>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Search Volume", value: results.main.volume.toLocaleString(), sub: "/month" },
              { label: "Difficulty", value: `${results.main.difficulty}/100`, sub: results.main.difficulty >= 70 ? "Hard" : results.main.difficulty >= 40 ? "Moderate" : "Easy" },
              { label: "CPC", value: `$${results.main.cpc}`, sub: "avg bid" },
              { label: "Intent", value: results.main.intent, sub: "search type" },
            ].map((m) => (
              <div key={m.label} className="glass-card-float p-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card-float p-4 text-center">
              <p className="font-display text-xl font-bold text-foreground">{results.totalOpportunityVolume.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Opportunity Volume</p>
            </div>
            <div className="glass-card-float p-4 text-center">
              <p className="font-display text-xl font-bold text-foreground">{results.avgDifficulty}</p>
              <p className="text-xs text-muted-foreground">Avg. Difficulty</p>
            </div>
            <div className="glass-card-float p-4 text-center">
              <p className="font-display text-xl font-bold text-success">{results.lowCompetitionCount}</p>
              <p className="text-xs text-muted-foreground">Low Competition</p>
            </div>
          </div>

          <div className="glass-card-float p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Search Volume Trend (12 months)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={results.trendData}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="volume" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#volGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card-float p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Related Keywords ({results.suggestions.length})</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-muted-foreground font-medium">Keyword</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Volume</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">KD</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">CPC</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Intent</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {results.suggestions.map((s) => (
                    <tr key={s.keyword} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 font-medium text-foreground">{s.keyword}</td>
                      <td className="py-3 text-right data-cell text-foreground">{s.volume.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${diffColor(s.difficulty)}`}>{s.difficulty}</span>
                      </td>
                      <td className="py-3 text-right data-cell text-foreground">${s.cpc}</td>
                      <td className="py-3 text-right text-xs text-muted-foreground">{s.intent}</td>
                      <td className="py-3 text-right">
                        {s.trend === "up" ? <TrendingUp className="h-4 w-4 text-success ml-auto" /> : s.trend === "down" ? <TrendingDown className="h-4 w-4 text-destructive ml-auto" /> : <Minus className="h-4 w-4 text-muted-foreground ml-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

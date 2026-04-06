import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Loader2, ArrowRight, Sparkles, Target, Users, TrendingUp, ExternalLink } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { InsightList } from "@/components/charts/InsightCard";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { aiSEOApi, type AIMarketResponse } from "@/lib/ai-seo-api";
import { firecrawlApi } from "@/lib/firecrawl-api";
import { toast } from "sonner";

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--chart-4))", "hsl(var(--info))"];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function EnvironmentalAnalysis() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIMarketResponse | null>(null);

  const analyze = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setResults(null);

    try {
      // Try to get real search results for this niche via Firecrawl search
      let searchResults = null;
      try {
        const searchResponse = await firecrawlApi.scrape(niche);
        if (searchResponse.success) {
          searchResults = searchResponse.data;
        }
      } catch {
        // Search is optional, continue with AI analysis
      }

      // AI market analysis with real competitive intelligence
      const aiResponse = await aiSEOApi.analyzeMarketReal(niche, searchResults);
      setResults(aiResponse);
      toast.success("Real market analysis complete");
    } catch (err) {
      console.error("Market analysis failed:", err);
      toast.error("Analysis failed", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="glass-card-float p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3.5">
            <Target className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={niche} onChange={(e) => setNiche(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Enter your niche or industry (e.g., 'dental SEO Houston')..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={analyze} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-8 py-3.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-4 w-4" /> Analyze Market</>}
          </button>
        </div>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-float p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="font-medium text-foreground">AI analyzing competitive landscape...</p>
          <p className="text-sm text-muted-foreground mt-1">Scanning SERP data, competitor profiles, and market signals</p>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Scores */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.marketDifficulty} size={80} strokeWidth={5} />
              <p className="text-xs font-semibold text-foreground mt-2">Market Difficulty</p>
            </div>
            <div className="glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.opportunityScore} size={80} strokeWidth={5} />
              <p className="text-xs font-semibold text-foreground mt-2">Opportunity Score</p>
            </div>
            <div className="glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.serpVolatility} size={80} strokeWidth={5} />
              <p className="text-xs font-semibold text-foreground mt-2">SERP Volatility</p>
            </div>
            <div className="glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.competitorDensity} size={80} strokeWidth={5} />
              <p className="text-xs font-semibold text-foreground mt-2">Competitor Density</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {results.scatter?.length > 0 && (
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">Opportunity vs Difficulty</h3>
                <p className="text-xs text-muted-foreground mb-4">Keywords plotted by competition level and growth potential</p>
                <ResponsiveContainer width="100%" height={280}>
                  <ScatterChart>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis type="number" dataKey="difficulty" name="Difficulty" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} label={{ value: "Difficulty →", position: "bottom", offset: -5, style: { fill: "hsl(var(--muted-foreground))", fontSize: 10 } }} />
                    <YAxis type="number" dataKey="opportunity" name="Opportunity" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} label={{ value: "Opportunity →", angle: -90, position: "insideLeft", offset: 15, style: { fill: "hsl(var(--muted-foreground))", fontSize: 10 } }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} {...chartTooltipStyle} formatter={(value: number, name: string) => [value, name]} />
                    <Scatter data={results.scatter} fill="hsl(var(--accent))" fillOpacity={0.7} />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            )}

            {results.marketShare?.length > 0 && (
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">Market Share Distribution</h3>
                <p className="text-xs text-muted-foreground mb-4">Organic traffic distribution among competitors</p>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={results.marketShare} cx="50%" cy="50%" outerRadius={100} innerRadius={60} dataKey="value" paddingAngle={3} strokeWidth={0}>
                      {results.marketShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip {...chartTooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {results.marketShare.map((entry, i) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                      {entry.name} ({entry.value}%)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Top competitors table */}
          {results.topCompetitors?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Top Competitors</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2.5 text-muted-foreground font-medium text-xs">Domain</th>
                      <th className="text-center py-2.5 text-muted-foreground font-medium text-xs">Authority</th>
                      <th className="text-right py-2.5 text-muted-foreground font-medium text-xs">Est. Traffic</th>
                      <th className="text-right py-2.5 text-muted-foreground font-medium text-xs">Keywords</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.topCompetitors.map((comp) => (
                      <tr key={comp.name} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="py-2.5 flex items-center gap-2">
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium text-foreground">{comp.name}</span>
                        </td>
                        <td className="py-2.5 text-center">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${comp.authority >= 60 ? "text-success bg-success/10" : comp.authority >= 35 ? "text-warning bg-warning/10" : "text-muted-foreground bg-secondary"}`}>{comp.authority}</span>
                        </td>
                        <td className="py-2.5 text-right data-cell text-foreground">{comp.traffic}</td>
                        <td className="py-2.5 text-right data-cell text-muted-foreground">{comp.keywords}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* SERP Volatility */}
            {results.volatility?.length > 0 && (
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">SERP Volatility Index</h3>
                <p className="text-xs text-muted-foreground mb-4">Weekly ranking fluctuation score</p>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={results.volatility}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip {...chartTooltipStyle} />
                    <Line type="monotone" dataKey="score" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={{ fill: "hsl(var(--warning))", r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Keyword growth */}
            {results.keywordGrowth?.length > 0 && (
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-1">Search Interest Trend</h3>
                <p className="text-xs text-muted-foreground mb-4">Monthly search volume growth</p>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={results.keywordGrowth}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip {...chartTooltipStyle} />
                    <Area type="monotone" dataKey="volume" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#growthGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* AI Insights */}
          {results.insights?.length > 0 && (
            <div className="glass-card-float p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-display text-sm font-semibold text-foreground">Market Intelligence Insights</h3>
              </div>
              <InsightList insights={results.insights} />
            </div>
          )}

          <div className="glass-card-float p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-success/5" />
            <div className="relative">
              <p className="text-sm text-muted-foreground mb-2">Market difficulty: <span className="font-bold text-foreground">{results.marketDifficulty}/100</span> · Opportunity: <span className="font-bold text-foreground">{results.opportunityScore}/100</span></p>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Ready to capture this market?</h3>
              <p className="text-sm text-muted-foreground mb-6">Our team will build a custom strategy based on these market insights.</p>
              <a href="/contact" className="btn-primary-gradient gap-2">Get Market Strategy <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

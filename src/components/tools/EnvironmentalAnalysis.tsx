import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Loader2, ArrowRight, Sparkles, Target, Users, TrendingUp } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { InsightList, InsightData } from "@/components/charts/InsightCard";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--chart-4))", "hsl(var(--info))"];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function EnvironmentalAnalysis() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = () => {
    if (!niche.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults({
        marketDifficulty: 72,
        opportunityScore: 64,
        serpVolatility: 45,
        competitorDensity: 78,
        scatter: [
          { keyword: "seo tools", difficulty: 82, opportunity: 45, volume: 14800 },
          { keyword: "seo audit", difficulty: 68, opportunity: 62, volume: 9200 },
          { keyword: "seo strategy", difficulty: 74, opportunity: 38, volume: 6400 },
          { keyword: `${niche} seo`, difficulty: 35, opportunity: 85, volume: 4100 },
          { keyword: `best ${niche}`, difficulty: 55, opportunity: 72, volume: 3200 },
          { keyword: `${niche} tips`, difficulty: 28, opportunity: 88, volume: 2800 },
          { keyword: `${niche} services`, difficulty: 62, opportunity: 58, volume: 5600 },
          { keyword: `${niche} agency`, difficulty: 48, opportunity: 76, volume: 2100 },
        ],
        marketShare: [
          { name: "Top 3 Players", value: 42 },
          { name: "Mid-tier (4-10)", value: 28 },
          { name: "Long-tail Sites", value: 18 },
          { name: "Available", value: 12 },
        ],
        volatility: [
          { week: "W1", score: 38 }, { week: "W2", score: 42 }, { week: "W3", score: 55 },
          { week: "W4", score: 48 }, { week: "W5", score: 62 }, { week: "W6", score: 45 },
          { week: "W7", score: 51 }, { week: "W8", score: 43 },
        ],
        insights: [
          { type: "opportunity" as const, title: "Strong long-tail opportunities detected", description: `Your niche "${niche}" has 23 low-competition keyword clusters with combined monthly volume of 45,000+. Competitors haven't targeted these yet.`, impact: "High", action: "View keyword clusters" },
          { type: "warning" as const, title: "High competitor density in head terms", description: "Top 3 competitors control 42% of organic traffic for primary keywords. Direct competition requires significant content investment.", impact: "Medium" },
          { type: "info" as const, title: "SERP volatility creates ranking windows", description: "SERP positions are fluctuating 15-20% more than average, indicating algorithm updates. Well-optimized content can capitalize on these shifts.", impact: "Medium" },
          { type: "opportunity" as const, title: "Local SEO gap in Houston market", description: "Only 2 of 10 competitors have optimized Google Business profiles. Strong local SEO opportunity with lower competition than national terms.", impact: "High", action: "Local SEO strategy" },
        ],
      });
    }, 3000);
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
          <p className="font-medium text-foreground">Analyzing competitive landscape...</p>
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
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-1">Opportunity vs Difficulty</h3>
              <p className="text-xs text-muted-foreground mb-4">Keywords plotted by competition level and growth potential</p>
              <ResponsiveContainer width="100%" height={280}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis type="number" dataKey="difficulty" name="Difficulty" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} label={{ value: "Difficulty →", position: "bottom", offset: -5, style: { fill: "hsl(var(--muted-foreground))", fontSize: 10 } }} />
                  <YAxis type="number" dataKey="opportunity" name="Opportunity" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} label={{ value: "Opportunity →", angle: -90, position: "insideLeft", offset: 15, style: { fill: "hsl(var(--muted-foreground))", fontSize: 10 } }} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} {...chartTooltipStyle} formatter={(value: any, name: string) => [value, name]} />
                  <Scatter data={results.scatter} fill="hsl(var(--accent))" fillOpacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-1">Market Share Distribution</h3>
              <p className="text-xs text-muted-foreground mb-4">Organic traffic distribution among competitors</p>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={results.marketShare} cx="50%" cy="50%" outerRadius={100} innerRadius={60} dataKey="value" paddingAngle={3} strokeWidth={0}>
                    {results.marketShare.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {results.marketShare.map((entry: any, i: number) => (
                  <div key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    {entry.name} ({entry.value}%)
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card-float p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-1">SERP Volatility Index</h3>
            <p className="text-xs text-muted-foreground mb-4">Weekly ranking fluctuation score (higher = more volatile)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={results.volatility}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--warning))" strokeWidth={2.5} dot={{ fill: "hsl(var(--warning))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Insights */}
          <div className="glass-card-float p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-accent" />
              <h3 className="font-display text-sm font-semibold text-foreground">Market Intelligence Insights</h3>
            </div>
            <InsightList insights={results.insights} />
          </div>

          <div className="glass-card-float p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-success/5" />
            <div className="relative">
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

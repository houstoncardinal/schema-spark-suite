import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, ArrowRight, Brain, BookOpen } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { InsightList, InsightData } from "@/components/charts/InsightCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function ContentAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults({
        nlpScore: 62,
        readability: 74,
        keywordRelevance: 55,
        semanticCoverage: 48,
        contentDepth: 42,
        wordCount: 1240,
        avgSentenceLength: 18,
        fleschScore: 62,
        metrics: [
          { label: "Keyword Relevance", value: 55, maxValue: 100 },
          { label: "Semantic Coverage", value: 48, maxValue: 100 },
          { label: "Topic Authority", value: 52, maxValue: 100 },
          { label: "Readability", value: 74, maxValue: 100 },
          { label: "Content Depth", value: 42, maxValue: 100 },
          { label: "E-E-A-T Signals", value: 38, maxValue: 100 },
        ],
        keywordCloud: [
          { word: "SEO", relevance: 92 }, { word: "optimization", relevance: 78 },
          { word: "search", relevance: 85 }, { word: "ranking", relevance: 70 },
          { word: "content", relevance: 65 }, { word: "strategy", relevance: 60 },
          { word: "keywords", relevance: 88 }, { word: "backlinks", relevance: 55 },
          { word: "technical", relevance: 45 }, { word: "analytics", relevance: 40 },
          { word: "performance", relevance: 52 }, { word: "organic", relevance: 72 },
        ],
        missingClusters: [
          { cluster: "User Intent Optimization", gap: 85 },
          { cluster: "E-E-A-T Signals", gap: 78 },
          { cluster: "Core Web Vitals", gap: 72 },
          { cluster: "Schema Implementation", gap: 68 },
          { cluster: "Internal Linking", gap: 62 },
        ],
        insights: [
          { type: "warning" as const, title: "Content lacks semantic depth", description: "Your content covers surface-level topics but misses key semantic clusters. Adding related entities and LSI keywords would signal topical authority to search engines.", impact: "High", action: "View missing topics" },
          { type: "critical" as const, title: "E-E-A-T signals are weak", description: "No author byline, credentials, or experience signals detected. Google's quality raters prioritize expertise and authority — critical for YMYL topics.", impact: "High" },
          { type: "opportunity" as const, title: "Readability is good but can improve", description: "Current Flesch score of 62 (standard) could be optimized to 70+ for broader audience reach. Shorter paragraphs and simpler vocabulary recommended.", impact: "Low" },
          { type: "info" as const, title: "Adding FAQ section could boost rankings", description: "Competitor analysis shows top-ranking pages include FAQ sections with 5-8 questions. This also enables FAQ schema markup for rich results.", impact: "Medium", action: "Generate FAQ" },
        ],
      });
    }, 2500);
  };

  return (
    <div>
      <div className="glass-card-float p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3.5">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Enter page URL or paste content to analyze..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={analyze} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-8 py-3.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Brain className="h-4 w-4" /> Analyze Content</>}
          </button>
        </div>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-float p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="font-medium text-foreground">Running NLP content analysis...</p>
          <p className="text-sm text-muted-foreground mt-1">Evaluating semantic relevance, readability, and content depth</p>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Score overview */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="col-span-2 lg:col-span-1 glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.nlpScore} size={90} strokeWidth={6} />
              <p className="text-xs font-semibold text-foreground mt-2">NLP Score</p>
            </div>
            {[
              { label: "Readability", value: results.readability },
              { label: "Keyword Fit", value: results.keywordRelevance },
              { label: "Semantic Depth", value: results.semanticCoverage },
              { label: "Content Depth", value: results.contentDepth },
            ].map(m => (
              <div key={m.label} className="glass-card-float p-5 flex flex-col items-center">
                <ScoreRing score={m.value} size={70} strokeWidth={5} />
                <p className="text-xs font-semibold text-foreground mt-2">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Metrics */}
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Content Quality Metrics</h3>
              <AnimatedBarGroup bars={results.metrics} />
              <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                <div className="text-center">
                  <p className="data-cell text-lg font-bold text-foreground">{results.wordCount}</p>
                  <p className="text-[10px] text-muted-foreground">Words</p>
                </div>
                <div className="text-center">
                  <p className="data-cell text-lg font-bold text-foreground">{results.avgSentenceLength}</p>
                  <p className="text-[10px] text-muted-foreground">Avg Sentence</p>
                </div>
                <div className="text-center">
                  <p className="data-cell text-lg font-bold text-foreground">{results.fleschScore}</p>
                  <p className="text-[10px] text-muted-foreground">Flesch Score</p>
                </div>
              </div>
            </div>

            {/* Keyword cloud */}
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Keyword Relevance Cloud</h3>
              <div className="flex flex-wrap gap-2 items-center justify-center min-h-[200px]">
                {results.keywordCloud.map((kw: any, i: number) => {
                  const size = 0.7 + (kw.relevance / 100) * 0.8;
                  const opacity = 0.4 + (kw.relevance / 100) * 0.6;
                  return (
                    <motion.span
                      key={kw.word}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity, scale: 1 }}
                      transition={{ delay: i * 0.05, type: "spring" }}
                      className="rounded-lg bg-accent/10 px-3 py-1.5 font-display font-semibold text-accent cursor-default hover:bg-accent/20 transition-colors"
                      style={{ fontSize: `${size}rem` }}
                      title={`Relevance: ${kw.relevance}%`}
                    >
                      {kw.word}
                    </motion.span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Missing clusters */}
          <div className="glass-card-float p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Missing Keyword Clusters</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={results.missingClusters} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis dataKey="cluster" type="category" width={150} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="gap" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} name="Coverage Gap %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Insights */}
          <div className="glass-card-float p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-4 w-4 text-accent" />
              <h3 className="font-display text-sm font-semibold text-foreground">Content Intelligence Insights</h3>
            </div>
            <InsightList insights={results.insights} />
          </div>

          <div className="glass-card-float p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-info/5" />
            <div className="relative">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Need expert content optimization?</h3>
              <p className="text-sm text-muted-foreground mb-6">Our content strategists will optimize your pages for maximum search visibility.</p>
              <a href="/contact" className="btn-primary-gradient gap-2">Get Content Strategy <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

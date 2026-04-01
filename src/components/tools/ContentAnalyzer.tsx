import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Loader2, ArrowRight, Brain, BookOpen, Sparkles } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { InsightList } from "@/components/charts/InsightCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { analyzeContent } from "@/lib/content-engine";
import { aiSEOApi, type AIContentResponse } from "@/lib/ai-seo-api";
import { toast } from "sonner";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function ContentAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof analyzeContent> | null>(null);
  const [aiData, setAiData] = useState<AIContentResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    setAiData(null);

    const baseResults = analyzeContent(url);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setResults(baseResults);

    // Fetch AI content analysis
    setAiLoading(true);
    try {
      const aiResponse = await aiSEOApi.analyzeContent(url, {
        nlpScore: baseResults.nlpScore,
        readability: baseResults.readability,
        keywordRelevance: baseResults.keywordRelevance,
        semanticCoverage: baseResults.semanticCoverage,
        contentDepth: baseResults.contentDepth,
        eeatSignals: baseResults.eeatSignals,
      });
      setAiData(aiResponse);
      toast.success("AI content analysis complete");
    } catch (err) {
      console.error("AI content analysis failed:", err);
    } finally {
      setAiLoading(false);
    }
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
                {results.keywordCloud.map((kw, i) => {
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

          {/* Competitor comparison */}
          <div className="glass-card-float p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Content vs Top Competitors</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={results.competitorComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="yours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Your Page" />
                <Bar dataKey="competitor" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Avg Competitor" opacity={0.5} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Missing clusters */}
          <div className="glass-card-float p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Missing Keyword Clusters</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={results.missingClusters} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <YAxis dataKey="cluster" type="category" width={180} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                <Tooltip {...chartTooltipStyle} />
                <Bar dataKey="gap" fill="hsl(var(--warning))" radius={[0, 4, 4, 0]} name="Coverage Gap %" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* AI Content Intelligence */}
          {aiLoading && (
            <div className="glass-card-float p-6 text-center">
              <Sparkles className="h-5 w-5 text-accent animate-pulse mx-auto mb-2" />
              <p className="text-sm font-medium text-foreground">AI analyzing content quality...</p>
            </div>
          )}

          {aiData && (
            <div className="glass-card-float p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4 w-4 text-accent" />
                <h3 className="font-display text-sm font-semibold text-foreground">AI Content Intelligence</h3>
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">Powered by AI</span>
              </div>
              <p className="text-sm text-foreground mb-4 leading-relaxed">{aiData.analysis}</p>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-xs font-semibold text-success mb-2 uppercase tracking-wider">Strengths</h4>
                  <ul className="space-y-1.5">
                    {aiData.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-destructive mb-2 uppercase tracking-wider">Weaknesses</h4>
                  <ul className="space-y-1.5">
                    {aiData.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              {aiData.topicGaps.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <h4 className="text-xs font-semibold text-warning mb-2 uppercase tracking-wider">Missing Topics to Cover</h4>
                  <div className="flex flex-wrap gap-2">
                    {aiData.topicGaps.map((g, i) => (
                      <span key={i} className="text-xs bg-warning/10 text-warning px-2.5 py-1 rounded-lg font-medium">{g}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Algorithmic Insights */}
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
              <p className="text-sm text-muted-foreground mb-2">Your NLP score is <span className="font-bold text-foreground">{results.nlpScore}/100</span></p>
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

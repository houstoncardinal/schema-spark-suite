import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Loader2, ArrowRight, Brain, BookOpen, Sparkles, CheckCircle, AlertTriangle, Shield, Link2, Code, Eye } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { InsightList } from "@/components/charts/InsightCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell, Legend } from "recharts";
import { aiSEOApi, type AIContentResponse } from "@/lib/ai-seo-api";
import { firecrawlApi } from "@/lib/firecrawl-api";
import { toast } from "sonner";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--info))", "hsl(var(--chart-4))", "hsl(var(--destructive))"];

export function ContentAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIContentResponse | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    setActiveTab("overview");

    try {
      const scrapeResponse = await firecrawlApi.scrape(url);
      const html = scrapeResponse.data?.html || scrapeResponse.data?.data?.html || "";
      const markdown = scrapeResponse.data?.markdown || scrapeResponse.data?.data?.markdown || "";
      const links = scrapeResponse.data?.links || scrapeResponse.data?.data?.links || [];

      if (!html && !markdown) {
        toast.warning("Could not scrape page", { description: "Attempting AI analysis with URL only." });
      }

      const aiResponse = await aiSEOApi.analyzeContentReal(url, html, markdown, links);
      setResults(aiResponse);
      toast.success("Deep content analysis complete");
    } catch (err) {
      console.error("Content analysis failed:", err);
      toast.error("Analysis failed", { description: "Please check the URL and try again." });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "eeat", label: "E-E-A-T", icon: Shield },
    { id: "structure", label: "Structure", icon: FileText },
    { id: "optimization", label: "Optimize", icon: Sparkles },
    { id: "schema", label: "Schema", icon: Code },
    { id: "intelligence", label: "AI Insights", icon: Brain },
  ];

  return (
    <div>
      <div className="glass-card-float p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3.5">
            <BookOpen className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Enter page URL to analyze content..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={analyze} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-8 py-3.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Brain className="h-4 w-4" /> Analyze Content</>}
          </button>
        </div>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-float p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="font-medium text-foreground">Deep content analysis in progress...</p>
          <p className="text-sm text-muted-foreground mt-1">Analyzing E-E-A-T signals, semantic coverage, heading structure, and content gaps</p>
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

          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-xl bg-secondary p-1 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}>
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {results.metrics?.length > 0 && (
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
                )}

                {results.keywordCloud?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Keyword Relevance Cloud</h3>
                    <div className="flex flex-wrap gap-2 items-center justify-center min-h-[200px]">
                      {results.keywordCloud.map((kw, i) => {
                        const size = 0.7 + (kw.relevance / 100) * 0.8;
                        const opacity = 0.4 + (kw.relevance / 100) * 0.6;
                        return (
                          <motion.span key={kw.word} initial={{ opacity: 0, scale: 0 }} animate={{ opacity, scale: 1 }} transition={{ delay: i * 0.04, type: "spring" }}
                            className="rounded-lg bg-accent/10 px-3 py-1.5 font-display font-semibold text-accent cursor-default hover:bg-accent/20 transition-colors"
                            style={{ fontSize: `${size}rem` }} title={`Relevance: ${kw.relevance}%`}>
                            {kw.word}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sentiment + Content Score */}
              <div className="grid lg:grid-cols-2 gap-6">
                {results.sentimentAnalysis && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Sentiment Analysis</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={[
                          { name: "Positive", value: results.sentimentAnalysis.positive },
                          { name: "Neutral", value: results.sentimentAnalysis.neutral },
                          { name: "Negative", value: results.sentimentAnalysis.negative },
                        ]} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={4} stroke="none">
                          <Cell fill="hsl(var(--success))" />
                          <Cell fill="hsl(var(--muted-foreground))" />
                          <Cell fill="hsl(var(--destructive))" />
                        </Pie>
                        <Tooltip {...chartTooltipStyle} formatter={(v: number) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex justify-center gap-4 mt-2">
                      {[
                        { label: "Positive", color: "bg-success", value: results.sentimentAnalysis.positive },
                        { label: "Neutral", color: "bg-muted-foreground", value: results.sentimentAnalysis.neutral },
                        { label: "Negative", color: "bg-destructive", value: results.sentimentAnalysis.negative },
                      ].map(s => (
                        <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className={`h-2 w-2 rounded-full ${s.color}`} />{s.label} ({s.value}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {results.contentScoreHistory?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Current vs Optimal</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={results.contentScoreHistory} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                        <YAxis dataKey="metric" type="category" width={100} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                        <Tooltip {...chartTooltipStyle} />
                        <Legend />
                        <Bar dataKey="current" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} name="Current" />
                        <Bar dataKey="optimal" fill="hsl(var(--success))" radius={[0, 4, 4, 0]} name="Optimal" fillOpacity={0.4} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              {/* Competitor comparison */}
              {results.competitorComparison?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Content vs Top Competitors</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={results.competitorComparison}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                      <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip {...chartTooltipStyle} />
                      <Legend />
                      <Bar dataKey="yours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Your Page" />
                      <Bar dataKey="competitor" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Avg Competitor" opacity={0.5} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Missing clusters */}
              {results.missingClusters?.length > 0 && (
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
              )}
            </div>
          )}

          {/* E-E-A-T TAB */}
          {activeTab === "eeat" && (
            <div className="space-y-6">
              {results.eeatAnalysis?.length > 0 && (
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">E-E-A-T Radar</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={results.eeatAnalysis} cx="50%" cy="50%" outerRadius="72%">
                        <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <PolarAngleAxis dataKey="signal" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                        <Radar name="Score" dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.15} strokeWidth={2} />
                        <Tooltip {...chartTooltipStyle} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">E-E-A-T Signal Details</h3>
                    <div className="space-y-3">
                      {results.eeatAnalysis.map((signal, i) => (
                        <motion.div key={signal.signal} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="rounded-lg bg-background/50 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-foreground">{signal.signal}</span>
                            <ScoreRing score={signal.score} size={36} strokeWidth={3} animated={false} />
                          </div>
                          <p className="text-xs text-muted-foreground">{signal.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STRUCTURE TAB */}
          {activeTab === "structure" && (
            <div className="space-y-6">
              {results.headingStructure?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Heading Structure Analysis</h3>
                  <div className="space-y-2">
                    {results.headingStructure.map((h, i) => {
                      const indent = h.tag === "H1" ? 0 : h.tag === "H2" ? 1 : 2;
                      return (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                          className="flex items-center gap-3 rounded-lg bg-background/50 p-3 hover:bg-secondary/30 transition-colors"
                          style={{ marginLeft: indent * 20 }}>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            h.tag === "H1" ? "bg-accent/10 text-accent" : h.tag === "H2" ? "bg-info/10 text-info" : "bg-secondary text-muted-foreground"
                          }`}>{h.tag}</span>
                          <span className="text-sm text-foreground flex-1 truncate">{h.text}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground">{h.wordCount}w</span>
                            {h.keywordPresent ? (
                              <CheckCircle className="h-3 w-3 text-success" />
                            ) : (
                              <AlertTriangle className="h-3 w-3 text-warning" />
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {results.internalLinkSuggestions?.length > 0 && (
                <div className="glass-card-float p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Link2 className="h-4 w-4 text-accent" />
                    <h3 className="font-display text-sm font-semibold text-foreground">Internal Link Suggestions</h3>
                  </div>
                  <div className="space-y-3">
                    {results.internalLinkSuggestions.map((link, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        className="rounded-lg border border-border p-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-medium text-foreground">"{link.anchor}"</p>
                            <p className="text-xs text-accent mt-0.5">→ {link.targetPage}</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5">{link.reason}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OPTIMIZATION TAB */}
          {activeTab === "optimization" && (
            <div className="space-y-6">
              {results.optimizations?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Optimization Actions</h3>
                  <div className="space-y-3">
                    {results.optimizations.map((opt, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-border p-4 hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-foreground">{opt.action}</h4>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              opt.impact === "High" ? "bg-success/10 text-success" : opt.impact === "Medium" ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground"
                            }`}>{opt.impact} Impact</span>
                            <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{opt.effort}</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">{opt.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="glass-card-float p-6">
                  <h4 className="text-xs font-semibold text-success mb-3 uppercase tracking-wider">Strengths</h4>
                  <ul className="space-y-2">
                    {results.strengths?.map((s, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-success mt-0.5 shrink-0" />{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card-float p-6">
                  <h4 className="text-xs font-semibold text-destructive mb-3 uppercase tracking-wider">Weaknesses</h4>
                  <ul className="space-y-2">
                    {results.weaknesses?.map((w, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <AlertTriangle className="h-3 w-3 text-destructive mt-0.5 shrink-0" />{w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {results.topicGaps?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h4 className="text-xs font-semibold text-warning mb-3 uppercase tracking-wider">Missing Topics to Cover</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.topicGaps.map((g, i) => (
                      <span key={i} className="text-xs bg-warning/10 text-warning px-2.5 py-1 rounded-lg font-medium">{g}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCHEMA TAB */}
          {activeTab === "schema" && results.schemaOpportunities?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Schema Markup Opportunities</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.schemaOpportunities.map((schema, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-border p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Code className="h-4 w-4 text-accent" />
                        <h4 className="text-sm font-semibold text-foreground">{schema.type}</h4>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        schema.impact === "High" ? "bg-success/10 text-success" : schema.impact === "Medium" ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground"
                      }`}>{schema.impact}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{schema.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* AI INSIGHTS TAB */}
          {activeTab === "intelligence" && (
            <div className="space-y-6">
              <div className="glass-card-float p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-sm font-semibold text-foreground">AI Content Intelligence</h3>
                  <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">Powered by AI</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{results.analysis}</p>
              </div>

              {results.insights?.length > 0 && (
                <div className="glass-card-float p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-4 w-4 text-accent" />
                    <h3 className="font-display text-sm font-semibold text-foreground">Content Intelligence Insights</h3>
                  </div>
                  <InsightList insights={results.insights} />
                </div>
              )}
            </div>
          )}

          <div className="glass-card-float p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-info/5" />
            <div className="relative">
              <p className="text-sm text-muted-foreground mb-2">Your NLP score is <span className="font-bold text-foreground">{results.nlpScore}/100</span></p>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Need expert content optimization?</h3>
              <p className="text-sm text-muted-foreground mb-6">Our content strategists will optimize your pages for maximum search visibility.</p>
              <Link to="/contact" className="btn-rainbow gap-2">Get Content Strategy <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

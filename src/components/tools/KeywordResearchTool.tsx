import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, ArrowRight, TrendingUp, TrendingDown, Minus, Sparkles, Brain, Target, BarChart3, Layers, Calendar, Globe, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, BarChart, Bar, PieChart, Pie, Cell, Legend, ComposedChart, Line } from "recharts";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { aiSEOApi, type AIKeywordResponse } from "@/lib/ai-seo-api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ExpandedKeyword = { keyword: string; intent: string; difficulty: number; wordCount: number; isQuestion: boolean; isLongTail: boolean };

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--info))", "hsl(var(--chart-4))", "hsl(var(--destructive))"];

export function KeywordResearchTool() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIKeywordResponse | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);

  const [expanded, setExpanded] = useState<ExpandedKeyword[] | null>(null);

  const search = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setResults(null);
    setExpanded(null);
    setActiveTab("overview");

    try {
      const [aiResponse, expandRes] = await Promise.all([
        aiSEOApi.analyzeKeywordReal(keyword),
        supabase.functions.invoke("keyword-expand", { body: { seed: keyword, depth: 2 } }),
      ]);
      setResults(aiResponse);
      const expData = expandRes.data as { success?: boolean; data?: { keywords?: ExpandedKeyword[] } } | null;
      if (expData?.success && expData.data?.keywords) {
        setExpanded(expData.data.keywords);
      }
      toast.success("AI keyword intelligence ready");
    } catch (err) {
      console.error("Keyword analysis failed:", err);
      toast.error("Analysis failed", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const diffColor = (d: number) => d >= 70 ? "text-destructive bg-destructive/10" : d >= 40 ? "text-warning bg-warning/10" : "text-success bg-success/10";
  const totalOpportunityVolume = results?.relatedKeywords?.reduce((sum, s) => sum + s.volume, 0) || 0;
  const avgDifficulty = results?.relatedKeywords?.length ? Math.round(results.relatedKeywords.reduce((sum, s) => sum + s.difficulty, 0) / results.relatedKeywords.length) : 0;
  const lowCompetitionCount = results?.relatedKeywords?.filter(s => s.difficulty < 40).length || 0;

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "serp", label: "SERP Features", icon: Globe },
    { id: "clusters", label: "Clusters", icon: Layers },
    { id: "difficulty", label: "Difficulty", icon: Target },
    { id: "seasonality", label: "Seasonality", icon: Calendar },
    { id: "longtail", label: "Long-Tail", icon: Zap },
    { id: "intelligence", label: "AI Intelligence", icon: Brain },
  ];

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
          <p className="font-medium text-foreground">AI analyzing keyword data...</p>
          <p className="text-sm text-muted-foreground mt-1">Analyzing SERP features, clusters, difficulty factors, and seasonality patterns</p>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Hero KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Search Volume", value: results.volume?.toLocaleString() || "N/A", sub: "/month", score: null },
              { label: "Difficulty", value: null, sub: (results.difficulty || 0) >= 70 ? "Hard" : (results.difficulty || 0) >= 40 ? "Moderate" : "Easy", score: results.difficulty },
              { label: "CPC", value: `$${results.cpc || 0}`, sub: "avg bid", score: null },
              { label: "Intent", value: results.intent || "Informational", sub: "search type", score: null },
            ].map((m) => (
              <div key={m.label} className="glass-card-float p-5 flex flex-col items-center">
                {m.score !== null ? (
                  <>
                    <ScoreRing score={m.score} size={70} strokeWidth={5} />
                    <p className="text-xs text-muted-foreground mt-2">{m.sub}</p>
                  </>
                ) : (
                  <>
                    <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </>
                )}
                <p className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wider">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Summary KPIs */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card-float p-4 text-center">
              <p className="font-display text-xl font-bold text-foreground">{totalOpportunityVolume.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Opportunity Volume</p>
            </div>
            <div className="glass-card-float p-4 text-center">
              <p className="font-display text-xl font-bold text-foreground">{avgDifficulty}</p>
              <p className="text-xs text-muted-foreground">Avg. Difficulty</p>
            </div>
            <div className="glass-card-float p-4 text-center">
              <p className="font-display text-xl font-bold text-success">{lowCompetitionCount}</p>
              <p className="text-xs text-muted-foreground">Low Competition</p>
            </div>
          </div>

          {/* Tab nav */}
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
              {/* Trend chart */}
              {results.trendData?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Search Volume Trend (12 months)</h3>
                  <ResponsiveContainer width="100%" height={260}>
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
              )}

              {/* Intent Breakdown + Related Keywords */}
              <div className="grid lg:grid-cols-2 gap-6">
                {results.intentBreakdown?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Search Intent Distribution</h3>
                    <ResponsiveContainer width="100%" height={240}>
                      <PieChart>
                        <Pie data={results.intentBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="percentage" nameKey="intent" paddingAngle={4} stroke="none">
                          {results.intentBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip {...chartTooltipStyle} formatter={(v: number) => `${v}%`} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-3 mt-2">
                      {results.intentBreakdown.map((item, i) => (
                        <span key={item.intent} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                          {item.intent} ({item.percentage}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Top Ranking Pages */}
                {results.topRankingPages?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Top Ranking Pages</h3>
                    <div className="space-y-2">
                      {results.topRankingPages.map((page, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                          className="rounded-lg bg-background/50 p-3 hover:bg-secondary/50 transition-colors">
                          <p className="text-sm font-medium text-foreground truncate">{page.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{page.url}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded font-semibold">DA {page.authority}</span>
                            <span className="text-[10px] text-muted-foreground">{page.wordCount} words</span>
                            <span className="text-[10px] text-muted-foreground">{page.backlinks} backlinks</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Related Keywords Table */}
              {results.relatedKeywords?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Related Keywords ({results.relatedKeywords.length})</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 text-muted-foreground font-medium text-xs">Keyword</th>
                          <th className="text-right py-3 text-muted-foreground font-medium text-xs">Volume</th>
                          <th className="text-right py-3 text-muted-foreground font-medium text-xs">KD</th>
                          <th className="text-right py-3 text-muted-foreground font-medium text-xs">CPC</th>
                          <th className="text-right py-3 text-muted-foreground font-medium text-xs">Intent</th>
                          <th className="text-right py-3 text-muted-foreground font-medium text-xs">Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.relatedKeywords.map((s) => (
                          <motion.tr key={s.keyword} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                            <td className="py-3 font-medium text-foreground">{s.keyword}</td>
                            <td className="py-3 text-right data-cell text-foreground">{s.volume?.toLocaleString()}</td>
                            <td className="py-3 text-right">
                              <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${diffColor(s.difficulty)}`}>{s.difficulty}</span>
                            </td>
                            <td className="py-3 text-right data-cell text-foreground">${s.cpc}</td>
                            <td className="py-3 text-right text-xs text-muted-foreground">{s.intent}</td>
                            <td className="py-3 text-right">
                              {s.trend === "up" ? <TrendingUp className="h-4 w-4 text-success ml-auto" /> : s.trend === "down" ? <TrendingDown className="h-4 w-4 text-destructive ml-auto" /> : <Minus className="h-4 w-4 text-muted-foreground ml-auto" />}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SERP FEATURES TAB */}
          {activeTab === "serp" && results.serpFeatures?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-6">SERP Feature Opportunities</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {results.serpFeatures.map((feat, i) => (
                  <motion.div key={feat.feature} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="rounded-xl border border-border p-4 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-foreground">{feat.feature}</h4>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${feat.present ? "bg-success/10 text-success" : "bg-secondary text-muted-foreground"}`}>
                        {feat.present ? "Active" : "Available"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${feat.opportunity}%` }} transition={{ delay: i * 0.08, duration: 0.6 }}
                          className="h-full rounded-full bg-accent" />
                      </div>
                      <span className="text-xs data-cell text-muted-foreground w-10 text-right">{feat.opportunity}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Opportunity to capture this SERP feature</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CLUSTERS TAB */}
          {activeTab === "clusters" && results.clusters?.length > 0 && (
            <div className="space-y-4">
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-6">Keyword Clusters</h3>
                <div className="space-y-3">
                  {results.clusters.map((cluster, i) => (
                    <motion.div key={cluster.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                      className="rounded-xl border border-border overflow-hidden">
                      <button onClick={() => setExpandedCluster(expandedCluster === cluster.name ? null : cluster.name)}
                        className="w-full flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                            <Layers className="h-4 w-4 text-accent" />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-foreground">{cluster.name}</p>
                            <p className="text-xs text-muted-foreground">{cluster.keywords.length} keywords · {cluster.intent}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm font-bold text-foreground">{cluster.totalVolume?.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground">volume</p>
                          </div>
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${diffColor(cluster.avgDifficulty)}`}>{cluster.avgDifficulty} KD</span>
                          {expandedCluster === cluster.name ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedCluster === cluster.name && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="border-t border-border/50 bg-secondary/20 px-4 py-3">
                            <div className="flex flex-wrap gap-2">
                              {cluster.keywords.map(kw => (
                                <span key={kw} className="text-xs bg-background px-2.5 py-1 rounded-lg text-foreground font-medium">{kw}</span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DIFFICULTY TAB */}
          {activeTab === "difficulty" && results.difficultyBreakdown?.length > 0 && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">Difficulty Factor Breakdown</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart data={results.difficultyBreakdown} cx="50%" cy="50%" outerRadius="72%">
                    <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <PolarAngleAxis dataKey="factor" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <Radar name="Score" dataKey="score" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.15} strokeWidth={2} />
                    <Tooltip {...chartTooltipStyle} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">Factor Details</h3>
                <div className="space-y-4">
                  {results.difficultyBreakdown.map((factor, i) => (
                    <motion.div key={factor.factor} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">{factor.factor}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-muted-foreground">Weight: {Math.round(factor.weight * 100)}%</span>
                          <span className={`text-xs font-bold ${factor.score >= 70 ? "text-destructive" : factor.score >= 40 ? "text-warning" : "text-success"}`}>{factor.score}</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${factor.score}%` }} transition={{ delay: i * 0.06, duration: 0.6 }}
                          className={`h-full rounded-full ${factor.score >= 70 ? "bg-destructive" : factor.score >= 40 ? "bg-warning" : "bg-success"}`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEASONALITY TAB */}
          {activeTab === "seasonality" && results.seasonality?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-1">Seasonality Pattern</h3>
              <p className="text-xs text-muted-foreground mb-4">Search interest index by month (100 = baseline)</p>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={results.seasonality}>
                  <defs>
                    <linearGradient id="seasonGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis domain={[0, 'dataMax + 20']} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} formatter={(v: number) => [`${v}`, "Interest Index"]} />
                  <Area type="monotone" dataKey="index" fill="url(#seasonGrad)" stroke="none" />
                  <Bar dataKey="index" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} fillOpacity={0.6} />
                  <Line type="monotone" dataKey="index" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))", r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="mt-4 p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Peak: </span>
                  {results.seasonality.reduce((max, m) => m.index > max.index ? m : max, results.seasonality[0]).month} ({results.seasonality.reduce((max, m) => m.index > max.index ? m : max, results.seasonality[0]).index} index)
                  <span className="mx-2">·</span>
                  <span className="font-semibold text-foreground">Low: </span>
                  {results.seasonality.reduce((min, m) => m.index < min.index ? m : min, results.seasonality[0]).month} ({results.seasonality.reduce((min, m) => m.index < min.index ? m : min, results.seasonality[0]).index} index)
                </p>
              </div>
            </div>
          )}

          {/* LONG-TAIL TAB */}
          {activeTab === "longtail" && results.longTailOpportunities?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-1">Long-Tail Opportunities</h3>
              <p className="text-xs text-muted-foreground mb-4">Low-competition keywords with strong ranking potential</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-muted-foreground font-medium text-xs">Keyword</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">Volume</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">KD</th>
                      <th className="text-left py-3 text-muted-foreground font-medium text-xs pl-4">Parent Keyword</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.longTailOpportunities.map((lt, i) => (
                      <motion.tr key={lt.keyword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 font-medium text-foreground">{lt.keyword}</td>
                        <td className="py-3 text-right data-cell text-foreground">{lt.volume?.toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${diffColor(lt.difficulty)}`}>{lt.difficulty}</span>
                        </td>
                        <td className="py-3 text-left pl-4 text-xs text-muted-foreground">{lt.parentKeyword}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI INTELLIGENCE TAB */}
          {activeTab === "intelligence" && (
            <div className="space-y-6">
              <div className="glass-card-float p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-sm font-semibold text-foreground">AI Keyword Intelligence</h3>
                  <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">Powered by AI</span>
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">{results.analysis}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Recommended Strategy</h4>
                    <p className="text-sm text-foreground">{results.strategy}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Content Angle</h4>
                    <p className="text-sm text-foreground">{results.contentAngle}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl bg-secondary/50 p-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Competitive Insight</h4>
                  <p className="text-sm text-foreground">{results.competitiveInsight}</p>
                </div>
                <div className="mt-4 rounded-xl bg-secondary/50 p-4">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Time to Rank</h4>
                  <p className="text-sm text-foreground">{results.estimatedTimeToRank}</p>
                </div>
                {results.relatedOpportunities?.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Related Opportunities</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.relatedOpportunities.map((opp, i) => (
                        <span key={i} className="text-xs bg-accent/10 text-accent px-2.5 py-1 rounded-lg font-medium">{opp}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

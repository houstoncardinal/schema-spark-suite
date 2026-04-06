import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Globe, Loader2, ArrowRight, Sparkles, Target, Users, TrendingUp, ExternalLink, Shield, AlertTriangle, BarChart3, Layers, Brain, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { InsightList } from "@/components/charts/InsightCard";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, ComposedChart, Bar, BarChart } from "recharts";
import { aiSEOApi, type AIMarketResponse } from "@/lib/ai-seo-api";
import { firecrawlApi } from "@/lib/firecrawl-api";
import { toast } from "sonner";

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--chart-4))", "hsl(var(--info))", "hsl(var(--destructive))"];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function EnvironmentalAnalysis() {
  const [niche, setNiche] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIMarketResponse | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const analyze = async () => {
    if (!niche.trim()) return;
    setLoading(true);
    setResults(null);
    setActiveTab("overview");

    try {
      let searchResults = null;
      try {
        const searchResponse = await firecrawlApi.scrape(niche);
        if (searchResponse.success) searchResults = searchResponse.data;
      } catch { /* optional */ }

      const aiResponse = await aiSEOApi.analyzeMarketReal(niche, searchResults);
      setResults(aiResponse);
      toast.success("Deep market analysis complete");
    } catch (err) {
      console.error("Market analysis failed:", err);
      toast.error("Analysis failed", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "competitors", label: "Competitors", icon: Users },
    { id: "swot", label: "SWOT", icon: Shield },
    { id: "gaps", label: "Content Gaps", icon: Layers },
    { id: "trends", label: "Trends", icon: TrendingUp },
    { id: "barriers", label: "Entry Barriers", icon: AlertTriangle },
    { id: "intelligence", label: "AI Insights", icon: Brain },
  ];

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
          <p className="text-sm text-muted-foreground mt-1">Performing SWOT analysis, trend forecasting, and competitor profiling</p>
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
                {results.scatter?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-1">Opportunity vs Difficulty</h3>
                    <p className="text-xs text-muted-foreground mb-4">Keywords plotted by competition and growth potential</p>
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
                    <p className="text-xs text-muted-foreground mb-4">Organic traffic distribution</p>
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
                        <span key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />{entry.name} ({entry.value}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                {results.volatility?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">SERP Volatility Index</h3>
                    <ResponsiveContainer width="100%" height={220}>
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

                {results.keywordGrowth?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Search Interest Trend</h3>
                    <ResponsiveContainer width="100%" height={220}>
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

              {/* Competitor Radar */}
              {results.competitorRadar?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-1">Competitive Radar Overlay</h3>
                  <p className="text-xs text-muted-foreground mb-4">Your estimated position vs top competitors</p>
                  <ResponsiveContainer width="100%" height={350}>
                    <RadarChart data={results.competitorRadar} cx="50%" cy="50%" outerRadius="70%">
                      <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.5} />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                      <Radar name="You" dataKey="you" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.15} strokeWidth={2} />
                      <Radar name="Competitor 1" dataKey="competitor1" stroke="hsl(var(--success))" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
                      <Radar name="Competitor 2" dataKey="competitor2" stroke="hsl(var(--warning))" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
                      <Radar name="Competitor 3" dataKey="competitor3" stroke="hsl(var(--info))" fill="none" strokeWidth={1.5} strokeDasharray="5 5" />
                      <Tooltip {...chartTooltipStyle} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* COMPETITORS TAB */}
          {activeTab === "competitors" && results.topCompetitors?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Top Competitors</h3>
              <div className="space-y-3">
                {results.topCompetitors.map((comp, i) => (
                  <motion.div key={comp.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                          <ExternalLink className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{comp.name}</p>
                          <p className="text-xs text-muted-foreground">Est. Traffic: {comp.traffic} · {comp.keywords} keywords</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${comp.authority >= 60 ? "text-success bg-success/10" : comp.authority >= 35 ? "text-warning bg-warning/10" : "text-muted-foreground bg-secondary"}`}>DA {comp.authority}</span>
                        {comp.growth && (
                          <span className={`text-xs font-medium ${comp.growth.startsWith("+") ? "text-success" : "text-destructive"}`}>{comp.growth}</span>
                        )}
                      </div>
                    </div>
                    {comp.weaknesses && (
                      <p className="text-xs text-muted-foreground mt-2 pl-[52px]">
                        <span className="font-semibold text-warning">Weakness:</span> {comp.weaknesses}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* SWOT TAB */}
          {activeTab === "swot" && results.swot && (
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Strengths", items: results.swot.strengths, color: "bg-success/10 border-success/20", textColor: "text-success", icon: "✓" },
                { title: "Weaknesses", items: results.swot.weaknesses, color: "bg-destructive/10 border-destructive/20", textColor: "text-destructive", icon: "✗" },
                { title: "Opportunities", items: results.swot.opportunities, color: "bg-accent/10 border-accent/20", textColor: "text-accent", icon: "↑" },
                { title: "Threats", items: results.swot.threats, color: "bg-warning/10 border-warning/20", textColor: "text-warning", icon: "⚠" },
              ].map((section) => (
                <motion.div key={section.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-xl border ${section.color} p-5`}>
                  <h4 className={`text-sm font-bold ${section.textColor} mb-3 uppercase tracking-wider`}>{section.title}</h4>
                  <ul className="space-y-2">
                    {section.items?.map((item, i) => (
                      <li key={i} className="text-xs text-foreground flex items-start gap-2">
                        <span className={`${section.textColor} font-bold mt-0.5`}>{section.icon}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}

          {/* CONTENT GAPS TAB */}
          {activeTab === "gaps" && results.contentGaps?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Content Gap Analysis</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-muted-foreground font-medium text-xs">Topic</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">Search Volume</th>
                      <th className="text-center py-3 text-muted-foreground font-medium text-xs">Competition</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">Your Coverage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.contentGaps.map((gap, i) => (
                      <motion.tr key={gap.topic} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 font-medium text-foreground">{gap.topic}</td>
                        <td className="py-3 text-right data-cell text-foreground">{gap.searchVolume?.toLocaleString()}</td>
                        <td className="py-3 text-center">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            gap.competition === "Low" ? "bg-success/10 text-success" : gap.competition === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                          }`}>{gap.competition}</span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                              <div className="h-full rounded-full bg-accent" style={{ width: `${gap.yourCoverage}%` }} />
                            </div>
                            <span className="text-xs data-cell text-muted-foreground w-8">{gap.yourCoverage}%</span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TRENDS TAB */}
          {activeTab === "trends" && (
            <div className="space-y-6">
              {results.trendForecast?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-1">Market Trend Forecast</h3>
                  <p className="text-xs text-muted-foreground mb-4">Actual vs predicted search interest</p>
                  <ResponsiveContainer width="100%" height={280}>
                    <ComposedChart data={results.trendForecast}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip {...chartTooltipStyle} />
                      <Legend />
                      <Area type="monotone" dataKey="actual" fill="hsl(var(--accent))" fillOpacity={0.1} stroke="hsl(var(--accent))" strokeWidth={2} name="Actual" />
                      <Line type="monotone" dataKey="predicted" stroke="hsl(var(--warning))" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Predicted" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              )}

              {results.marketTrends?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Key Market Trends</h3>
                  <div className="space-y-3">
                    {results.marketTrends.map((trend, i) => (
                      <motion.div key={trend.trend} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="rounded-xl border border-border p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {trend.direction === "rising" ? <ArrowUpRight className="h-4 w-4 text-success mt-0.5 shrink-0" /> : trend.direction === "declining" ? <ArrowDownRight className="h-4 w-4 text-destructive mt-0.5 shrink-0" /> : <Minus className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />}
                            <div>
                              <p className="text-sm font-semibold text-foreground">{trend.trend}</p>
                              <p className="text-xs text-muted-foreground mt-1">{trend.impact}</p>
                            </div>
                          </div>
                          <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full shrink-0">{trend.timeframe}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* BARRIERS TAB */}
          {activeTab === "barriers" && results.entryBarriers?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Market Entry Barriers</h3>
              <div className="space-y-4">
                {results.entryBarriers.map((barrier, i) => (
                  <motion.div key={barrier.barrier} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{barrier.barrier}</span>
                      <span className={`text-xs font-bold ${barrier.severity >= 70 ? "text-destructive" : barrier.severity >= 40 ? "text-warning" : "text-success"}`}>{barrier.severity}/100</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-secondary overflow-hidden mb-1.5">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${barrier.severity}%` }} transition={{ delay: i * 0.06, duration: 0.6 }}
                        className={`h-full rounded-full ${barrier.severity >= 70 ? "bg-destructive" : barrier.severity >= 40 ? "bg-warning" : "bg-success"}`} />
                    </div>
                    <p className="text-xs text-muted-foreground">{barrier.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* AI INSIGHTS TAB */}
          {activeTab === "intelligence" && results.insights?.length > 0 && (
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

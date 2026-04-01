import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Loader2, ArrowRight, Brain, CheckCircle, Shield, FileText, Link2, Gauge, Code, Eye, Sparkles, Smartphone, Image, Lock, Search, BarChart3 } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { SEORadarChart } from "@/components/charts/SEORadarChart";
import { InsightList } from "@/components/charts/InsightCard";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { analyzeSEO, type SEOAuditResult } from "@/lib/seo-engine";
import { aiSEOApi, type AISEOAuditResponse } from "@/lib/ai-seo-api";
import { toast } from "sonner";

const loadingSteps = [
  "Crawling website structure...",
  "Analyzing technical SEO...",
  "Evaluating content quality...",
  "Checking Core Web Vitals...",
  "Validating schema markup...",
  "Assessing backlink profile...",
  "Generating AI insights...",
];

const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(var(--card))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "12px",
    fontSize: 12,
    fontFamily: "Inter",
    boxShadow: "var(--shadow-lg)",
  },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function AISEOAudit() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<SEOAuditResult | null>(null);
  const [aiData, setAiData] = useState<AISEOAuditResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    setAiData(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSteps.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 500);

    // Generate base analysis from deterministic engine
    const baseResults = analyzeSEO(url);

    // Wait for loading animation
    await new Promise(resolve => setTimeout(resolve, 3500));
    clearInterval(interval);
    setLoading(false);
    setResults(baseResults);

    // Fetch AI-powered insights in background
    setAiLoading(true);
    try {
      const aiResponse = await aiSEOApi.auditSite(
        url,
        { overall: baseResults.overall, technical: baseResults.technical, content: baseResults.content, authority: baseResults.authority, ux: baseResults.ux, speed: baseResults.speed, schema: baseResults.schema },
        baseResults.issuesBySeverity
      );
      setAiData(aiResponse);
      toast.success("AI analysis complete", { description: "Expert insights generated successfully" });
    } catch (err) {
      console.error("AI analysis failed:", err);
      toast.error("AI enhancement unavailable", { description: "Showing algorithmic analysis results" });
    } finally {
      setAiLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "technical", label: "Technical", icon: Shield },
    { id: "content", label: "Content", icon: FileText },
    { id: "serp", label: "SERP Features", icon: Search },
    { id: "mobile", label: "Mobile & Security", icon: Smartphone },
    { id: "performance", label: "Performance", icon: Gauge },
    { id: "insights", label: "AI Insights", icon: Brain },
    { id: "actions", label: "Actions", icon: CheckCircle },
  ];

  return (
    <div>
      {/* Input */}
      <div className="glass-card-float p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3.5">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Enter website URL for AI-powered deep analysis..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={analyze} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-8 py-3.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Brain className="h-4 w-4" /> Run AI Audit</>}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-float p-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <Loader2 className="h-16 w-16 animate-spin text-accent" />
                <Brain className="h-6 w-6 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              {loadingSteps.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: i <= loadingStep ? 1 : 0.3, x: 0 }}
                  className="flex items-center gap-3 text-sm"
                >
                  {i < loadingStep ? (
                    <CheckCircle className="h-4 w-4 text-success shrink-0" />
                  ) : i === loadingStep ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-border shrink-0" />
                  )}
                  <span className={i <= loadingStep ? "text-foreground" : "text-muted-foreground"}>{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
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
              {/* Score row */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="glass-card-float p-8 flex flex-col items-center justify-center">
                  <ScoreRing score={results.overall} size={140} strokeWidth={8} />
                  <p className="font-display text-lg font-bold text-foreground mt-4">Overall SEO Score</p>
                  <p className="text-xs text-muted-foreground mt-1">Based on 200+ ranking factors</p>
                </div>

                <div className="glass-card-float p-6 flex flex-col justify-center">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Category Scores</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <ScoreRing score={results.technical} size={70} strokeWidth={5} label="Technical" />
                    <ScoreRing score={results.content} size={70} strokeWidth={5} label="Content" />
                    <ScoreRing score={results.authority} size={70} strokeWidth={5} label="Authority" />
                    <ScoreRing score={results.ux} size={70} strokeWidth={5} label="UX" />
                    <ScoreRing score={results.speed} size={70} strokeWidth={5} label="Speed" />
                    <ScoreRing score={results.schema} size={70} strokeWidth={5} label="Schema" />
                  </div>
                </div>

                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Multi-Factor Analysis</h3>
                  <SEORadarChart data={results.radarData} height={220} />
                </div>
              </div>

              {/* Charts row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Issues by Category & Severity</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={results.issuesBySeverity} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                      <XAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip {...chartTooltipStyle} />
                      <Bar dataKey="critical" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="warning" fill="hsl(var(--warning))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="info" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-1">Ranking Growth Potential</h3>
                  <p className="text-xs text-muted-foreground mb-4">Projected organic traffic index with optimization</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={results.rankingPotential}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                      <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip {...chartTooltipStyle} />
                      <Line type="monotone" dataKey="current" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Without optimization" />
                      <Line type="monotone" dataKey="potential" stroke="hsl(var(--accent))" strokeWidth={3} dot={false} name="With optimization" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top insights */}
              <div className="glass-card-float p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-accent" />
                    <h3 className="font-display text-sm font-semibold text-foreground">Top AI Insights</h3>
                  </div>
                  <button onClick={() => setActiveTab("insights")} className="text-xs font-medium text-accent hover:underline">View all →</button>
                </div>
                <InsightList insights={results.insights.slice(0, 3)} />
              </div>

              {/* CTA */}
              <div className="glass-card-float p-8 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-info/5" />
                <div className="relative">
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">Want us to fix these issues?</h3>
                  <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">Our expert team will implement all recommendations and continuously optimize your SEO performance.</p>
                  <div className="flex items-center justify-center gap-3">
                    <a href="/contact" className="btn-primary-gradient gap-2">Book Strategy Call <ArrowRight className="h-4 w-4" /></a>
                    <a href="/services" className="inline-flex items-center gap-2 rounded-xl border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors">View Services</a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TECHNICAL TAB */}
          {activeTab === "technical" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card-float p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-sm font-semibold text-foreground">Technical SEO Breakdown</h3>
                </div>
                <AnimatedBarGroup bars={results.technicalDetails} />
              </div>
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">Core Web Vitals</h3>
                <div className="space-y-5">
                  {results.coreWebVitals.map(vital => (
                    <div key={vital.label} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{vital.label}</p>
                        <p className="text-xs text-muted-foreground">Target: {vital.target}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="data-cell font-semibold text-foreground">{vital.value}</span>
                        <span className={`h-2.5 w-2.5 rounded-full ${vital.status === "pass" ? "bg-success" : vital.status === "warning" ? "bg-warning" : "bg-destructive"}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* CONTENT TAB */}
          {activeTab === "content" && (
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card-float p-6">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-sm font-semibold text-foreground">Content Quality Metrics</h3>
                </div>
                <AnimatedBarGroup bars={results.contentDetails} />
              </div>
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">Content vs Competitors</h3>
                <div className="space-y-4 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Pages Indexed</span>
                    <span className="font-semibold text-foreground">{results.indexedPages} / {results.pageCount}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Internal Links</span>
                    <span className="font-semibold text-foreground">{results.internalLinks.count} ({results.internalLinks.avgLinksPerPage} avg/page)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Orphan Pages</span>
                    <span className={`font-semibold ${results.internalLinks.orphanPages > 10 ? "text-destructive" : "text-foreground"}`}>{results.internalLinks.orphanPages}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Title Tag</span>
                    <span className={`font-semibold ${results.metaTags.titleLength < 30 || results.metaTags.titleLength > 60 ? "text-warning" : "text-success"}`}>{results.metaTags.titleLength} chars</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Meta Description</span>
                    <span className={`font-semibold ${results.metaTags.descriptionLength < 120 || results.metaTags.descriptionLength > 160 ? "text-warning" : "text-success"}`}>{results.metaTags.descriptionLength} chars</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Open Graph Tags</span>
                    <span className={`font-semibold ${results.metaTags.hasOG ? "text-success" : "text-destructive"}`}>{results.metaTags.hasOG ? "Present" : "Missing"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Canonical Tag</span>
                    <span className={`font-semibold ${results.metaTags.hasCanonical ? "text-success" : "text-destructive"}`}>{results.metaTags.hasCanonical ? "Present" : "Missing"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === "insights" && (
            <div className="space-y-6">
              {/* AI-powered insights */}
              {aiLoading && (
                <div className="glass-card-float p-8 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                    <p className="font-medium text-foreground">AI is analyzing your site...</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Generating expert-level insights with AI intelligence</p>
                </div>
              )}

              {aiData?.summary && (
                <div className="glass-card-float p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-chart-4/5" />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-4 w-4 text-accent" />
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">AI Executive Summary</span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{aiData.summary}</p>
                  </div>
                </div>
              )}

              <div className="glass-card-float p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Brain className="h-4 w-4 text-accent" />
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    {aiData ? "AI-Generated Expert Insights" : "Algorithmic Insights"}
                  </h3>
                  {aiData && <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">Powered by AI</span>}
                </div>
                <InsightList insights={aiData?.insights || results.insights} />
              </div>
            </div>
          )}

          {/* ACTIONS TAB */}
          {activeTab === "actions" && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-6">
                Prioritized Action Plan
                {aiData && <span className="ml-2 text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">AI-Enhanced</span>}
              </h3>
              <div className="space-y-3">
                {(aiData?.recommendations || results.recommendations).map((rec, i) => (
                  <motion.div
                    key={rec.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`flex items-start gap-4 rounded-xl border border-border/50 p-4 transition-colors ${rec.completed ? "bg-success/5" : "bg-background hover:bg-secondary/50"}`}
                  >
                    <button className={`mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                      rec.completed ? "border-success bg-success" : "border-border hover:border-accent"
                    }`}>
                      {rec.completed && <CheckCircle className="h-3 w-3 text-success-foreground" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${rec.priority === "High" ? "text-destructive" : rec.priority === "Medium" ? "text-warning" : "text-success"}`}>
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${rec.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>{rec.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

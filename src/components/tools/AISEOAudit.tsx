import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, Loader2, ArrowRight, Brain, CheckCircle, Shield, FileText, Link2, Gauge, Code, Eye } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { SEORadarChart } from "@/components/charts/SEORadarChart";
import { InsightList, InsightData } from "@/components/charts/InsightCard";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

const loadingSteps = [
  "Crawling website structure...",
  "Analyzing technical SEO...",
  "Evaluating content quality...",
  "Checking Core Web Vitals...",
  "Validating schema markup...",
  "Assessing backlink profile...",
  "Generating AI insights...",
];

interface AuditResults {
  overall: number;
  technical: number;
  content: number;
  authority: number;
  ux: number;
  speed: number;
  schema: number;
  radarData: { subject: string; value: number; fullMark: number }[];
  issuesBySeverity: { name: string; critical: number; warning: number; info: number }[];
  rankingPotential: { month: string; current: number; potential: number }[];
  insights: InsightData[];
  technicalDetails: { label: string; value: number; maxValue: number }[];
  contentDetails: { label: string; value: number; maxValue: number }[];
  recommendations: { priority: string; title: string; description: string; completed: boolean }[];
}

function generateMockResults(): AuditResults {
  return {
    overall: 67,
    technical: 72,
    content: 58,
    authority: 45,
    ux: 81,
    speed: 74,
    schema: 35,
    radarData: [
      { subject: "Technical", value: 72, fullMark: 100 },
      { subject: "Content", value: 58, fullMark: 100 },
      { subject: "Authority", value: 45, fullMark: 100 },
      { subject: "UX", value: 81, fullMark: 100 },
      { subject: "Speed", value: 74, fullMark: 100 },
      { subject: "Schema", value: 35, fullMark: 100 },
    ],
    issuesBySeverity: [
      { name: "Technical", critical: 4, warning: 8, info: 12 },
      { name: "Content", critical: 2, warning: 14, info: 6 },
      { name: "Authority", critical: 1, warning: 5, info: 8 },
      { name: "UX", critical: 0, warning: 3, info: 5 },
      { name: "Speed", critical: 2, warning: 4, info: 3 },
      { name: "Schema", critical: 5, warning: 7, info: 2 },
    ],
    rankingPotential: [
      { month: "Now", current: 100, potential: 100 },
      { month: "Mo 1", current: 100, potential: 125 },
      { month: "Mo 2", current: 105, potential: 160 },
      { month: "Mo 3", current: 108, potential: 210 },
      { month: "Mo 4", current: 112, potential: 275 },
      { month: "Mo 5", current: 115, potential: 340 },
      { month: "Mo 6", current: 118, potential: 412 },
    ],
    insights: [
      { type: "critical", title: "Weak internal linking structure detected", description: "Your site has isolated content clusters with minimal cross-linking. This limits PageRank distribution and topical authority signals. We found 34 orphan pages with zero internal links.", impact: "High", action: "View detailed link map" },
      { type: "critical", title: "No structured data detected on 87% of pages", description: "Missing schema markup means you're losing rich result opportunities. FAQ, Article, and Product schemas could increase CTR by up to 30%.", impact: "High", action: "Generate schema" },
      { type: "warning", title: "Content depth below competitive threshold", description: "Average word count is 450 words vs competitor average of 1,850. Search engines favor comprehensive content for informational queries.", impact: "Medium", action: "View content gaps" },
      { type: "warning", title: "Core Web Vitals: LCP exceeds threshold", description: "Largest Contentful Paint is 4.2s (threshold: 2.5s). Main bottleneck: unoptimized hero images and render-blocking CSS.", impact: "Medium", action: "Speed recommendations" },
      { type: "opportunity", title: "Untapped long-tail keyword clusters", description: "We identified 23 low-competition keyword clusters with combined monthly volume of 45,000+ that your competitors haven't targeted.", impact: "High", action: "View keywords" },
      { type: "info", title: "Adding FAQ schema could improve CTR by up to 15%", description: "Your service pages have FAQ-style content that isn't marked up. Implementing FAQPage schema could trigger rich snippets.", impact: "Medium" },
    ],
    technicalDetails: [
      { label: "Crawlability", value: 82, maxValue: 100 },
      { label: "Indexation Health", value: 68, maxValue: 100 },
      { label: "URL Structure", value: 75, maxValue: 100 },
      { label: "Canonical Tags", value: 60, maxValue: 100 },
      { label: "XML Sitemap", value: 90, maxValue: 100 },
      { label: "Robots.txt", value: 85, maxValue: 100 },
    ],
    contentDetails: [
      { label: "Keyword Relevance", value: 55, maxValue: 100 },
      { label: "Semantic Coverage", value: 48, maxValue: 100 },
      { label: "Heading Hierarchy", value: 72, maxValue: 100 },
      { label: "Readability", value: 78, maxValue: 100 },
      { label: "Content Depth", value: 42, maxValue: 100 },
      { label: "NLP Alignment", value: 51, maxValue: 100 },
    ],
    recommendations: [
      { priority: "High", title: "Implement comprehensive internal linking", description: "Add contextual links between related content to improve PageRank flow", completed: false },
      { priority: "High", title: "Add structured data to all pages", description: "Implement Article, FAQ, and Organization schema across the site", completed: false },
      { priority: "High", title: "Optimize Core Web Vitals", description: "Compress images, defer non-critical CSS, implement lazy loading", completed: false },
      { priority: "Medium", title: "Expand content depth on key pages", description: "Increase average word count to 1,500+ with semantic keyword coverage", completed: false },
      { priority: "Medium", title: "Fix canonical tag issues", description: "Resolve 12 pages with missing or incorrect canonical tags", completed: false },
      { priority: "Low", title: "Optimize image alt attributes", description: "Add descriptive alt text to 47 images missing attributes", completed: true },
    ],
  };
}

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
  const [results, setResults] = useState<AuditResults | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const analyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
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

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      setResults(generateMockResults());
    }, 4000);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Eye },
    { id: "technical", label: "Technical", icon: Shield },
    { id: "content", label: "Content", icon: FileText },
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
                  {[
                    { label: "Largest Contentful Paint", value: "4.2s", target: "< 2.5s", status: "fail" },
                    { label: "First Input Delay", value: "45ms", target: "< 100ms", status: "pass" },
                    { label: "Cumulative Layout Shift", value: "0.18", target: "< 0.1", status: "fail" },
                    { label: "Time to First Byte", value: "0.8s", target: "< 0.8s", status: "pass" },
                    { label: "First Contentful Paint", value: "2.1s", target: "< 1.8s", status: "warning" },
                  ].map(vital => (
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
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[
                    { metric: "Word Count", yours: 450, competitor: 1850 },
                    { metric: "Headings", yours: 4, competitor: 12 },
                    { metric: "Images", yours: 2, competitor: 8 },
                    { metric: "Internal Links", yours: 3, competitor: 15 },
                    { metric: "External Links", yours: 1, competitor: 6 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                    <XAxis dataKey="metric" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                    <Tooltip {...chartTooltipStyle} />
                    <Bar dataKey="yours" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Your Site" />
                    <Bar dataKey="competitor" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} name="Avg Competitor" opacity={0.5} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* INSIGHTS TAB */}
          {activeTab === "insights" && (
            <div className="glass-card-float p-6">
              <div className="flex items-center gap-2 mb-6">
                <Brain className="h-4 w-4 text-accent" />
                <h3 className="font-display text-sm font-semibold text-foreground">AI-Generated Expert Insights</h3>
              </div>
              <InsightList insights={results.insights} />
            </div>
          )}

          {/* ACTIONS TAB */}
          {activeTab === "actions" && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-6">Prioritized Action Plan</h3>
              <div className="space-y-3">
                {results.recommendations.map((rec, i) => (
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

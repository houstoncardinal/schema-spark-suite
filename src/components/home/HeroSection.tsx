import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Globe, Loader2, CheckCircle, AlertTriangle, XCircle, Search, 
  Brain, Shield, FileText, Gauge, Code, ChevronDown, ChevronRight, Wrench,
  Zap, BarChart3, Eye, Link2
} from "lucide-react";
import { analyzeSEO, type SEOAuditResult, type SEOInsight } from "@/lib/seo-engine";
import { aiSEOApi } from "@/lib/ai-seo-api";
import { firecrawlApi } from "@/lib/firecrawl-api";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { Link } from "react-router-dom";
import CybercoreBackground from "@/components/ui/cybercore-section-hero";

const fixDatabase: Record<string, { fix: string; steps: string[]; impact: string; difficulty: "Easy" | "Medium" | "Hard" }> = {
  "orphan": { fix: "Create internal linking pathways to isolated pages", steps: ["Identify all orphan pages using a crawl tool or sitemap comparison", "Add contextual internal links from high-authority pages to orphaned ones", "Update your sitemap.xml to include all important pages", "Add breadcrumb navigation for hierarchical content"], impact: "Improves crawl coverage by 15-40% and distributes PageRank to previously invisible pages", difficulty: "Easy" },
  "schema": { fix: "Implement structured data markup across all key pages", steps: ["Add Organization schema to your homepage with logo, name, and social profiles", "Implement BreadcrumbList schema on all interior pages", "Add Article/BlogPosting schema to all blog and content pages", "Add FAQ schema to pages with question-answer content", "Validate all schema with Google's Rich Results Test tool"], impact: "Can increase CTR by 15-30% through rich result eligibility", difficulty: "Medium" },
  "LCP": { fix: "Optimize Largest Contentful Paint to under 2.5 seconds", steps: ["Compress and convert images to WebP/AVIF format", "Implement lazy loading for below-the-fold images", "Preload the LCP element (hero image or heading font)", "Minimize render-blocking CSS by inlining critical styles", "Enable server-side caching and use a CDN for static assets"], impact: "Google uses LCP as a direct ranking signal — fixing this can improve positions by 2-5 spots", difficulty: "Medium" },
  "canonical": { fix: "Set correct canonical tags to eliminate duplicate content signals", steps: ["Audit all pages for missing or self-referencing canonical tags", "Add <link rel='canonical'> to every page pointing to the preferred URL", "Ensure canonical URLs use consistent protocol (HTTPS) and trailing slash convention", "Remove conflicting canonical signals from paginated content"], impact: "Eliminates duplicate content penalties and consolidates ranking signals", difficulty: "Easy" },
  "content": { fix: "Expand content depth with semantic keyword coverage", steps: ["Analyze top-ranking competitors for content length and topic coverage", "Add 500-1000 words of semantically relevant content per key page", "Include LSI keywords and entity mentions naturally throughout", "Add expert quotes, data points, and original research where possible", "Structure content with proper H2/H3 headings covering subtopics"], impact: "Pages with comprehensive topical coverage rank 2-3x better for related queries", difficulty: "Medium" },
  "authority": { fix: "Build domain authority through strategic link acquisition", steps: ["Create link-worthy assets (original research, tools, comprehensive guides)", "Pursue guest posting on relevant industry publications", "Reclaim unlinked brand mentions across the web", "Build relationships with journalists and industry thought leaders"], impact: "Every 10-point increase in domain authority correlates with 20-30% more organic traffic", difficulty: "Hard" },
  "keyword": { fix: "Target identified low-competition keyword clusters", steps: ["Group related long-tail keywords into topical clusters", "Create pillar content for each cluster's primary keyword", "Build supporting articles targeting individual long-tail variations", "Interlink cluster content with descriptive anchor text"], impact: "Long-tail clusters can generate 60-70% of total organic traffic with less competition", difficulty: "Medium" },
  "alt": { fix: "Add descriptive alt attributes to all images", steps: ["Audit all images for missing or empty alt attributes", "Write descriptive, keyword-relevant alt text for each image", "Avoid keyword stuffing — describe the image naturally"], impact: "Improves image search visibility and accessibility compliance scores", difficulty: "Easy" },
  "CLS": { fix: "Reduce Cumulative Layout Shift to under 0.1", steps: ["Set explicit width and height attributes on all images and videos", "Reserve space for dynamic content with CSS aspect-ratio", "Avoid inserting content above existing content after page load"], impact: "Reduces user frustration and improves Core Web Vitals ranking signal", difficulty: "Easy" },
  "FID": { fix: "Optimize First Input Delay and interaction responsiveness", steps: ["Split long JavaScript tasks into smaller async chunks", "Defer non-critical third-party scripts", "Use web workers for heavy computational tasks"], impact: "Faster interactivity reduces bounce rate by up to 25%", difficulty: "Medium" },
};

function getFixForIssue(title: string) {
  const lower = title.toLowerCase();
  for (const [key, fix] of Object.entries(fixDatabase)) {
    if (lower.includes(key.toLowerCase())) return fix;
  }
  return { fix: "Address this issue to improve your SEO score", steps: ["Review the specific issue details in the full audit report", "Prioritize based on impact — high-impact fixes first", "Implement changes and re-audit to verify improvements"], impact: "Each resolved issue compounds to improve overall rankings", difficulty: "Medium" as const };
}

function IssueCard({ issue, index }: { issue: SEOInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const fix = getFixForIssue(issue.title);
  const typeConfig = {
    critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/5", border: "border-destructive/15", label: "Critical" },
    warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/5", border: "border-warning/15", label: "Warning" },
    opportunity: { icon: Zap, color: "text-accent", bg: "bg-accent/5", border: "border-accent/15", label: "Opportunity" },
    info: { icon: CheckCircle, color: "text-success", bg: "bg-success/5", border: "border-success/15", label: "Info" },
  };
  const config = typeConfig[issue.type];
  const Icon = config.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
      className={`rounded-2xl border ${config.border} ${config.bg} overflow-hidden transition-all duration-300`}>
      <button onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-foreground/[0.015] transition-colors">
        <Icon className={`h-4 w-4 ${config.color} shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${config.color}`}>{config.label}</span>
            <span className="text-[10px] text-muted-foreground">• Impact: {issue.impact}</span>
          </div>
          <p className="text-sm font-medium text-foreground leading-snug">{issue.title}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{issue.description}</p>
        </div>
        <div className="shrink-0 mt-1">
          {expanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && fix && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-4 pb-4 pt-0 border-t border-border/30">
              <div className="mt-3 rounded-xl bg-background/80 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-3.5 w-3.5 text-accent" />
                  <span className="text-[11px] font-bold text-accent uppercase tracking-wider">Fix</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${fix.difficulty === "Easy" ? "bg-success/10 text-success" : fix.difficulty === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{fix.difficulty}</span>
                </div>
                <p className="text-sm font-medium text-foreground mb-3">{fix.fix}</p>
                <div className="space-y-2 mb-3">
                  {fix.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-accent bg-accent/10 rounded-full h-4 w-4 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-xs text-muted-foreground leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-border/30">
                  <BarChart3 className="h-3 w-3 text-accent shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Expected Impact:</span> {fix.impact}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ScoreBar({ label, score, icon: Icon }: { label: string; score: number; icon: React.ElementType }) {
  const color = score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className="text-xs font-bold text-foreground tabular-nums">{score}</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className={`h-full rounded-full ${color}`} />
        </div>
      </div>
    </div>
  );
}

const loadingSteps = [
  "Resolving DNS & checking SSL...",
  "Crawling site structure & indexation...",
  "Analyzing on-page SEO factors...",
  "Evaluating Core Web Vitals...",
  "Auditing schema & structured data...",
  "Scoring content depth & relevance...",
  "Generating prioritized fix plan...",
];

export function HeroSection() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [results, setResults] = useState<SEOAuditResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setResults(null);
    setErrorMsg(null);
    setLoadingStep(0);
    const interval = setInterval(() => {
      setLoadingStep(prev => { if (prev >= loadingSteps.length - 1) { clearInterval(interval); return prev; } return prev + 1; });
    }, 500);

    try {
      // Real crawl — no fake fallback
      const scrapeResponse = await firecrawlApi.scrape(url);
      const html = scrapeResponse.data?.html || scrapeResponse.data?.data?.html || "";
      const markdown = scrapeResponse.data?.markdown || scrapeResponse.data?.data?.markdown || "";
      const links = scrapeResponse.data?.links || scrapeResponse.data?.data?.links || [];

      if (!html && !markdown) {
        throw new Error("Could not reach that site. Check the URL and try again.");
      }

      const [ai, psiResult] = await Promise.all([
        aiSEOApi.auditSiteReal(url, html, markdown, links),
        supabase.functions.invoke("pagespeed-insights", { body: { url, strategy: "mobile" } })
          .catch(() => ({ data: null })),
      ]);

      const scaffold = analyzeSEO(url);
      if (ai.scores) {
        scaffold.overall = ai.scores.overall;
        scaffold.technical = ai.scores.technical;
        scaffold.content = ai.scores.content;
        scaffold.authority = ai.scores.authority;
        scaffold.ux = ai.scores.ux;
        scaffold.speed = ai.scores.speed;
        scaffold.schema = ai.scores.schema;
      }
      if (ai.insights?.length) scaffold.insights = ai.insights as SEOInsight[];
      if (ai.recommendations?.length) scaffold.recommendations = ai.recommendations;

      const psi = (psiResult as { data?: { success?: boolean; data?: { coreWebVitals?: typeof scaffold.coreWebVitals; scores?: { performance?: number | null } } } })?.data;
      if (psi?.success && psi.data?.coreWebVitals?.length) {
        scaffold.coreWebVitals = psi.data.coreWebVitals;
        if (typeof psi.data.scores?.performance === "number") {
          scaffold.speed = psi.data.scores.performance;
        }
      }

      clearInterval(interval);
      setAnalyzing(false);
      setResults(scaffold);
      toast.success("Live audit complete", {
        description: psi?.success ? "Real crawl + AI + Google PageSpeed" : "Real crawl + AI analysis",
      });
    } catch (err) {
      clearInterval(interval);
      setAnalyzing(false);
      const msg = err instanceof Error ? err.message : "Audit failed";
      setErrorMsg(msg);
      toast.error("Audit failed", { description: msg });
    }
  };

  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-24 md:pt-48 md:pb-32 overflow-hidden" style={{ background: 'hsl(var(--cyber-bg))' }}>
      {/* Cybercore animated background */}
      <CybercoreBackground beamCount={70} />

      <div className="container-wide relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-4xl mx-auto mb-16">
          
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white/80 mb-8 animate-border-dance"
            style={{ background: 'linear-gradient(135deg, hsl(var(--google-blue) / 0.1), hsl(var(--apple-purple) / 0.1))' }}>
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--google-blue))] animate-pulse" />
            AI-Powered SEO Intelligence
          </motion.div>

          <h1 className="headline-hero text-white mb-6">
            Search optimization,{" "}
            <span className="font-serif italic bg-clip-text text-transparent" style={{ backgroundImage: 'var(--gradient-rainbow)', backgroundSize: '300% auto', animation: 'gradient-shift 4s linear infinite' }}>reimagined.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12">
            Enter any URL. Get a detailed, interactive breakdown of every SEO factor — with exact fixes for every issue found.
          </p>

          {/* Premium Search Bar */}
          <div className="max-w-2xl mx-auto px-1">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ boxShadow: '0 0 40px hsl(var(--cyber-light) / 0.12), 0 0 80px hsl(var(--cyber-glow-2) / 0.06)' }}>
              <div className="absolute -inset-px rounded-2xl sm:rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, hsl(var(--cyber-light) / 0.25), hsl(var(--cyber-glow-2) / 0.15), transparent 60%)' }} />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-2 rounded-2xl sm:rounded-3xl bg-white/[0.04] border border-white/10 p-2 backdrop-blur-sm">
                <div className="flex items-center gap-3 flex-1 min-w-0 px-4 sm:px-5">
                  <Globe className="h-5 w-5 text-white/40 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter any domain or URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    className="flex-1 min-w-0 bg-transparent text-base text-white placeholder:text-white/30 outline-none py-3 sm:py-2"
                  />
                </div>
                <button onClick={handleAnalyze} disabled={analyzing}
                  className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 animate-gradient"
                  style={{ backgroundImage: 'var(--gradient-rainbow)', backgroundSize: '300% auto' }}>
                  {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-4 w-4" /> Analyze</>}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {analyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <div className="surface-premium p-10">
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-20 w-20 rounded-full bg-accent/10 animate-ping" />
                </div>
                <div className="relative">
                  <Loader2 className="h-14 w-14 animate-spin text-accent" />
                  <Brain className="h-5 w-5 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
              <div className="space-y-2.5">
                {loadingSteps.map((step, i) => (
                  <motion.div key={step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: i <= loadingStep ? 1 : 0.25, x: 0 }} className="flex items-center gap-3 text-sm">
                    {i < loadingStep ? <CheckCircle className="h-4 w-4 text-success shrink-0" /> : i === loadingStep ? <Loader2 className="h-4 w-4 animate-spin text-accent shrink-0" /> : <div className="h-4 w-4 rounded-full border border-border shrink-0" />}
                    <span className={i <= loadingStep ? "text-foreground font-medium" : "text-muted-foreground"}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && !analyzing && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto">
            <div className="surface-premium p-8 md:p-10">
              {/* Header */}
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10 pb-8 border-b border-border">
                <div className="relative">
                  <div className="absolute inset-0 bg-accent/5 rounded-full blur-2xl scale-150" />
                  <ScoreRing score={results.overall} size={110} strokeWidth={6} />
                </div>
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-xl font-bold text-foreground mb-1.5">
                    Audit Report: <span className="gradient-text">{results.domain}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {results.overall >= 80 ? "Strong foundation — fine-tune for competitive dominance." :
                     results.overall >= 60 ? "Solid base with significant improvement opportunities." :
                     results.overall >= 40 ? "Multiple critical issues limiting your search visibility." :
                     "Urgent attention needed — major SEO barriers detected."}
                  </p>
                  <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
                    {[
                      { label: "Pages", value: results.pageCount },
                      { label: "Indexed", value: results.indexedPages },
                      { label: "Issues", value: results.insights.length },
                      { label: "Fixes", value: results.recommendations.length },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/60 rounded-full px-3 py-1">
                        <span className="font-semibold text-foreground tabular-nums">{s.value}</span>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
                <ScoreBar label="Technical SEO" score={results.technical} icon={Shield} />
                <ScoreBar label="Content Quality" score={results.content} icon={FileText} />
                <ScoreBar label="Domain Authority" score={results.authority} icon={Link2} />
                <ScoreBar label="User Experience" score={results.ux} icon={Eye} />
                <ScoreBar label="Page Speed" score={results.speed} icon={Gauge} />
                <ScoreBar label="Schema Markup" score={results.schema} icon={Code} />
              </div>

              {/* Core Web Vitals */}
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-accent" /> Core Web Vitals
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {results.coreWebVitals.map(vital => (
                    <div key={vital.label} className="rounded-xl bg-secondary/40 border border-border/50 p-4 text-center hover:bg-secondary/60 transition-colors">
                      <span className={`h-2 w-2 rounded-full inline-block mb-2 ${vital.status === "pass" ? "bg-success" : vital.status === "warning" ? "bg-warning" : "bg-destructive"}`} />
                      <p className="text-base font-bold text-foreground tabular-nums">{vital.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 leading-tight">{vital.label}</p>
                      <p className="text-[10px] text-muted-foreground/70">Target: {vital.target}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" /> Issues Found — Click to See Fix
                </h3>
                <p className="text-xs text-muted-foreground mb-4">Step-by-step instructions, difficulty, and expected impact for each</p>
                <div className="space-y-2">
                  {results.insights.map((issue, i) => <IssueCard key={i} issue={issue} index={i} />)}
                </div>
              </div>

              {/* Recommendations */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" /> Prioritized Action Plan
                </h3>
                <div className="space-y-2">
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className={`flex items-start gap-3 rounded-xl border border-border/50 p-4 transition-all duration-300 ${rec.completed ? "bg-success/5" : "bg-secondary/20 hover:bg-secondary/40"}`}>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${rec.priority === "High" ? "bg-destructive/10 text-destructive" : rec.priority === "Medium" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"}`}>{rec.priority}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{rec.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                      </div>
                      {rec.completed && <CheckCircle className="h-4 w-4 text-success shrink-0" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-border">
                <Link to="/tools/ai-audit" className="btn-rainbow gap-2 text-sm">
                  <Brain className="h-3.5 w-3.5" /> Full AI Report <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/contact" className="btn-secondary gap-2 text-sm">
                  <Wrench className="h-3.5 w-3.5" /> Get Expert Help
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Capability Pillars */}
        {!results && !analyzing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Brain, label: "200+ SEO Factors", desc: "Analyzed per audit" },
              { icon: Shield, label: "Real Analysis", desc: "Not simulated data" },
              { icon: Zap, label: "Instant Fixes", desc: "Step-by-step for every issue" },
              { icon: BarChart3, label: "Actionable Intel", desc: "Prioritized by impact" },
            ].map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="text-center p-5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20 transition-all duration-500 backdrop-blur-sm">
                <item.icon className="h-5 w-5 text-[hsl(var(--cyber-light))] mx-auto mb-3" />
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-xs text-white/50 mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

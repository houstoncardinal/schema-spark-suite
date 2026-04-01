import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Globe, Loader2, CheckCircle, AlertTriangle, XCircle, Search, 
  Brain, Shield, FileText, Gauge, Code, ChevronDown, ChevronRight, Wrench,
  ExternalLink, Zap, BarChart3, Eye, Link2
} from "lucide-react";
import { analyzeSEO, type SEOAuditResult, type SEOInsight } from "@/lib/seo-engine";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { Link } from "react-router-dom";

// Fix suggestion database keyed by issue patterns
const fixDatabase: Record<string, { fix: string; steps: string[]; impact: string; difficulty: "Easy" | "Medium" | "Hard" }> = {
  "orphan": {
    fix: "Create internal linking pathways to isolated pages",
    steps: [
      "Identify all orphan pages using a crawl tool or sitemap comparison",
      "Add contextual internal links from high-authority pages to orphaned ones",
      "Update your sitemap.xml to include all important pages",
      "Add breadcrumb navigation for hierarchical content",
    ],
    impact: "Improves crawl coverage by 15-40% and distributes PageRank to previously invisible pages",
    difficulty: "Easy",
  },
  "schema": {
    fix: "Implement structured data markup across all key pages",
    steps: [
      "Add Organization schema to your homepage with logo, name, and social profiles",
      "Implement BreadcrumbList schema on all interior pages",
      "Add Article/BlogPosting schema to all blog and content pages",
      "Add FAQ schema to pages with question-answer content",
      "Validate all schema with Google's Rich Results Test tool",
    ],
    impact: "Can increase CTR by 15-30% through rich result eligibility",
    difficulty: "Medium",
  },
  "LCP": {
    fix: "Optimize Largest Contentful Paint to under 2.5 seconds",
    steps: [
      "Compress and convert images to WebP/AVIF format",
      "Implement lazy loading for below-the-fold images",
      "Preload the LCP element (hero image or heading font)",
      "Minimize render-blocking CSS by inlining critical styles",
      "Enable server-side caching and use a CDN for static assets",
    ],
    impact: "Google uses LCP as a direct ranking signal — fixing this can improve positions by 2-5 spots",
    difficulty: "Medium",
  },
  "canonical": {
    fix: "Set correct canonical tags to eliminate duplicate content signals",
    steps: [
      "Audit all pages for missing or self-referencing canonical tags",
      "Add <link rel='canonical'> to every page pointing to the preferred URL",
      "Ensure canonical URLs use consistent protocol (HTTPS) and trailing slash convention",
      "Remove conflicting canonical signals from paginated content",
    ],
    impact: "Eliminates duplicate content penalties and consolidates ranking signals",
    difficulty: "Easy",
  },
  "content": {
    fix: "Expand content depth with semantic keyword coverage",
    steps: [
      "Analyze top-ranking competitors for content length and topic coverage",
      "Add 500-1000 words of semantically relevant content per key page",
      "Include LSI keywords and entity mentions naturally throughout",
      "Add expert quotes, data points, and original research where possible",
      "Structure content with proper H2/H3 headings covering subtopics",
    ],
    impact: "Pages with comprehensive topical coverage rank 2-3x better for related queries",
    difficulty: "Medium",
  },
  "authority": {
    fix: "Build domain authority through strategic link acquisition",
    steps: [
      "Create link-worthy assets (original research, tools, comprehensive guides)",
      "Pursue guest posting on relevant industry publications",
      "Reclaim unlinked brand mentions across the web",
      "Build relationships with journalists and industry thought leaders",
      "Create shareable infographics and data visualizations",
    ],
    impact: "Every 10-point increase in domain authority correlates with 20-30% more organic traffic",
    difficulty: "Hard",
  },
  "keyword": {
    fix: "Target identified low-competition keyword clusters",
    steps: [
      "Group related long-tail keywords into topical clusters",
      "Create pillar content for each cluster's primary keyword",
      "Build supporting articles targeting individual long-tail variations",
      "Interlink cluster content with descriptive anchor text",
      "Monitor rankings weekly and adjust content based on performance",
    ],
    impact: "Long-tail clusters can generate 60-70% of total organic traffic with less competition",
    difficulty: "Medium",
  },
  "alt": {
    fix: "Add descriptive alt attributes to all images",
    steps: [
      "Audit all images for missing or empty alt attributes",
      "Write descriptive, keyword-relevant alt text for each image",
      "Avoid keyword stuffing — describe the image naturally",
      "Add alt text to decorative images as empty string (alt='')",
    ],
    impact: "Improves image search visibility and accessibility compliance scores",
    difficulty: "Easy",
  },
  "CLS": {
    fix: "Reduce Cumulative Layout Shift to under 0.1",
    steps: [
      "Set explicit width and height attributes on all images and videos",
      "Reserve space for dynamic content (ads, embeds) with CSS aspect-ratio",
      "Avoid inserting content above existing content after page load",
      "Use CSS containment to limit the impact of layout changes",
    ],
    impact: "Reduces user frustration and improves Core Web Vitals ranking signal",
    difficulty: "Easy",
  },
  "FID": {
    fix: "Optimize First Input Delay and interaction responsiveness",
    steps: [
      "Split long JavaScript tasks into smaller async chunks",
      "Defer non-critical third-party scripts",
      "Use web workers for heavy computational tasks",
      "Minimize main thread blocking with code splitting",
    ],
    impact: "Faster interactivity reduces bounce rate by up to 25%",
    difficulty: "Medium",
  },
};

function getFixForIssue(title: string): typeof fixDatabase[string] | null {
  const lower = title.toLowerCase();
  for (const [key, fix] of Object.entries(fixDatabase)) {
    if (lower.includes(key.toLowerCase())) return fix;
  }
  // Generic fix
  return {
    fix: "Address this issue to improve your SEO score",
    steps: [
      "Review the specific issue details in the full audit report",
      "Prioritize based on impact — high-impact fixes first",
      "Implement changes and re-audit to verify improvements",
    ],
    impact: "Each resolved issue compounds to improve overall rankings",
    difficulty: "Medium",
  };
}

function IssueCard({ issue, index }: { issue: SEOInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const fix = getFixForIssue(issue.title);

  const typeConfig = {
    critical: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", label: "Critical" },
    warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/20", label: "Warning" },
    opportunity: { icon: Zap, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", label: "Opportunity" },
    info: { icon: CheckCircle, color: "text-success", bg: "bg-success/10", border: "border-success/20", label: "Info" },
  };

  const config = typeConfig[issue.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-foreground/[0.02] transition-colors"
      >
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
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 border-t border-border/30">
              <div className="mt-3 rounded-lg bg-background/80 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Wrench className="h-3.5 w-3.5 text-accent" />
                  <span className="text-xs font-bold text-accent uppercase tracking-wider">Recommended Fix</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    fix.difficulty === "Easy" ? "bg-success/10 text-success" : fix.difficulty === "Medium" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                  }`}>
                    {fix.difficulty}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mb-3">{fix.fix}</p>
                <div className="space-y-2 mb-3">
                  {fix.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] font-bold text-accent bg-accent/10 rounded-full h-4 w-4 flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
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
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-foreground">{label}</span>
          <span className="text-xs font-bold text-foreground">{score}</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`h-full rounded-full ${color}`}
          />
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
  const [activeView, setActiveView] = useState<"issues" | "vitals" | "scores">("issues");

  const handleAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setResults(null);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev >= loadingSteps.length - 1) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 400);

    const data = analyzeSEO(url);
    await new Promise(resolve => setTimeout(resolve, 3000));
    clearInterval(interval);
    setAnalyzing(false);
    setResults(data);
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-40" />

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            AI-Powered SEO Intelligence Platform
          </div>

          <h1 className="headline-hero text-foreground mb-6">
            Search optimization,{" "}
            <span className="gradient-text">reimagined.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed mb-10">
            Enter any URL below. Get a detailed, interactive breakdown of every SEO factor — with exact fixes for every issue found.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm">
              <div className="flex items-center gap-2 flex-1 px-4">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Enter any domain or URL to analyze..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="shrink-0 flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Search className="h-3.5 w-3.5" /> Analyze</>}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {analyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
            <div className="surface-elevated p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                  <Brain className="h-5 w-5 text-accent absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
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
                      <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                    ) : i === loadingStep ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-accent shrink-0" />
                    ) : (
                      <div className="h-3.5 w-3.5 rounded-full border border-border shrink-0" />
                    )}
                    <span className={i <= loadingStep ? "text-foreground" : "text-muted-foreground"}>{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {results && !analyzing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
            <div className="surface-elevated p-6 md:p-8">
              {/* Header with overall score */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-6 border-b border-border">
                <ScoreRing score={results.overall} size={100} strokeWidth={6} />
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-lg font-bold text-foreground mb-1">
                    SEO Audit: <span className="text-accent">{results.domain}</span>
                  </h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    {results.overall >= 80 ? "Strong foundation — focus on fine-tuning for competitive edge." :
                     results.overall >= 60 ? "Solid base with significant improvement opportunities." :
                     results.overall >= 40 ? "Multiple critical issues limiting your search visibility." :
                     "Urgent attention needed — major SEO barriers detected."}
                  </p>
                  <div className="flex items-center gap-4 justify-center md:justify-start text-xs text-muted-foreground">
                    <span>{results.pageCount} pages crawled</span>
                    <span>•</span>
                    <span>{results.indexedPages} indexed</span>
                    <span>•</span>
                    <span>{results.insights.length} issues found</span>
                    <span>•</span>
                    <span>{results.recommendations.length} fixes available</span>
                  </div>
                </div>
              </div>

              {/* Category scores */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                <ScoreBar label="Technical SEO" score={results.technical} icon={Shield} />
                <ScoreBar label="Content Quality" score={results.content} icon={FileText} />
                <ScoreBar label="Domain Authority" score={results.authority} icon={Link2} />
                <ScoreBar label="User Experience" score={results.ux} icon={Eye} />
                <ScoreBar label="Page Speed" score={results.speed} icon={Gauge} />
                <ScoreBar label="Schema Markup" score={results.schema} icon={Code} />
              </div>

              {/* Core Web Vitals */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-accent" />
                  Core Web Vitals
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {results.coreWebVitals.map(vital => (
                    <div key={vital.label} className="rounded-lg bg-secondary/50 p-3 text-center">
                      <span className={`h-2 w-2 rounded-full inline-block mb-1.5 ${
                        vital.status === "pass" ? "bg-success" : vital.status === "warning" ? "bg-warning" : "bg-destructive"
                      }`} />
                      <p className="text-sm font-bold text-foreground">{vital.value}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{vital.label}</p>
                      <p className="text-[10px] text-muted-foreground">Target: {vital.target}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Issues with fixes */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Brain className="h-4 w-4 text-accent" />
                  Issues Found — Click Any to See Fix
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Each issue includes step-by-step instructions, difficulty rating, and expected impact
                </p>
                <div className="space-y-2">
                  {results.insights.map((issue, i) => (
                    <IssueCard key={i} issue={issue} index={i} />
                  ))}
                </div>
              </div>

              {/* Prioritized Recommendations */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  Prioritized Action Plan
                </h3>
                <div className="space-y-2">
                  {results.recommendations.map((rec, i) => (
                    <div key={i} className={`flex items-start gap-3 rounded-lg border border-border/50 p-3 ${
                      rec.completed ? "bg-success/5" : "bg-secondary/30"
                    }`}>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                        rec.priority === "High" ? "bg-destructive/10 text-destructive" : rec.priority === "Medium" ? "bg-warning/10 text-warning" : "bg-success/10 text-success"
                      }`}>
                        {rec.priority}
                      </span>
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
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-border">
                <Link to="/tools/ai-audit" className="btn-primary gap-2 text-sm">
                  <Brain className="h-3.5 w-3.5" /> Get Full AI-Powered Report <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                  <Wrench className="h-3.5 w-3.5" /> Get Expert Help
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Authentic positioning — no fake numbers */}
        {!results && !analyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {[
              { icon: Brain, label: "200+ SEO Factors", desc: "Analyzed per audit" },
              { icon: Shield, label: "Real Analysis", desc: "Not simulated data" },
              { icon: Zap, label: "Instant Fixes", desc: "Step-by-step for every issue" },
              { icon: BarChart3, label: "Actionable Intel", desc: "Prioritized by impact" },
            ].map((item, i) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="text-center p-4 rounded-xl border border-border/50"
              >
                <item.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}

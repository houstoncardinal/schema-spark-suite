import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Loader2, CheckCircle, AlertTriangle, XCircle, Brain, Sparkles } from "lucide-react";

export function HeroSection() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<null | typeof mockResults>(null);

  const mockResults = {
    score: 78,
    performance: 85,
    seo: 72,
    accessibility: 91,
    issues: [
      { type: "warning" as const, text: "Missing meta description on 3 pages" },
      { type: "error" as const, text: "No structured data detected" },
      { type: "success" as const, text: "SSL certificate is valid" },
      { type: "success" as const, text: "Mobile responsive design detected" },
      { type: "warning" as const, text: "Images missing alt attributes (12)" },
    ],
  };

  const handleAnalyze = () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResults(mockResults);
    }, 2500);
  };

  const getScoreColor = (s: number) => s >= 80 ? "text-green-500" : s >= 60 ? "text-yellow-500" : "text-red-500";
  const getScoreRing = (s: number) => s >= 80 ? "stroke-green-500" : s >= 60 ? "stroke-yellow-500" : "stroke-red-500";

  return (
    <section className="relative overflow-hidden section-padding">
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl" />

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Trusted by 10,000+ SEO professionals
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            The Ultimate{" "}
            <span className="gradient-text">SEO Intelligence</span>{" "}
            Platform
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
            Analyze, optimize, and scale your rankings with advanced tools, data-driven insights, and expert strategy.
          </p>

          <div className="glass-card-elevated p-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 rounded-xl bg-background px-4 py-3">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Enter your website URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="btn-primary-gradient shrink-0 gap-2 px-6 py-3"
              >
                {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Analyze <ArrowRight className="h-4 w-4" /></>}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {(analyzing || results) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {analyzing ? (
              <div className="glass-card p-12 text-center">
                <Loader2 className="h-10 w-10 animate-spin text-accent mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground">Analyzing your website...</p>
                <p className="text-xs text-muted-foreground mt-1">Checking SEO, performance, accessibility & more</p>
              </div>
            ) : results && (
              <div className="glass-card-elevated p-6 md:p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Overall", score: results.score },
                    { label: "Performance", score: results.performance },
                    { label: "SEO Score", score: results.seo },
                    { label: "Accessibility", score: results.accessibility },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="score-ring mx-auto mb-2">
                        <svg className="h-16 w-16">
                          <circle cx="32" cy="32" r="28" fill="none" strokeWidth="4" className="stroke-border" />
                          <circle
                            cx="32" cy="32" r="28" fill="none" strokeWidth="4"
                            className={getScoreRing(item.score)}
                            strokeDasharray={`${(item.score / 100) * 176} 176`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  {results.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-lg bg-background p-3">
                      {issue.type === "success" && <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />}
                      {issue.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0 mt-0.5" />}
                      {issue.type === "error" && <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />}
                      <span className="text-sm text-foreground">{issue.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <a href="/contact" className="btn-primary-gradient text-sm gap-2">
                    Get Full SEO Audit <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "50M+", label: "Pages Analyzed" },
            { value: "10K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9★", label: "User Rating" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

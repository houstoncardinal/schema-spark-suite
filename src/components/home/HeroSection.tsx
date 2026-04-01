import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Loader2, CheckCircle, AlertTriangle, XCircle, Search } from "lucide-react";

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
    setTimeout(() => { setAnalyzing(false); setResults(mockResults); }, 2500);
  };

  const getScoreColor = (s: number) => s >= 80 ? "text-success" : s >= 60 ? "text-warning" : "text-destructive";

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
            Deep analysis, predictive modeling, and schema validation tools that give you an unfair advantage in search.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5 shadow-sm">
              <div className="flex items-center gap-2 flex-1 px-4">
                <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Enter any URL to analyze..."
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

        {/* Results */}
        {(analyzing || results) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
            {analyzing ? (
              <div className="surface-elevated p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
                <p className="text-sm font-medium text-foreground">Analyzing 200+ SEO factors...</p>
                <p className="text-xs text-muted-foreground mt-1">This usually takes a few seconds</p>
              </div>
            ) : results && (
              <div className="surface-elevated p-6">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Overall", score: results.score },
                    { label: "Performance", score: results.performance },
                    { label: "SEO", score: results.seo },
                    { label: "Accessibility", score: results.accessibility },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className={`text-2xl font-bold ${getScoreColor(item.score)}`}>{item.score}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {results.issues.map((issue, i) => (
                    <div key={i} className="flex items-center gap-2.5 rounded-lg bg-secondary px-3 py-2.5">
                      {issue.type === "success" && <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />}
                      {issue.type === "warning" && <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />}
                      {issue.type === "error" && <XCircle className="h-3.5 w-3.5 text-destructive shrink-0" />}
                      <span className="text-sm text-foreground">{issue.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 text-center">
                  <a href="/dashboard" className="btn-primary text-sm gap-2">
                    Get Full Report <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex items-center justify-center gap-12 text-center"
        >
          {[
            { value: "50M+", label: "Pages Analyzed" },
            { value: "10K+", label: "Active Users" },
            { value: "99.9%", label: "Uptime" },
            { value: "4.9★", label: "Rating" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

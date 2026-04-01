import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Loader2, CheckCircle, AlertTriangle, XCircle, Brain, Sparkles, Shield, Zap, BarChart3 } from "lucide-react";

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
  const getScoreRing = (s: number) => s >= 80 ? "stroke-success" : s >= 60 ? "stroke-warning" : "stroke-destructive";

  return (
    <section className="relative overflow-hidden">
      {/* Immersive background */}
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 grid-pattern opacity-[0.04]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-20 blur-[120px]" style={{ background: "hsl(var(--accent))" }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="container-wide relative pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 lg:pb-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-5xl mx-auto mb-14"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-2 text-xs font-medium text-white/80 mb-8"
          >
            <div className="status-dot-live" />
            <span>AI-Powered SEO Intelligence</span>
            <span className="h-3 w-px bg-white/20" />
            <span>Trusted by 10,000+ professionals</span>
          </motion.div>

          <h1 className="headline-hero text-white mb-8">
            The Ultimate{" "}
            <span className="relative">
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-accent)" }}>
                SEO Intelligence
              </span>
            </span>
            <br />
            Operating System
          </h1>

          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed mb-12">
            Deep AI-powered analysis, predictive modeling, and autonomous agents that transform how you dominate search.
          </p>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-2xl bg-white/[0.07] backdrop-blur-2xl border border-white/10 p-2">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-3 flex-1 rounded-xl bg-white/[0.06] px-4 py-3.5">
                  <Globe className="h-4 w-4 text-white/40 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter any URL for instant AI analysis..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                    className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
                  />
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="shrink-0 flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg active:scale-[0.98]"
                >
                  {analyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Brain className="h-4 w-4" /> Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Results */}
        {(analyzing || results) && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {analyzing ? (
              <div className="rounded-2xl bg-white/[0.06] backdrop-blur-2xl border border-white/10 p-14 text-center">
                <div className="relative mx-auto w-16 h-16 mb-6">
                  <div className="absolute inset-0 rounded-full border-2 border-white/10" />
                  <div className="absolute inset-0 rounded-full border-2 border-t-white/80 animate-spin" />
                  <Brain className="absolute inset-0 m-auto h-6 w-6 text-white/60" />
                </div>
                <p className="text-sm font-medium text-white">Running AI-powered deep analysis...</p>
                <p className="text-xs text-white/40 mt-2">Checking 200+ SEO factors across your site</p>
              </div>
            ) : results && (
              <div className="rounded-2xl bg-card/95 backdrop-blur-2xl border border-border/30 p-6 md:p-8" style={{ boxShadow: "var(--shadow-2xl)" }}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Overall", score: results.score },
                    { label: "Performance", score: results.performance },
                    { label: "SEO Score", score: results.seo },
                    { label: "Accessibility", score: results.accessibility },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1, duration: 0.4 }}
                      className="text-center"
                    >
                      <div className="score-ring mx-auto mb-3">
                        <svg className="h-[72px] w-[72px]">
                          <circle cx="36" cy="36" r="30" fill="none" strokeWidth="3" className="stroke-border" />
                          <circle
                            cx="36" cy="36" r="30" fill="none" strokeWidth="3"
                            className={getScoreRing(item.score)}
                            strokeDasharray={`${(item.score / 100) * 188.5} 188.5`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold font-display ${getScoreColor(item.score)}`}>
                          {item.score}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-2">
                  {results.issues.map((issue, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="flex items-start gap-3 rounded-xl bg-secondary/50 p-3.5"
                    >
                      {issue.type === "success" && <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />}
                      {issue.type === "warning" && <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />}
                      {issue.type === "error" && <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
                      <span className="text-sm text-foreground">{issue.text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <a href="/dashboard" className="btn-primary-gradient text-sm gap-2">
                    Get Full Report <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { value: "50M+", label: "Pages Analyzed", icon: BarChart3 },
            { value: "10K+", label: "Active Users", icon: Shield },
            { value: "99.9%", label: "Uptime", icon: Zap },
            { value: "4.9★", label: "User Rating", icon: Sparkles },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="text-center"
            >
              <stat.icon className="h-4 w-4 text-white/30 mx-auto mb-2" />
              <p className="font-display text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/40 mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

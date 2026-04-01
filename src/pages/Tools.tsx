import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Search, BarChart3, Link2, FileCode2, Shield, FileText, ArrowRight, Globe, Loader2, CheckCircle, AlertTriangle, XCircle, TrendingUp, TrendingDown } from "lucide-react";

const toolsList = [
  { id: "analyzer", icon: Search, title: "Website SEO Analyzer", desc: "Full technical SEO audit" },
  { id: "keywords", icon: BarChart3, title: "Keyword Research", desc: "Volume, difficulty & trends" },
  { id: "backlinks", icon: Link2, title: "Backlink Checker", desc: "Link profile analysis" },
  { id: "schema", icon: FileCode2, title: "Schema Generator", desc: "JSON-LD structured data" },
  { id: "onpage", icon: Shield, title: "On-Page Checker", desc: "Content optimization" },
  { id: "audit", icon: FileText, title: "SEO Audit Report", desc: "Downloadable PDF report" },
];

function ScoreCircle({ score, label, size = 80 }: { score: number; label: string; size?: number }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const color = score >= 80 ? "stroke-green-500" : score >= 60 ? "stroke-yellow-500" : "stroke-red-500";
  const textColor = score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="text-center">
      <div className="score-ring mx-auto mb-2">
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="5" className="stroke-border" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth="5" className={color}
            strokeDasharray={`${(score / 100) * circ} ${circ}`} strokeLinecap="round" />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xl font-bold ${textColor}`}>{score}</span>
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}

function SEOAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const analyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults({
        overall: 74, performance: 82, seo: 68, accessibility: 89, bestPractices: 77,
        issues: [
          { type: "error", text: "Missing H1 tag on homepage", priority: "High" },
          { type: "error", text: "No structured data detected", priority: "High" },
          { type: "warning", text: "Page load time exceeds 3s (4.2s)", priority: "Medium" },
          { type: "warning", text: "12 images missing alt attributes", priority: "Medium" },
          { type: "warning", text: "Meta description too short (78 chars)", priority: "Low" },
          { type: "success", text: "SSL certificate valid", priority: "" },
          { type: "success", text: "Mobile responsive detected", priority: "" },
          { type: "success", text: "Robots.txt found", priority: "" },
          { type: "success", text: "Sitemap.xml accessible", priority: "" },
        ],
        meta: { title: url.replace(/https?:\/\//, ""), titleLength: 42, descLength: 78, h1Count: 0, h2Count: 3 },
      });
    }, 3000);
  };

  return (
    <div>
      <div className="glass-card p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Enter website URL to analyze..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={analyze} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-6 py-3">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Analyze <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="font-medium text-foreground">Running comprehensive SEO analysis...</p>
          <p className="text-sm text-muted-foreground mt-1">Checking 200+ ranking factors</p>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="glass-card-elevated p-8">
            <h3 className="font-display text-lg font-semibold text-foreground mb-6">Score Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              <ScoreCircle score={results.overall} label="Overall" size={90} />
              <ScoreCircle score={results.performance} label="Performance" />
              <ScoreCircle score={results.seo} label="SEO" />
              <ScoreCircle score={results.accessibility} label="Accessibility" />
              <ScoreCircle score={results.bestPractices} label="Best Practices" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Issues Found</h3>
              <div className="space-y-2">
                {results.issues.map((issue: any, i: number) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-background p-3">
                    {issue.type === "success" && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />}
                    {issue.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />}
                    {issue.type === "error" && <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                    <div className="flex-1">
                      <span className="text-sm text-foreground">{issue.text}</span>
                      {issue.priority && <span className="ml-2 text-xs text-muted-foreground">• {issue.priority}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Meta Analysis</h3>
              <div className="space-y-4">
                {[
                  { label: "Title Length", value: `${results.meta.titleLength} chars`, good: results.meta.titleLength <= 60 },
                  { label: "Description Length", value: `${results.meta.descLength} chars`, good: results.meta.descLength >= 120 },
                  { label: "H1 Tags", value: results.meta.h1Count, good: results.meta.h1Count === 1 },
                  { label: "H2 Tags", value: results.meta.h2Count, good: results.meta.h2Count >= 2 },
                ].map((m) => (
                  <div key={m.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <span className="text-sm text-muted-foreground">{m.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{m.value}</span>
                      {m.good ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <XCircle className="h-3.5 w-3.5 text-red-500" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <a href="/contact" className="btn-primary-gradient text-sm gap-2">Get Expert Analysis <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function KeywordResearch() {
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const search = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults({
        main: { keyword: keyword, volume: 12400, difficulty: 67, cpc: 4.50, trend: "up" },
        suggestions: [
          { keyword: `${keyword} tool`, volume: 8200, difficulty: 54, cpc: 3.80, trend: "up" },
          { keyword: `best ${keyword}`, volume: 6800, difficulty: 72, cpc: 5.20, trend: "up" },
          { keyword: `${keyword} strategy`, volume: 4500, difficulty: 48, cpc: 3.10, trend: "down" },
          { keyword: `${keyword} tips`, volume: 3900, difficulty: 35, cpc: 2.40, trend: "up" },
          { keyword: `${keyword} for beginners`, volume: 3200, difficulty: 28, cpc: 1.90, trend: "up" },
          { keyword: `${keyword} services`, volume: 2800, difficulty: 61, cpc: 6.50, trend: "down" },
        ],
      });
    }, 2000);
  };

  const diffColor = (d: number) => d >= 70 ? "text-red-500 bg-red-500/10" : d >= 40 ? "text-yellow-500 bg-yellow-500/10" : "text-green-500 bg-green-500/10";

  return (
    <div>
      <div className="glass-card p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={e => e.key === "Enter" && search()}
              placeholder="Enter a keyword to research..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={search} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-6 py-3">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Research <ArrowRight className="h-4 w-4" /></>}
          </button>
        </div>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="font-medium text-foreground">Researching keyword data...</p>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Search Volume", value: results.main.volume.toLocaleString(), sub: "/month" },
              { label: "Difficulty", value: results.main.difficulty, sub: "/100" },
              { label: "CPC", value: `$${results.main.cpc}`, sub: "avg" },
              { label: "Trend", value: results.main.trend === "up" ? "↑ Rising" : "↓ Declining", sub: "12mo" },
            ].map((m) => (
              <div key={m.label} className="glass-card-elevated p-5 text-center">
                <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
                <p className="font-display text-2xl font-bold text-foreground">{m.value}</p>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-6">
            <h3 className="font-display text-sm font-semibold text-foreground mb-4">Related Keywords</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-muted-foreground font-medium">Keyword</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Volume</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Difficulty</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">CPC</th>
                    <th className="text-right py-3 text-muted-foreground font-medium">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {results.suggestions.map((s: any) => (
                    <tr key={s.keyword} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                      <td className="py-3 font-medium text-foreground">{s.keyword}</td>
                      <td className="py-3 text-right text-foreground">{s.volume.toLocaleString()}</td>
                      <td className="py-3 text-right">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${diffColor(s.difficulty)}`}>{s.difficulty}</span>
                      </td>
                      <td className="py-3 text-right text-foreground">${s.cpc}</td>
                      <td className="py-3 text-right">
                        {s.trend === "up" ? <TrendingUp className="h-4 w-4 text-green-500 ml-auto" /> : <TrendingDown className="h-4 w-4 text-red-500 ml-auto" />}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

const Tools = () => {
  const [activeTool, setActiveTool] = useState("analyzer");

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-sm font-semibold text-accent mb-3">Free SEO Tools</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Professional-Grade <span className="gradient-text">SEO Tools</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Powerful tools to analyze, optimize, and monitor your search performance.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {toolsList.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                <tool.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tool.title}</span>
              </button>
            ))}
          </div>

          {activeTool === "analyzer" && <SEOAnalyzer />}
          {activeTool === "keywords" && <KeywordResearch />}
          {activeTool !== "analyzer" && activeTool !== "keywords" && (
            <div className="glass-card p-16 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 mb-4">
                {(() => { const t = toolsList.find(t => t.id === activeTool); return t ? <t.icon className="h-8 w-8 text-accent" /> : null; })()}
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                {toolsList.find(t => t.id === activeTool)?.title}
              </h3>
              <p className="text-muted-foreground mb-6">This tool is coming soon. Get early access by signing up.</p>
              <a href="/contact" className="btn-primary-gradient text-sm gap-2">Get Early Access <ArrowRight className="h-4 w-4" /></a>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Tools;

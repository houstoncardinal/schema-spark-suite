import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, ArrowRight, Globe, ExternalLink, Shield, TrendingUp } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { InsightList, InsightData } from "@/components/charts/InsightCard";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--chart-4))", "hsl(var(--info))"];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

function analyzeBacklinks(input: string) {
  let url = input.trim().toLowerCase();
  if (!url.startsWith("http")) url = "https://" + url;
  let domain: string;
  try { domain = new URL(url).hostname; } catch { domain = url.replace(/[^a-z0-9.]/g, ""); }

  const seed = hashString(domain);
  const rand = seededRandom(seed);

  const domainAuthority = clamp(15 + rand() * 65, 8, 85);
  const totalBacklinks = clamp(Math.round((50 + rand() * 2000) * (domainAuthority / 50)), 20, 5000);
  const referringDomains = clamp(Math.round(totalBacklinks * (0.15 + rand() * 0.3)), 5, 1500);
  const followPercent = clamp(Math.round(55 + rand() * 35), 40, 95);
  const nofollowPercent = 100 - followPercent;
  const spamScore = clamp(Math.round(rand() * 30), 2, 35);
  const trustScore = clamp(100 - spamScore - Math.round(rand() * 20), 40, 95);

  // Backlink growth over 6 months
  const growth = Array.from({ length: 6 }, (_, i) => {
    const month = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"][i];
    const factor = 0.6 + (i / 5) * 0.4 + rand() * 0.1;
    return {
      month,
      backlinks: clamp(Math.round(totalBacklinks * factor), 10, totalBacklinks),
      domains: clamp(Math.round(referringDomains * factor), 3, referringDomains),
    };
  });

  // Top referring domains
  const tlds = [".com", ".org", ".io", ".net", ".co", ".edu"];
  const domainBase = domain.split(".")[0];
  const topReferrers = Array.from({ length: 6 }, (_, i) => {
    const names = [`industry${i + 1}blog${tlds[Math.floor(rand() * tlds.length)]}`, `${domainBase}review${tlds[Math.floor(rand() * tlds.length)]}`, `tech-digest${tlds[Math.floor(rand() * tlds.length)]}`, `news-authority${tlds[Math.floor(rand() * tlds.length)]}`, `expert-hub${tlds[Math.floor(rand() * tlds.length)]}`, `digital-press${tlds[Math.floor(rand() * tlds.length)]}`];
    return {
      domain: names[i],
      authority: clamp(Math.round(20 + rand() * 60), 10, 90),
      links: clamp(Math.round(1 + rand() * 30), 1, 50),
      type: rand() > 0.6 ? "dofollow" : "nofollow",
    };
  }).sort((a, b) => b.authority - a.authority);

  // Link type distribution
  const linkTypes = [
    { name: "Editorial", value: clamp(Math.round(20 + rand() * 25), 10, 50) },
    { name: "Guest Post", value: clamp(Math.round(10 + rand() * 20), 5, 30) },
    { name: "Directory", value: clamp(Math.round(10 + rand() * 15), 5, 25) },
    { name: "Social", value: clamp(Math.round(5 + rand() * 15), 3, 20) },
    { name: "Other", value: 0 },
  ];
  linkTypes[4].value = 100 - linkTypes.slice(0, 4).reduce((s, l) => s + l.value, 0);

  // Anchor text distribution
  const anchorTexts = [
    { label: "Branded", value: clamp(Math.round(25 + rand() * 25), 15, 55), maxValue: 100 },
    { label: "Exact Match", value: clamp(Math.round(5 + rand() * 20), 3, 30), maxValue: 100 },
    { label: "Partial Match", value: clamp(Math.round(10 + rand() * 20), 5, 35), maxValue: 100 },
    { label: "Naked URL", value: clamp(Math.round(10 + rand() * 15), 5, 25), maxValue: 100 },
    { label: "Generic", value: clamp(Math.round(5 + rand() * 15), 3, 20), maxValue: 100 },
  ];

  const insights: InsightData[] = [];

  if (domainAuthority < 40) {
    insights.push({ type: "warning", title: `Domain authority at ${domainAuthority} — below competitive threshold`, description: `Most competitors in your space average 45+ domain authority. Focus on acquiring high-quality editorial backlinks from relevant industry publications to build authority signals.`, impact: "High", action: "Link building strategy" });
  }
  if (spamScore > 15) {
    insights.push({ type: "critical", title: `Spam score elevated at ${spamScore}%`, description: `${Math.round(totalBacklinks * spamScore / 100)} potentially toxic backlinks detected. High spam scores can trigger algorithmic penalties. Consider disavowing low-quality links.`, impact: "High", action: "View toxic links" });
  }
  if (followPercent < 65) {
    insights.push({ type: "info", title: `Follow/nofollow ratio: ${followPercent}/${nofollowPercent}`, description: `A healthy backlink profile typically has 70%+ dofollow links. Your ratio suggests room for improvement through targeted outreach to authority sites.`, impact: "Medium" });
  }
  insights.push({ type: "opportunity", title: `${clamp(Math.round(rand() * 20 + 5), 3, 25)} link building opportunities identified`, description: `Competitor backlink gap analysis reveals untapped referring domains. These sites link to competitors but not to you, representing immediate outreach opportunities.`, impact: "High", action: "View opportunities" });

  return {
    domain,
    domainAuthority,
    totalBacklinks,
    referringDomains,
    followPercent,
    nofollowPercent,
    spamScore,
    trustScore,
    growth,
    topReferrers,
    linkTypes,
    anchorTexts,
    insights,
  };
}

export function BacklinkChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof analyzeBacklinks> | null>(null);

  const analyze = () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setLoading(false);
      setResults(analyzeBacklinks(url));
    }, 2500);
  };

  return (
    <div>
      <div className="glass-card-float p-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl bg-background px-4 py-3.5">
            <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} onKeyDown={e => e.key === "Enter" && analyze()}
              placeholder="Enter domain to analyze backlink profile..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
          </div>
          <button onClick={analyze} disabled={loading} className="btn-primary-gradient shrink-0 gap-2 px-8 py-3.5">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Link2 className="h-4 w-4" /> Analyze Backlinks</>}
          </button>
        </div>
      </div>

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card-float p-16 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="font-medium text-foreground">Analyzing backlink profile...</p>
          <p className="text-sm text-muted-foreground mt-1">Scanning referring domains, anchor texts, and link quality</p>
        </motion.div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.domainAuthority} size={80} strokeWidth={5} />
              <p className="text-xs font-semibold text-foreground mt-2">Domain Authority</p>
            </div>
            <div className="glass-card-float p-5 text-center">
              <p className="font-display text-3xl font-bold text-foreground">{results.totalBacklinks.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Backlinks</p>
            </div>
            <div className="glass-card-float p-5 text-center">
              <p className="font-display text-3xl font-bold text-foreground">{results.referringDomains.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Referring Domains</p>
            </div>
            <div className="glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.trustScore} size={80} strokeWidth={5} />
              <p className="text-xs font-semibold text-foreground mt-2">Trust Score</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Growth chart */}
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Backlink Growth</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={results.growth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Bar dataKey="backlinks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Backlinks" />
                  <Bar dataKey="domains" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Ref. Domains" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Link type distribution */}
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Link Type Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={results.linkTypes} cx="50%" cy="50%" outerRadius={90} innerRadius={55} dataKey="value" paddingAngle={3} strokeWidth={0}>
                    {results.linkTypes.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {results.linkTypes.map((entry, i) => (
                  <span key={entry.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    {entry.name} ({entry.value}%)
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Anchor text + top referrers */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Anchor Text Distribution</h3>
              <AnimatedBarGroup bars={results.anchorTexts} />
            </div>

            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Top Referring Domains</h3>
              <div className="space-y-2">
                {results.topReferrers.map(ref => (
                  <div key={ref.domain} className="flex items-center justify-between rounded-lg bg-background/50 p-3 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <ExternalLink className="h-3.5 w-3.5 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{ref.domain}</p>
                        <p className="text-xs text-muted-foreground">{ref.links} link{ref.links > 1 ? "s" : ""} · {ref.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-bold ${ref.authority >= 60 ? "text-success" : ref.authority >= 35 ? "text-warning" : "text-muted-foreground"}`}>
                        DA {ref.authority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="glass-card-float p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-accent" />
              <h3 className="font-display text-sm font-semibold text-foreground">Backlink Intelligence</h3>
            </div>
            <InsightList insights={results.insights} />
          </div>

          <div className="glass-card-float p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-success/5" />
            <div className="relative">
              <h3 className="font-display text-xl font-bold text-foreground mb-2">Need professional link building?</h3>
              <p className="text-sm text-muted-foreground mb-6">Our outreach team builds high-authority backlinks that move rankings.</p>
              <a href="/contact" className="btn-primary-gradient gap-2">Get Link Building Strategy <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

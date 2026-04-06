import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, ArrowRight, Globe, ExternalLink, Shield, TrendingUp } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { InsightList } from "@/components/charts/InsightCard";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts";
import { aiSEOApi, type AIBacklinkResponse } from "@/lib/ai-seo-api";
import { firecrawlApi } from "@/lib/firecrawl-api";
import { toast } from "sonner";

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--chart-4))", "hsl(var(--info))"];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function BacklinkChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIBacklinkResponse | null>(null);

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);

    try {
      // Step 1: Scrape real page
      const scrapeResponse = await firecrawlApi.scrape(url);
      const html = scrapeResponse.data?.html || scrapeResponse.data?.data?.html || "";
      const markdown = scrapeResponse.data?.markdown || scrapeResponse.data?.data?.markdown || "";
      const links = scrapeResponse.data?.links || scrapeResponse.data?.data?.links || [];

      // Step 2: AI analyzes real link data
      const aiResponse = await aiSEOApi.analyzeBacklinksReal(url, html, markdown, links);
      setResults(aiResponse);
      toast.success("Real backlink analysis complete");
    } catch (err) {
      console.error("Backlink analysis failed:", err);
      toast.error("Analysis failed", { description: "Please check the URL and try again." });
    } finally {
      setLoading(false);
    }
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
          <p className="font-medium text-foreground">Scraping and analyzing real backlink profile...</p>
          <p className="text-sm text-muted-foreground mt-1">Crawling page, analyzing links, and estimating authority signals</p>
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
              <p className="font-display text-3xl font-bold text-foreground">{results.totalBacklinks?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total Backlinks</p>
            </div>
            <div className="glass-card-float p-5 text-center">
              <p className="font-display text-3xl font-bold text-foreground">{results.referringDomains?.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Referring Domains</p>
            </div>
            <div className="glass-card-float p-5 flex flex-col items-center">
              <ScoreRing score={results.trustScore} size={80} strokeWidth={5} />
              <p className="text-xs font-semibold text-foreground mt-2">Trust Score</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Growth chart */}
            {results.growth?.length > 0 && (
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
            )}

            {/* Link type distribution */}
            {results.linkTypes?.length > 0 && (
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
            )}
          </div>

          {/* Anchor text + top referrers */}
          <div className="grid lg:grid-cols-2 gap-6">
            {results.anchorTexts?.length > 0 && (
              <div className="glass-card-float p-6">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">Anchor Text Distribution</h3>
                <AnimatedBarGroup bars={results.anchorTexts} />
              </div>
            )}

            {results.topReferrers?.length > 0 && (
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
            )}
          </div>

          {/* Insights */}
          {results.insights?.length > 0 && (
            <div className="glass-card-float p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-4 w-4 text-accent" />
                <h3 className="font-display text-sm font-semibold text-foreground">Backlink Intelligence</h3>
              </div>
              <InsightList insights={results.insights} />
            </div>
          )}

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

import { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Loader2, ArrowRight, Globe, ExternalLink, Shield, TrendingUp, AlertTriangle, BarChart3, PieChart as PieIcon, Activity } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import { InsightList } from "@/components/charts/InsightCard";
import { AnimatedBarGroup } from "@/components/charts/AnimatedBar";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Legend, ComposedChart, Line, Area, AreaChart } from "recharts";
import { aiSEOApi, type AIBacklinkResponse } from "@/lib/ai-seo-api";
import { firecrawlApi } from "@/lib/firecrawl-api";
import { toast } from "sonner";

const COLORS = ["hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--chart-4))", "hsl(var(--info))", "hsl(var(--destructive))"];

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, fontFamily: "Inter", boxShadow: "0 20px 40px -12px rgba(0,0,0,0.3)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function BacklinkChecker() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AIBacklinkResponse | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const analyze = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setResults(null);
    setActiveTab("overview");

    try {
      const scrapeResponse = await firecrawlApi.scrape(url);
      const html = scrapeResponse.data?.html || scrapeResponse.data?.data?.html || "";
      const markdown = scrapeResponse.data?.markdown || scrapeResponse.data?.data?.markdown || "";
      const links = scrapeResponse.data?.links || scrapeResponse.data?.data?.links || [];

      const aiResponse = await aiSEOApi.analyzeBacklinksReal(url, html, markdown, links);
      setResults(aiResponse);
      toast.success("Deep backlink analysis complete");
    } catch (err) {
      console.error("Backlink analysis failed:", err);
      toast.error("Analysis failed", { description: "Please check the URL and try again." });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "velocity", label: "Link Velocity", icon: Activity },
    { id: "toxic", label: "Toxic Links", icon: AlertTriangle },
    { id: "competitors", label: "Competitors", icon: Globe },
    { id: "distribution", label: "Distribution", icon: PieIcon },
    { id: "intelligence", label: "AI Insights", icon: Shield },
  ];

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
          <p className="font-medium text-foreground">Deep backlink analysis in progress...</p>
          <p className="text-sm text-muted-foreground mt-1">Analyzing link velocity, toxic links, competitor profiles, and TLD distribution</p>
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

          {/* Tabs */}
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
              <div className="grid lg:grid-cols-2 gap-6">
                {results.growth?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Backlink Growth (12 months)</h3>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={results.growth}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                        <Tooltip {...chartTooltipStyle} />
                        <Legend />
                        <Bar dataKey="backlinks" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Backlinks" />
                        <Bar dataKey="domains" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} name="Ref. Domains" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {results.linkTypes?.length > 0 && (
                  <div className="glass-card-float p-6">
                    <h3 className="font-display text-sm font-semibold text-foreground mb-4">Link Type Distribution</h3>
                    <ResponsiveContainer width="100%" height={260}>
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
                          <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />{entry.name} ({entry.value}%)
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
                      {results.topReferrers.map((ref, i) => (
                        <motion.div key={ref.domain} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                          className="flex items-center justify-between rounded-lg bg-background/50 p-3 hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                              <ExternalLink className="h-3.5 w-3.5 text-accent" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{ref.domain}</p>
                              <p className="text-xs text-muted-foreground">{ref.links} link{ref.links > 1 ? "s" : ""} · {ref.type}</p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold ${ref.authority >= 60 ? "text-success" : ref.authority >= 35 ? "text-warning" : "text-muted-foreground"}`}>DA {ref.authority}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Link by page */}
              {results.linkByPage?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Backlinks by Page</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 text-muted-foreground font-medium text-xs">Page</th>
                          <th className="text-right py-3 text-muted-foreground font-medium text-xs">Backlinks</th>
                          <th className="text-right py-3 text-muted-foreground font-medium text-xs">Ref. Domains</th>
                          <th className="text-left py-3 text-muted-foreground font-medium text-xs pl-4">Top Anchor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.linkByPage.map((page, i) => (
                          <motion.tr key={page.page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                            className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                            <td className="py-3 font-medium text-foreground truncate max-w-[200px]">{page.page}</td>
                            <td className="py-3 text-right data-cell text-foreground">{page.backlinks}</td>
                            <td className="py-3 text-right data-cell text-muted-foreground">{page.referringDomains}</td>
                            <td className="py-3 text-left pl-4 text-xs text-muted-foreground truncate max-w-[150px]">{page.topAnchor}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VELOCITY TAB */}
          {activeTab === "velocity" && results.linkVelocity?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-1">Link Velocity</h3>
              <p className="text-xs text-muted-foreground mb-4">Monthly backlinks gained vs lost</p>
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={results.linkVelocity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <Tooltip {...chartTooltipStyle} />
                  <Legend />
                  <Bar dataKey="gained" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Gained" />
                  <Bar dataKey="lost" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} name="Lost" />
                  <Line type="monotone" dataKey="net" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 4 }} name="Net" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* TOXIC TAB */}
          {activeTab === "toxic" && results.toxicLinks?.length > 0 && (
            <div className="glass-card-float p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="font-display text-sm font-semibold text-foreground">Toxic & Suspicious Links</h3>
              </div>
              <div className="space-y-3">
                {results.toxicLinks.map((link, i) => (
                  <motion.div key={link.domain} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    className="rounded-xl border border-border p-4 hover:bg-secondary/20 transition-colors">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{link.domain}</p>
                        <p className="text-xs text-muted-foreground mt-1">{link.reason}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          link.risk === "high" ? "bg-destructive/10 text-destructive" : link.risk === "medium" ? "bg-warning/10 text-warning" : "bg-secondary text-muted-foreground"
                        }`}>{link.risk} risk</span>
                        <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">{link.action}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* COMPETITORS TAB */}
          {activeTab === "competitors" && results.competitorComparison?.length > 0 && (
            <div className="glass-card-float p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Competitor Backlink Comparison</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 text-muted-foreground font-medium text-xs">Domain</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">Backlinks</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">Ref. Domains</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">Common</th>
                      <th className="text-right py-3 text-muted-foreground font-medium text-xs">Unique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.competitorComparison.map((comp, i) => (
                      <motion.tr key={comp.domain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                        className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                        <td className="py-3 font-medium text-foreground flex items-center gap-2">
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />{comp.domain}
                        </td>
                        <td className="py-3 text-right data-cell text-foreground">{comp.backlinks?.toLocaleString()}</td>
                        <td className="py-3 text-right data-cell text-muted-foreground">{comp.referringDomains?.toLocaleString()}</td>
                        <td className="py-3 text-right data-cell text-success">{comp.commonLinks}</td>
                        <td className="py-3 text-right data-cell text-accent">{comp.uniqueLinks}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* DISTRIBUTION TAB */}
          {activeTab === "distribution" && (
            <div className="space-y-6">
              {results.tldDistribution?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">TLD Distribution</h3>
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={results.tldDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                      <XAxis dataKey="tld" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                      <Tooltip {...chartTooltipStyle} />
                      <Bar dataKey="percentage" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="%" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {results.freshness?.length > 0 && (
                <div className="glass-card-float p-6">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Link Freshness</h3>
                  <div className="space-y-3">
                    {results.freshness.map((item, i) => (
                      <motion.div key={item.age} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-3">
                        <span className="text-sm text-foreground w-32 truncate">{item.age}</span>
                        <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.percentage}%` }} transition={{ delay: i * 0.06, duration: 0.5 }}
                            className="h-full rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                        </div>
                        <span className="text-xs data-cell text-muted-foreground w-16 text-right">{item.count} ({item.percentage}%)</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* AI INSIGHTS TAB */}
          {activeTab === "intelligence" && results.insights?.length > 0 && (
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

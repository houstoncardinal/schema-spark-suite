import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Globe, Star, ExternalLink, Eye, ChevronRight, Sparkles, Shield } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import type { PredictiveData } from "@/lib/predictive-engine";

export function SERPSimulatorPanel({ data }: { data: PredictiveData }) {
  const { serpSimulation, serpDominance, contentDepth } = data;
  const [customQuery, setCustomQuery] = useState(serpSimulation.query);

  return (
    <div className="space-y-6">
      {/* Scores row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* SERP Dominance */}
        <div className="glass-card-float p-6">
          <div className="flex items-center gap-4 mb-4">
            <ScoreRing score={serpDominance.overall} size={70} strokeWidth={6} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">SERP Dominance</span>
              <p className="font-display text-xl font-bold text-foreground">{serpDominance.overall}/100</p>
              <p className="text-[10px] text-muted-foreground">Est. CTR: {serpDominance.estimatedCTR}%</p>
            </div>
          </div>
        </div>

        {/* Content Depth */}
        <div className="glass-card-float p-6">
          <div className="flex items-center gap-4 mb-4">
            <ScoreRing score={contentDepth.overall} size={70} strokeWidth={6} />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Content Depth</span>
              <p className="font-display text-xl font-bold text-foreground">{contentDepth.overall}/100</p>
              <p className="text-[10px] text-muted-foreground">Uniqueness: {contentDepth.uniquenessScore}%</p>
            </div>
          </div>
        </div>

        {/* E-E-A-T */}
        <div className="glass-card-float p-6">
          <span className="text-xs font-bold uppercase tracking-wider text-accent">E-E-A-T Signals</span>
          <div className="space-y-2 mt-3">
            {contentDepth.eeatSignals.map((s, i) => (
              <div key={s.signal} className="flex items-center gap-2">
                <span className="text-[10px] text-muted-foreground w-32 truncate">{s.signal}</span>
                <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className={`h-full rounded-full ${s.score > 70 ? "bg-success" : s.score > 40 ? "bg-accent" : "bg-warning"}`}
                    style={{ width: `${s.score}%` }} />
                </div>
                <span className="text-[10px] font-bold text-foreground w-7 text-right">{s.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SERP Feature eligibility */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">SERP Feature Eligibility</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {serpDominance.serpFeatures.map((feature, i) => (
            <motion.div key={feature.feature} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-xl border p-4 ${feature.current ? "border-success/30 bg-success/5" : "border-border/50 bg-background/50"}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">{feature.feature}</span>
                {feature.current ? (
                  <span className="metric-badge-success text-[10px]">Active</span>
                ) : (
                  <span className="text-[10px] text-muted-foreground">Potential</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${feature.potential}%` }} transition={{ delay: i * 0.05, duration: 0.5 }}
                    className={`h-full rounded-full ${feature.potential > 60 ? "bg-success" : feature.potential > 35 ? "bg-accent" : "bg-muted-foreground"}`} />
                </div>
                <span className="text-xs font-bold text-foreground">{feature.potential}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SERP simulation */}
      <div className="glass-card-float p-6">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-accent" />
          <h3 className="font-display text-sm font-semibold text-foreground">SERP Simulation</h3>
        </div>

        {/* Search bar mock */}
        <div className="rounded-full border border-border bg-background px-5 py-3 flex items-center gap-3 mb-6 max-w-2xl">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-foreground">{customQuery}</span>
        </div>

        {/* Featured snippet */}
        {serpSimulation.featuredSnippet && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border-2 border-accent/30 bg-accent/5 p-4 mb-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent">Featured Snippet</span>
            </div>
            <p className="text-sm text-foreground">{serpSimulation.featuredSnippet.content}</p>
            <p className="text-xs text-accent mt-2">{serpSimulation.featuredSnippet.owner}</p>
          </motion.div>
        )}

        {/* FAQ results */}
        {serpSimulation.faqResults.length > 0 && (
          <div className="mb-4 max-w-2xl">
            <p className="text-xs font-semibold text-muted-foreground mb-2">People Also Ask</p>
            <div className="space-y-1">
              {serpSimulation.faqResults.map((faq, i) => (
                <div key={i} className="rounded-lg border border-border/50 px-4 py-2.5 bg-background/80 flex items-center justify-between">
                  <span className="text-sm text-foreground">{faq.question}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search results */}
        <div className="space-y-4 max-w-2xl">
          {serpSimulation.results.map((result, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className={`rounded-xl p-4 transition-all ${result.isYou
                ? "border-2 border-accent/40 bg-accent/5 relative"
                : "border border-border/30 bg-background/50 hover:bg-secondary/30"
              }`}>
              {result.isYou && (
                <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold uppercase">
                  Your Page
                </span>
              )}
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold text-muted-foreground mt-1 w-5">{result.position}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-success truncate">{result.url}</p>
                  <p className={`text-base font-medium mt-0.5 ${result.isYou ? "text-accent" : "text-accent/80"}`}>{result.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{result.description}</p>
                  {result.features.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      {result.features.map(f => (
                        <span key={f} className="text-[10px] font-medium text-accent bg-accent/10 rounded-full px-2 py-0.5">{f}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Related searches */}
        <div className="mt-6 max-w-2xl">
          <p className="text-xs font-semibold text-muted-foreground mb-2">Related Searches</p>
          <div className="flex flex-wrap gap-2">
            {serpSimulation.relatedSearches.map(rs => (
              <span key={rs} className="rounded-full bg-secondary px-3 py-1.5 text-xs text-foreground hover:bg-secondary/80 cursor-pointer transition-colors">
                {rs}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

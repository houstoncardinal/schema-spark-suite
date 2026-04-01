import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, TrendingUp, Zap, Target, ArrowRight, BarChart3 } from "lucide-react";
import { ScoreRing } from "@/components/charts/ScoreRing";
import type { PredictiveData, WhatIfScenario } from "@/lib/predictive-engine";
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function PredictiveModeling({ data }: { data: PredictiveData }) {
  const { trueRank, predictiveModel } = data;
  const [activeScenario, setActiveScenario] = useState<WhatIfScenario | null>(null);

  return (
    <div className="space-y-6">
      {/* TrueRank hero */}
      <div className="glass-card-float p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-success/5" />
        <div className="relative">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="flex items-center gap-6">
              <ScoreRing score={trueRank.overall} size={120} strokeWidth={8} />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="h-4 w-4 text-accent" />
                  <span className="text-xs font-bold uppercase tracking-wider text-accent">TrueRank™ Score</span>
                </div>
                <p className="font-display text-3xl font-bold text-foreground">{trueRank.overall}/100</p>
                <p className="text-sm text-muted-foreground mt-1">Proprietary ranking ability prediction</p>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-background/80 border border-border/30 p-4 text-center">
                <p className="text-2xl font-bold text-success">{trueRank.rankingProbability}%</p>
                <p className="text-[10px] text-muted-foreground mt-1">Top 10 Probability</p>
              </div>
              <div className="rounded-xl bg-background/80 border border-border/30 p-4 text-center">
                <p className="text-2xl font-bold text-accent">#{trueRank.projectedPosition}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Projected Position</p>
              </div>
              <div className="rounded-xl bg-background/80 border border-border/30 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{trueRank.confidence}%</p>
                <p className="text-[10px] text-muted-foreground mt-1">Model Confidence</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranking factors */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">TrueRank™ Factor Breakdown</h3>
        <div className="space-y-3">
          {trueRank.factors.map((factor, i) => (
            <motion.div key={factor.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4">
              <span className="text-sm text-foreground w-48 truncate">{factor.name}</span>
              <div className="flex-1 h-2.5 rounded-full bg-secondary overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${factor.score}%` }} transition={{ delay: i * 0.05, duration: 0.6 }}
                  className={`h-full rounded-full ${factor.score > 70 ? "bg-success" : factor.score > 45 ? "bg-accent" : "bg-warning"}`} />
              </div>
              <span className="text-sm font-bold text-foreground w-10 text-right">{factor.score}</span>
              <span className="text-[10px] text-muted-foreground w-12 text-right">{(factor.weight * 100).toFixed(0)}%</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Traffic forecast */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Traffic Growth Forecast</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={predictiveModel.trafficForecast}>
              <defs>
                <linearGradient id="pmCurGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pmOptGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="pmAggGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip {...chartTooltipStyle} />
              <Legend />
              <Area type="monotone" dataKey="current" stroke="hsl(var(--muted-foreground))" strokeWidth={1.5} fill="url(#pmCurGrad)" name="Current Pace" strokeDasharray="5 5" />
              <Area type="monotone" dataKey="optimized" stroke="hsl(var(--accent))" strokeWidth={2.5} fill="url(#pmOptGrad)" name="Optimized" />
              <Area type="monotone" dataKey="aggressive" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#pmAggGrad)" name="Aggressive" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card-float p-6">
          <h3 className="font-display text-sm font-semibold text-foreground mb-4">Ranking Trajectory Forecast</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={predictiveModel.rankingForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
              <XAxis dataKey="week" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
              <YAxis reversed domain={["dataMin - 2", "dataMax + 2"]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
              <Tooltip {...chartTooltipStyle} />
              <Line type="monotone" dataKey="position" stroke="hsl(var(--accent))" strokeWidth={2.5} dot={{ fill: "hsl(var(--accent))", r: 3 }} name="Predicted Position" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* What-if scenarios */}
      <div className="glass-card-float p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-accent" />
          <h3 className="font-display text-sm font-semibold text-foreground">What-If Scenario Simulator</h3>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {predictiveModel.scenarios.map((scenario, i) => (
            <motion.div key={scenario.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setActiveScenario(activeScenario?.id === scenario.id ? null : scenario)}
              className={`rounded-xl border p-4 cursor-pointer transition-all ${
                activeScenario?.id === scenario.id ? "border-accent bg-accent/5" : "border-border/50 bg-background/50 hover:bg-secondary/30"
              }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  scenario.effort === "low" ? "text-success" : scenario.effort === "medium" ? "text-warning" : "text-destructive"
                }`}>{scenario.effort} effort</span>
                <span className="text-[10px] text-muted-foreground">{scenario.confidence}% conf.</span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-1">{scenario.name}</p>
              <p className="text-xs text-muted-foreground mb-3">{scenario.description}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-success/10 p-2 text-center">
                  <p className="text-sm font-bold text-success">+{scenario.predictedTrafficChange}%</p>
                  <p className="text-[9px] text-muted-foreground">Traffic</p>
                </div>
                <div className="rounded-lg bg-accent/10 p-2 text-center">
                  <p className="text-sm font-bold text-accent">+{scenario.predictedRankChange}</p>
                  <p className="text-[9px] text-muted-foreground">Positions</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                <span>{scenario.timeToResult}</span>
                <span className="font-semibold text-success">{scenario.roi}% ROI</span>
              </div>
            </motion.div>
          ))}
        </div>

        {activeScenario && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
            <h4 className="font-display text-sm font-semibold text-foreground mb-2">{activeScenario.name} — Action Plan</h4>
            <div className="space-y-2">
              {activeScenario.actions.map((action, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                  <div className="h-5 w-5 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xs font-bold">{i + 1}</div>
                  {action}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

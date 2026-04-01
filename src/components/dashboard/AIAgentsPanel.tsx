import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Cpu, Link2, FileCode2, FileText, Activity, CheckCircle, AlertTriangle, Zap, Play, Pause, ChevronDown, ChevronUp, Code } from "lucide-react";
import type { AIAgent, PredictiveData } from "@/lib/predictive-engine";

const agentIcons: Record<string, typeof Bot> = {
  technical: Cpu,
  content: FileText,
  linking: Link2,
  schema: FileCode2,
};

const statusColors: Record<string, string> = {
  active: "bg-success",
  analyzing: "bg-warning",
  idle: "bg-muted-foreground/30",
};

export function AIAgentsPanel({ data }: { data: PredictiveData }) {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(data.aiAgents[0]?.id || null);

  const totalIssues = data.aiAgents.reduce((s, a) => s + a.issuesFound, 0);
  const totalFixed = data.aiAgents.reduce((s, a) => s + a.issuesFixed, 0);
  const activeCount = data.aiAgents.filter(a => a.status === "active" || a.status === "analyzing").length;

  return (
    <div className="space-y-6">
      {/* Status overview */}
      <div className="glass-card-float p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-chart-4/5" />
        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Bot className="h-7 w-7 text-accent" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-foreground">AI SEO Agents</h3>
              <p className="text-sm text-muted-foreground">Autonomous optimization agents working continuously</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-background/80 border border-border/30 p-4 text-center">
              <p className="text-2xl font-bold text-accent">{activeCount}/{data.aiAgents.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Agents Active</p>
            </div>
            <div className="rounded-xl bg-background/80 border border-border/30 p-4 text-center">
              <p className="text-2xl font-bold text-warning">{totalIssues}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Issues Detected</p>
            </div>
            <div className="rounded-xl bg-background/80 border border-border/30 p-4 text-center">
              <p className="text-2xl font-bold text-success">{totalFixed}</p>
              <p className="text-[10px] text-muted-foreground mt-1">Auto-Fixed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent cards */}
      <div className="space-y-4">
        {data.aiAgents.map((agent, i) => {
          const Icon = agentIcons[agent.type] || Bot;
          const expanded = expandedAgent === agent.id;

          return (
            <motion.div key={agent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="glass-card-float overflow-hidden">
              {/* Agent header */}
              <button onClick={() => setExpandedAgent(expanded ? null : agent.id)}
                className="w-full flex items-center gap-4 p-5 hover:bg-secondary/20 transition-colors">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-foreground">{agent.name}</p>
                    <span className={`h-2 w-2 rounded-full ${statusColors[agent.status]} ${agent.status === "active" ? "animate-pulse" : ""}`} />
                    <span className="text-[10px] text-muted-foreground capitalize">{agent.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Last run: {agent.lastRun} • {agent.issuesFound} found • {agent.issuesFixed} fixed</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="metric-badge-warning text-[10px]">{agent.issuesFound} issues</span>
                    <span className="metric-badge-success text-[10px]">{agent.issuesFixed} fixed</span>
                  </div>
                  {expanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }} className="overflow-hidden">
                    <div className="px-5 pb-5 border-t border-border/30 pt-4">
                      <div className="grid lg:grid-cols-2 gap-6">
                        {/* Recommendations */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recommendations</h4>
                          <div className="space-y-3">
                            {agent.recommendations.map((rec, j) => (
                              <div key={j} className="rounded-lg border border-border/50 p-3 bg-background/50">
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-[10px] font-bold uppercase ${
                                    rec.impact === "high" ? "text-destructive" : rec.impact === "medium" ? "text-warning" : "text-success"
                                  }`}>{rec.impact}</span>
                                  {rec.autoFixable && (
                                    <span className="flex items-center gap-1 text-[10px] text-accent font-semibold">
                                      <Zap className="h-3 w-3" /> Auto-fixable
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-foreground">{rec.title}</p>
                                <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                                {rec.code && (
                                  <pre className="mt-2 rounded-lg bg-secondary/80 p-2 text-[10px] font-mono text-muted-foreground overflow-x-auto">
                                    {rec.code}
                                  </pre>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Activity log */}
                        <div>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h4>
                          <div className="space-y-3">
                            {agent.activity.map((act, j) => (
                              <div key={j} className="flex items-start gap-3">
                                <div className="h-6 w-6 rounded-full bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
                                  <Activity className="h-3 w-3 text-accent" />
                                </div>
                                <div>
                                  <p className="text-sm text-foreground">{act.action}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-muted-foreground">{act.time}</span>
                                    <span className="text-[10px] text-accent font-medium">{act.impact}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

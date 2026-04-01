import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";

export interface InsightData {
  type: "critical" | "warning" | "opportunity" | "info";
  title: string;
  description: string;
  impact?: string;
  action?: string;
}

const typeConfig = {
  critical: { icon: AlertTriangle, cardClass: "insight-card insight-card-high", badge: "metric-badge-danger", label: "Critical" },
  warning: { icon: AlertTriangle, cardClass: "insight-card insight-card-medium", badge: "metric-badge-warning", label: "Warning" },
  opportunity: { icon: TrendingUp, cardClass: "insight-card insight-card-low", badge: "metric-badge-success", label: "Opportunity" },
  info: { icon: Lightbulb, cardClass: "insight-card insight-card-info", badge: "metric-badge-info", label: "Insight" },
};

export function InsightCard({ insight, index = 0 }: { insight: InsightData; index?: number }) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className={config.cardClass}
    >
      <div className="flex items-start gap-3">
        <Icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={config.badge}>{config.label}</span>
            {insight.impact && (
              <span className="text-[10px] text-muted-foreground font-medium">Impact: {insight.impact}</span>
            )}
          </div>
          <p className="text-sm font-medium text-foreground mb-1">{insight.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{insight.description}</p>
          {insight.action && (
            <button className="flex items-center gap-1 mt-2 text-xs font-semibold text-accent hover:gap-2 transition-all">
              {insight.action} <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function InsightList({ insights }: { insights: InsightData[] }) {
  return (
    <div className="space-y-3">
      {insights.map((insight, i) => (
        <InsightCard key={i} insight={insight} index={i} />
      ))}
    </div>
  );
}

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  subtitle?: string;
  className?: string;
}

export function MetricCard({ icon: Icon, label, value, change, changePositive, subtitle, className = "" }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass-card-float p-5 group hover:border-accent/30 transition-colors ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/15 transition-colors">
          <Icon className="h-4 w-4 text-accent" />
        </div>
        {change && (
          <span className={`text-xs font-semibold ${changePositive ? "text-success" : "text-destructive"}`}>
            {change}
          </span>
        )}
      </div>
      <p className="font-display text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground/70 mt-1">{subtitle}</p>}
    </motion.div>
  );
}

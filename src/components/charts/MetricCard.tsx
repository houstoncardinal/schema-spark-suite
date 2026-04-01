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
      className={`glass-card-float p-5 group ${className}`}
    >
      <div className="flex items-center justify-between mb-3.5">
        <div className="h-10 w-10 rounded-xl bg-accent/8 flex items-center justify-center group-hover:bg-accent/12 transition-colors duration-300">
          <Icon className="h-[18px] w-[18px] text-accent" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold ${
            changePositive ? "bg-success/8 text-success" : "bg-destructive/8 text-destructive"
          }`}>
            <span>{changePositive ? "↑" : "↓"}</span>
            {change.replace(/^[+-]/, '')}
          </div>
        )}
      </div>
      <p className="font-display text-[1.65rem] font-bold text-foreground tracking-tight leading-none">{value}</p>
      <p className="text-[12px] text-muted-foreground mt-1.5 font-medium">{label}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground/60 mt-0.5">{subtitle}</p>}
    </motion.div>
  );
}

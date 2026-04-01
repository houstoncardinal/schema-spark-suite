import { motion } from "framer-motion";

interface AnimatedBarProps {
  label: string;
  value: number;
  maxValue?: number;
  color?: string;
  showValue?: boolean;
  delay?: number;
}

export function AnimatedBar({ label, value, maxValue = 100, color, showValue = true, delay = 0 }: AnimatedBarProps) {
  const pct = (value / maxValue) * 100;
  const barColor = color || (pct >= 80 ? "bg-success" : pct >= 60 ? "bg-warning" : "bg-destructive");

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-foreground">{label}</span>
        {showValue && <span className="data-cell text-xs text-muted-foreground">{value}/{maxValue}</span>}
      </div>
      <div className="h-2 rounded-full bg-secondary overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barColor}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

export function AnimatedBarGroup({ bars }: { bars: AnimatedBarProps[] }) {
  return (
    <div className="space-y-4">
      {bars.map((bar, i) => (
        <AnimatedBar key={bar.label} {...bar} delay={i * 0.1} />
      ))}
    </div>
  );
}

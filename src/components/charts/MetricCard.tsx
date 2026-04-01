import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
  subtitle?: string;
}

export function MetricCard({ icon: Icon, label, value, change, changePositive, subtitle }: MetricCardProps) {
  return (
    <div className="surface-card p-4">
      <div className="flex items-center justify-between mb-3">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {change && (
          <span className={`text-xs font-medium ${changePositive ? "text-success" : "text-destructive"}`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      {subtitle && <p className="text-[10px] text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
  );
}

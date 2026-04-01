import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown, Bell, Calendar, Filter } from "lucide-react";

interface DashboardHeaderProps {
  projectName: string;
  domain: string;
  projects: { id: string; name: string; domain: string }[];
  activeProject: string;
  onProjectChange: (id: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

const timeRanges = ["7d", "30d", "3m", "6m", "1y"];

export function DashboardHeader({
  projectName, domain, projects, activeProject,
  onProjectChange, timeRange, onTimeRangeChange,
}: DashboardHeaderProps) {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  return (
    <div className="h-14 flex items-center justify-between px-6 border-b border-border/30 bg-background/80 backdrop-blur-xl sticky top-0 z-20">
      {/* Project selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-2 rounded-lg bg-secondary/80 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="font-display font-semibold">{projectName}</span>
            <span className="text-muted-foreground text-xs">{domain}</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          {showProjectDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-border bg-card shadow-lg p-1.5 z-50"
            >
              {projects.map(p => (
                <button
                  key={p.id}
                  onClick={() => { onProjectChange(p.id); setShowProjectDropdown(false); }}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    activeProject === p.id ? "bg-accent/10 text-accent" : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className={`h-2 w-2 rounded-full ${activeProject === p.id ? "bg-accent" : "bg-muted-foreground/30"}`} />
                  <div className="text-left">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.domain}</p>
                  </div>
                </button>
              ))}
              <div className="border-t border-border/50 mt-1 pt-1">
                <button className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  Add project
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg bg-secondary p-0.5">
          {timeRanges.map(r => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                timeRange === r
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <button className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-background" />
        </button>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import {
  LayoutDashboard, Search, TrendingUp, Link2, Shield, FileText,
  Users, CheckSquare, Globe, ChevronLeft, ChevronRight, Settings, HelpCircle, Zap
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "keywords", icon: Search, label: "Keywords" },
  { id: "traffic", icon: TrendingUp, label: "Traffic" },
  { id: "backlinks", icon: Link2, label: "Backlinks" },
  { id: "audit", icon: Shield, label: "Site Audit" },
  { id: "competitors", icon: Users, label: "Competitors" },
  { id: "content", icon: FileText, label: "Content" },
  { id: "tasks", icon: CheckSquare, label: "Tasks" },
];

const bottomItems = [
  { id: "settings", icon: Settings, label: "Settings" },
  { id: "help", icon: HelpCircle, label: "Help" },
];

export function DashboardSidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 64 : 220 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="sticky top-0 h-screen flex flex-col bg-card/95 backdrop-blur-2xl border-r border-border/50 z-30 shrink-0"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border/30">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center">
              <Zap className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-display font-bold text-sm text-foreground">SEOPulse</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="h-7 w-7 rounded-lg bg-accent flex items-center justify-center mx-auto">
            <Zap className="h-4 w-4 text-accent-foreground" />
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative group ${
                active
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-accent"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon className={`h-4 w-4 shrink-0 ${active ? "text-accent" : ""}`} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="py-3 px-2 border-t border-border/30 space-y-0.5">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="h-10 flex items-center justify-center border-t border-border/30 text-muted-foreground hover:text-foreground transition-colors"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </motion.aside>
  );
}

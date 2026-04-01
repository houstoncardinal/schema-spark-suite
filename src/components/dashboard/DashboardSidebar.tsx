import { motion } from "framer-motion";
import {
  LayoutDashboard, Search, TrendingUp, Link2, Shield, FileText,
  Users, CheckSquare, Globe, ChevronLeft, ChevronRight, Settings, HelpCircle, Zap,
  Brain, Bot, Network, Eye
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "truerank", icon: Brain, label: "TrueRank™", badge: "AI" },
  { id: "agents", icon: Bot, label: "AI Agents", badge: "NEW" },
  { id: "keywords", icon: Search, label: "Keywords" },
  { id: "traffic", icon: TrendingUp, label: "Traffic" },
  { id: "backlinks", icon: Link2, label: "Backlinks" },
  { id: "audit", icon: Shield, label: "Site Audit" },
  { id: "competitors", icon: Users, label: "Competitors" },
  { id: "topical", icon: Network, label: "Topical Auth." },
  { id: "serp", icon: Eye, label: "SERP Simulator" },
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
      animate={{ width: collapsed ? 68 : 240 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 h-screen flex flex-col bg-card border-r border-border/40 z-30 shrink-0"
      style={{ boxShadow: "1px 0 0 0 hsl(var(--border) / 0.1)" }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-border/30">
        {!collapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="font-display font-bold text-sm text-foreground tracking-tight">SEOPulse</span>
          </motion.div>
        )}
        {collapsed && (
          <div className="h-8 w-8 rounded-xl flex items-center justify-center mx-auto" style={{ background: "var(--gradient-primary)" }}>
            <Zap className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 relative group ${
                active
                  ? "bg-accent/8 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${active ? "text-accent" : "group-hover:text-foreground"}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && (item as any).badge && (
                <span className={`ml-auto text-[9px] font-bold uppercase tracking-wider rounded-md px-1.5 py-0.5 ${
                  (item as any).badge === "AI" ? "text-accent bg-accent/10" : "text-success bg-success/10"
                }`}>{(item as any).badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom items */}
      <div className="py-3 px-3 border-t border-border/20 space-y-0.5">
        {bottomItems.map((item) => (
          <button
            key={item.id}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-all duration-200"
          >
            <item.icon className="h-[18px] w-[18px] shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggleCollapse}
        className="h-11 flex items-center justify-center border-t border-border/20 text-muted-foreground hover:text-foreground hover:bg-secondary/40 transition-all duration-200"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </motion.aside>
  );
}

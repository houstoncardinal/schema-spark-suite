import {
  LayoutDashboard, Search, BarChart3, Link2, Shield, Users, FileText, CheckSquare, Brain, Bot, Network, Eye,
  ChevronLeft, ChevronRight
} from "lucide-react";

const sections = [
  { id: "overview", icon: LayoutDashboard, label: "Overview" },
  { id: "truerank", icon: Brain, label: "Predictive AI" },
  { id: "agents", icon: Bot, label: "AI Agents" },
  { id: "keywords", icon: Search, label: "Keywords" },
  { id: "traffic", icon: BarChart3, label: "Traffic" },
  { id: "backlinks", icon: Link2, label: "Backlinks" },
  { id: "audit", icon: Shield, label: "Site Audit" },
  { id: "competitors", icon: Users, label: "Competitors" },
  { id: "topical", icon: Network, label: "Topical Map" },
  { id: "serp", icon: Eye, label: "SERP Sim" },
  { id: "content", icon: FileText, label: "Content" },
  { id: "tasks", icon: CheckSquare, label: "Tasks" },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function DashboardSidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <aside className={`hidden md:flex flex-col border-r border-border bg-card transition-all duration-200 ${collapsed ? "w-16" : "w-52"}`}>
      <div className="flex items-center justify-between h-14 px-3 border-b border-border">
        {!collapsed && <img src="/images/logo.png" alt="SEO Cloud Labs" className="h-6" />}
        <button onClick={onToggleCollapse} className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {sections.map(({ id, icon: Icon, label }) => {
          const isActive = activeSection === id;
          return (
            <button
              key={id}
              onClick={() => onSectionChange(id)}
              className={`relative flex items-center gap-2.5 w-full rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors ${
                isActive ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              } ${collapsed ? "justify-center" : ""}`}
              title={collapsed ? label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

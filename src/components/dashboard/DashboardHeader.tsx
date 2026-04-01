import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronDown, Bell, Trash2, LogOut, User, Calendar, Globe } from "lucide-react";

interface DashboardHeaderProps {
  projectName: string;
  domain: string;
  projects: { id: string; name: string; domain: string }[];
  activeProject: string;
  onProjectChange: (id: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onAddProject?: (name: string, domain: string) => Promise<{ error: Error | null }>;
  onDeleteProject?: (id: string) => void;
  canAddMore?: boolean;
  userEmail?: string;
  onSignOut?: () => void;
}

const timeRanges = ["7d", "30d", "3m", "6m", "1y"];

export function DashboardHeader({
  projectName, domain, projects, activeProject,
  onProjectChange, timeRange, onTimeRangeChange,
  onAddProject, onDeleteProject, canAddMore = true,
  userEmail, onSignOut,
}: DashboardHeaderProps) {
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");

  const handleAdd = async () => {
    if (!newName.trim() || !newDomain.trim() || !onAddProject) return;
    const { error } = await onAddProject(newName, newDomain);
    if (!error) {
      setNewName("");
      setNewDomain("");
      setShowAddForm(false);
      setShowProjectDropdown(false);
    }
  };

  return (
    <div className="h-16 flex items-center justify-between px-6 border-b border-border/30 bg-card/80 backdrop-blur-xl sticky top-0 z-20">
      {/* Project selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowProjectDropdown(!showProjectDropdown)}
            className="flex items-center gap-3 rounded-xl bg-secondary/60 hover:bg-secondary px-4 py-2 text-sm font-medium text-foreground transition-all duration-200 border border-border/30"
          >
            <div className="flex items-center gap-2.5">
              <div className="status-dot-live" />
              <div className="text-left">
                <span className="font-display font-semibold text-[13px] block leading-tight">{projectName}</span>
                <span className="text-muted-foreground text-[11px]">{domain}</span>
              </div>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-1" />
          </button>

          <AnimatePresence>
            {showProjectDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-80 rounded-2xl border border-border/40 bg-card p-2 z-50"
                style={{ boxShadow: "var(--shadow-xl)" }}
              >
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Your Projects</p>
                {projects.map(p => (
                  <div key={p.id} className="flex items-center group">
                    <button
                      onClick={() => { onProjectChange(p.id); setShowProjectDropdown(false); }}
                      className={`flex-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
                        activeProject === p.id ? "bg-accent/8 text-accent" : "text-foreground hover:bg-secondary/60"
                      }`}
                    >
                      <Globe className={`h-4 w-4 ${activeProject === p.id ? "text-accent" : "text-muted-foreground"}`} />
                      <div className="text-left">
                        <p className="font-medium text-[13px]">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground">{p.domain}</p>
                      </div>
                    </button>
                    {onDeleteProject && (
                      <button
                        onClick={() => { onDeleteProject(p.id); setShowProjectDropdown(false); }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-all mr-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}

                <div className="separator-gradient my-2" />

                {showAddForm ? (
                  <div className="p-3 space-y-2.5">
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name"
                      className="input-premium py-2 text-[13px]" />
                    <input value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="domain.com"
                      className="input-premium py-2 text-[13px]" />
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddForm(false)}
                        className="flex-1 rounded-xl bg-secondary px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                      <button onClick={handleAdd}
                        className="flex-1 rounded-xl bg-accent text-accent-foreground px-3 py-2 text-xs font-medium hover:bg-accent/90 transition-colors">Create</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => canAddMore ? setShowAddForm(true) : null}
                    disabled={!canAddMore}
                    className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
                      canAddMore ? "text-muted-foreground hover:text-foreground hover:bg-secondary/60" : "text-muted-foreground/40 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {canAddMore ? "Add new project" : "2/2 projects (limit)"}
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {/* Time range */}
        <div className="flex items-center rounded-xl bg-secondary/50 p-1 border border-border/20">
          {timeRanges.map(r => (
            <button
              key={r}
              onClick={() => onTimeRangeChange(r)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-200 ${
                timeRange === r
                  ? "bg-card text-foreground shadow-sm border border-border/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Notifications */}
        <button className="h-9 w-9 rounded-xl bg-secondary/50 border border-border/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200 relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent border-2 border-card" />
        </button>

        {/* User menu */}
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-9 w-9 rounded-xl flex items-center justify-center text-accent transition-all duration-200 border border-accent/20 bg-accent/5 hover:bg-accent/10">
            <User className="h-4 w-4" />
          </button>
          <AnimatePresence>
            {showUserMenu && (
              <motion.div initial={{ opacity: 0, y: -4, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.98 }}
                className="absolute top-full right-0 mt-2 w-60 rounded-2xl border border-border/40 bg-card p-2 z-50"
                style={{ boxShadow: "var(--shadow-xl)" }}>
                {userEmail && (
                  <div className="px-3 py-2.5 mb-1">
                    <p className="text-[11px] text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
                  </div>
                )}
                <div className="separator-gradient my-1" />
                {onSignOut && (
                  <button onClick={() => { onSignOut(); setShowUserMenu(false); }}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-all duration-200">
                    <LogOut className="h-3.5 w-3.5" /> Sign Out
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

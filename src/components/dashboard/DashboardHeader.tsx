import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown, Bell, Trash2, LogOut, User } from "lucide-react";

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
              className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-border bg-card shadow-lg p-1.5 z-50"
            >
              {projects.map(p => (
                <div key={p.id} className="flex items-center group">
                  <button
                    onClick={() => { onProjectChange(p.id); setShowProjectDropdown(false); }}
                    className={`flex-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      activeProject === p.id ? "bg-accent/10 text-accent" : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className={`h-2 w-2 rounded-full ${activeProject === p.id ? "bg-accent" : "bg-muted-foreground/30"}`} />
                    <div className="text-left">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.domain}</p>
                    </div>
                  </button>
                  {onDeleteProject && (
                    <button
                      onClick={() => { onDeleteProject(p.id); setShowProjectDropdown(false); }}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all mr-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}

              <div className="border-t border-border/50 mt-1 pt-1">
                {showAddForm ? (
                  <div className="p-2 space-y-2">
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name"
                      className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-accent" />
                    <input value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="domain.com"
                      className="w-full rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-accent" />
                    <div className="flex gap-2">
                      <button onClick={() => setShowAddForm(false)}
                        className="flex-1 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                      <button onClick={handleAdd}
                        className="flex-1 rounded-lg bg-accent text-accent-foreground px-3 py-1.5 text-xs font-medium">Add</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => canAddMore ? setShowAddForm(true) : null}
                    disabled={!canAddMore}
                    className={`w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                      canAddMore ? "text-muted-foreground hover:text-foreground hover:bg-secondary" : "text-muted-foreground/50 cursor-not-allowed"
                    }`}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    {canAddMore ? "Add project" : "2/2 projects (limit reached)"}
                  </button>
                )}
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
                timeRange === r ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
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

        {/* User menu */}
        <div className="relative">
          <button onClick={() => setShowUserMenu(!showUserMenu)}
            className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent hover:bg-accent/20 transition-colors">
            <User className="h-4 w-4" />
          </button>
          {showUserMenu && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="absolute top-full right-0 mt-1 w-56 rounded-xl border border-border bg-card shadow-lg p-1.5 z-50">
              {userEmail && (
                <div className="px-3 py-2 border-b border-border/50 mb-1">
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              )}
              {onSignOut && (
                <button onClick={() => { onSignOut(); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

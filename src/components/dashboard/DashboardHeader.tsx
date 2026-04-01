import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Plus, Trash2, ChevronDown, LogOut, Loader2 } from "lucide-react";

interface Project {
  id: string;
  name: string;
  domain: string;
}

interface Props {
  projectName: string;
  domain: string;
  projects: Project[];
  activeProject: string;
  onProjectChange: (id: string) => void;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
  onAddProject: (name: string, domain: string) => Promise<{ error: Error | null }>;
  onDeleteProject: (id: string) => Promise<void>;
  canAddMore: boolean;
  userEmail: string;
  onSignOut: () => void;
}

export function DashboardHeader({
  projectName, domain, projects, activeProject, onProjectChange,
  timeRange, onTimeRangeChange,
  onAddProject, onDeleteProject, canAddMore,
  userEmail, onSignOut,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newName.trim() || !newDomain.trim()) return;
    setAdding(true);
    const { error } = await onAddProject(newName, newDomain);
    if (!error) { setNewName(""); setNewDomain(""); setShowAddForm(false); }
    setAdding(false);
  };

  return (
    <header className="flex items-center justify-between h-14 px-6 border-b border-border bg-card">
      <div className="relative">
        <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
          <Globe className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{projectName}</span>
          <span className="text-xs text-muted-foreground">({domain})</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-border bg-card p-2 shadow-lg z-50">
              {projects.map(p => (
                <div key={p.id} className="flex items-center justify-between group">
                  <button onClick={() => { onProjectChange(p.id); setShowDropdown(false); }}
                    className={`flex-1 text-left rounded-lg px-3 py-2 text-sm transition-colors ${p.id === activeProject ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`}>
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">{p.domain}</span>
                  </button>
                  <button onClick={() => onDeleteProject(p.id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-destructive transition-all">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {canAddMore && (
                <>
                  <div className="h-px bg-border my-1" />
                  {showAddForm ? (
                    <div className="p-2 space-y-2">
                      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Project name" className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none" />
                      <input value={newDomain} onChange={e => setNewDomain(e.target.value)} placeholder="domain.com" className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none" />
                      <button onClick={handleAdd} disabled={adding} className="btn-primary w-full text-xs py-1.5">
                        {adding ? <Loader2 className="h-3 w-3 animate-spin" /> : "Add Project"}
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                      <Plus className="h-3.5 w-3.5" /> Add Project
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-border p-0.5">
          {["1m", "3m", "6m", "1y"].map(r => (
            <button key={r} onClick={() => onTimeRangeChange(r)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${timeRange === r ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {r}
            </button>
          ))}
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">{userEmail}</span>
        <button onClick={onSignOut} className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
          <LogOut className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}

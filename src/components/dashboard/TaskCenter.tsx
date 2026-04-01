import { useState } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Check, Zap, Clock, Target } from "lucide-react";
import type { DashboardData, SEOTask } from "@/lib/dashboard-engine";

export function TaskCenter({ data }: { data: DashboardData }) {
  const [tasks, setTasks] = useState<SEOTask[]>(data.tasks);
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filtered = tasks.filter(t => filterPriority === "all" || t.priority === filterPriority);
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Progress overview */}
      <div className="glass-card-float p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-sm font-semibold text-foreground">SEO Task Progress</h3>
          <span className="text-sm font-bold text-accent">{progress}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-secondary overflow-hidden mb-3">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-accent" />
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>{completedCount} of {tasks.length} tasks completed</span>
          <span>•</span>
          <span>{tasks.filter(t => t.priority === "high" && !t.completed).length} high-priority remaining</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        {["all", "high", "medium", "low"].map(p => (
          <button key={p} onClick={() => setFilterPriority(p)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all capitalize ${
              filterPriority === p ? "bg-accent/10 text-accent" : "text-muted-foreground hover:text-foreground bg-secondary/50"
            }`}>{p === "all" ? "All Tasks" : `${p} Priority`}</button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        {filtered.map((task, i) => (
          <motion.div key={task.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className={`glass-card-float p-5 transition-all ${task.completed ? "opacity-60" : ""}`}>
            <div className="flex items-start gap-4">
              <button onClick={() => toggleTask(task.id)}
                className={`mt-0.5 h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                  task.completed ? "bg-accent border-accent" : "border-border hover:border-accent"
                }`}>
                {task.completed && <Check className="h-3 w-3 text-accent-foreground" />}
              </button>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    task.priority === "high" ? "text-destructive" : task.priority === "medium" ? "text-warning" : "text-success"
                  }`}>{task.priority}</span>
                  <span className="text-[10px] text-muted-foreground">• {task.category}</span>
                </div>
                <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1 text-[10px] text-accent font-semibold">
                    <Zap className="h-3 w-3" /> {task.impact}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> {task.effort}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

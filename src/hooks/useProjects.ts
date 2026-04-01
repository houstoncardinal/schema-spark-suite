import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Tables } from "@/integrations/supabase/types";
import { toast } from "sonner";

type Project = Tables<"projects">;

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to fetch projects:", error);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, [user?.id]);

  const addProject = async (name: string, domain: string) => {
    if (!user) return { error: new Error("Not authenticated") };
    if (projects.length >= 2) {
      toast.error("Project limit reached", { description: "Free plan allows up to 2 projects." });
      return { error: new Error("Max 2 projects") };
    }

    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();

    const { data, error } = await supabase
      .from("projects")
      .insert({ user_id: user.id, name, domain: cleanDomain })
      .select()
      .single();

    if (error) {
      toast.error("Failed to create project", { description: error.message });
      return { error };
    }

    setProjects(prev => [...prev, data]);
    toast.success("Project created", { description: `Now tracking ${cleanDomain}` });
    return { error: null, data };
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete project", { description: error.message });
      return;
    }
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success("Project deleted");
  };

  const updateProject = async (id: string, updates: { name?: string; domain?: string }) => {
    const { error } = await supabase.from("projects").update(updates).eq("id", id);
    if (error) {
      toast.error("Failed to update project", { description: error.message });
      return;
    }
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  return { projects, loading, addProject, deleteProject, updateProject, refetch: fetchProjects };
}

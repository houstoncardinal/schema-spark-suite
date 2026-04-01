import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProjects } from "@/hooks/useProjects";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { OverviewPanel } from "@/components/dashboard/OverviewPanel";
import { KeywordTracker } from "@/components/dashboard/KeywordTracker";
import { TrafficAnalytics } from "@/components/dashboard/TrafficAnalytics";
import { BacklinkAnalytics } from "@/components/dashboard/BacklinkAnalytics";
import { SiteAuditPanel } from "@/components/dashboard/SiteAuditPanel";
import { CompetitorAnalysis } from "@/components/dashboard/CompetitorAnalysis";
import { ContentPerformance } from "@/components/dashboard/ContentPerformance";
import { TaskCenter } from "@/components/dashboard/TaskCenter";
import { PredictiveModeling } from "@/components/dashboard/PredictiveModeling";
import { AIAgentsPanel } from "@/components/dashboard/AIAgentsPanel";
import { TopicalAuthorityPanel } from "@/components/dashboard/TopicalAuthorityPanel";
import { SERPSimulatorPanel } from "@/components/dashboard/SERPSimulatorPanel";
import { generateDashboardData } from "@/lib/dashboard-engine";
import { generatePredictiveData } from "@/lib/predictive-engine";
import { Loader2 } from "lucide-react";

const sectionTitles: Record<string, string> = {
  overview: "Dashboard Overview",
  truerank: "TrueRank™ Predictive Intelligence",
  agents: "AI SEO Agents",
  keywords: "Keyword Tracking",
  traffic: "Traffic Analytics",
  backlinks: "Backlink Analytics",
  audit: "Site Audit",
  competitors: "Competitor Analysis",
  topical: "Topical Authority Map",
  serp: "SERP Simulator & Dominance",
  content: "Content Performance",
  tasks: "Tasks & Recommendations",
};

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { projects, loading: projLoading, addProject, deleteProject } = useProjects();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [timeRange, setTimeRange] = useState("3m");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (authLoading || projLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If user has projects, use the first one; otherwise show onboarding
  const currentProject = projects.find(p => p.id === activeProject) || projects[0] || null;

  // If no active project set but projects exist, auto-select
  if (!activeProject && currentProject) {
    setActiveProject(currentProject.id);
  }

  const headerProjects = projects.map(p => ({ id: p.id, name: p.name, domain: p.domain }));

  const dashboardData = useMemo(
    () => currentProject ? generateDashboardData(currentProject.domain) : null,
    [currentProject?.domain]
  );

  const predictiveData = useMemo(
    () => currentProject && dashboardData
      ? generatePredictiveData(currentProject.domain, dashboardData.project.healthScore, dashboardData.project.domainAuthority, dashboardData.project.organicTraffic)
      : null,
    [currentProject?.domain, dashboardData]
  );

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          projectName={currentProject?.name || "No Project"}
          domain={currentProject?.domain || "—"}
          projects={headerProjects}
          activeProject={activeProject || ""}
          onProjectChange={setActiveProject}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onAddProject={addProject}
          onDeleteProject={deleteProject}
          canAddMore={projects.length < 2}
          userEmail={user?.email || ""}
          onSignOut={async () => {
            const { supabase } = await import("@/integrations/supabase/client");
            await supabase.auth.signOut();
          }}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1400px] mx-auto">
            {!currentProject ? (
              <OnboardingPanel onAddProject={addProject} />
            ) : (
              <>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={activeSection} className="mb-6">
                  <h2 className="font-display text-xl font-bold text-foreground">{sectionTitles[activeSection] || "Dashboard"}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{currentProject.domain} • {timeRange} view</p>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25 }}
                  >
                    {dashboardData && (
                      <>
                        {activeSection === "overview" && <OverviewPanel data={dashboardData} />}
                        {activeSection === "keywords" && <KeywordTracker data={dashboardData} />}
                        {activeSection === "traffic" && <TrafficAnalytics data={dashboardData} />}
                        {activeSection === "backlinks" && <BacklinkAnalytics data={dashboardData} />}
                        {activeSection === "audit" && <SiteAuditPanel data={dashboardData} />}
                        {activeSection === "competitors" && <CompetitorAnalysis data={dashboardData} />}
                        {activeSection === "content" && <ContentPerformance data={dashboardData} />}
                        {activeSection === "tasks" && <TaskCenter data={dashboardData} />}
                      </>
                    )}
                    {predictiveData && (
                      <>
                        {activeSection === "truerank" && <PredictiveModeling data={predictiveData} />}
                        {activeSection === "agents" && <AIAgentsPanel data={predictiveData} />}
                        {activeSection === "topical" && <TopicalAuthorityPanel data={predictiveData} />}
                        {activeSection === "serp" && <SERPSimulatorPanel data={predictiveData} />}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Onboarding for users with no projects
function OnboardingPanel({ onAddProject }: { onAddProject: (name: string, domain: string) => Promise<{ error: Error | null }> }) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !domain.trim()) return;
    setLoading(true);
    await onAddProject(name, domain);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto mt-20">
      <div className="text-center mb-8">
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">Welcome to SEOPulse! 🚀</h2>
        <p className="text-sm text-muted-foreground">Add your first website to start tracking SEO performance.</p>
        <p className="text-xs text-muted-foreground mt-1">Free plan: up to 2 projects</p>
      </div>

      <div className="glass-card-elevated p-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Project Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="My Website"
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Domain</label>
            <input
              value={domain}
              onChange={e => setDomain(e.target.value)}
              placeholder="example.com"
              required
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary-gradient w-full gap-2 py-3">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Project"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}

export default Dashboard;

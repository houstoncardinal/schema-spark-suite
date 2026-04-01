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
import { Loader2, Globe, ArrowRight } from "lucide-react";

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  overview: { title: "Overview", subtitle: "Your SEO performance at a glance" },
  truerank: { title: "Predictive Intelligence", subtitle: "AI-powered ranking forecasts" },
  agents: { title: "AI Agents", subtitle: "Autonomous agents working for your rankings" },
  keywords: { title: "Keywords", subtitle: "Monitor keyword positions" },
  traffic: { title: "Traffic", subtitle: "Traffic source and trend analysis" },
  backlinks: { title: "Backlinks", subtitle: "Link intelligence and authority" },
  audit: { title: "Site Audit", subtitle: "Technical SEO health" },
  competitors: { title: "Competitors", subtitle: "Competitive intelligence" },
  topical: { title: "Topical Authority", subtitle: "Content cluster mapping" },
  serp: { title: "SERP Simulator", subtitle: "Search appearance optimization" },
  content: { title: "Content", subtitle: "Content performance analytics" },
  tasks: { title: "Tasks", subtitle: "Prioritized action items" },
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { projects, loading: projLoading, addProject, deleteProject } = useProjects();
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [timeRange, setTimeRange] = useState("3m");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentProject = projects.find(p => p.id === activeProject) || projects[0] || null;
  const effectiveActiveProject = activeProject || currentProject?.id || "";

  const dashboardData = useMemo(() => currentProject ? generateDashboardData(currentProject.domain) : null, [currentProject?.domain]);
  const predictiveData = useMemo(() => currentProject && dashboardData
    ? generatePredictiveData(currentProject.domain, dashboardData.project.healthScore, dashboardData.project.domainAuthority, dashboardData.project.organicTraffic) : null,
    [currentProject?.domain, dashboardData]);

  if (!authLoading && !user) return <Navigate to="/auth" replace />;

  if (authLoading || projLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-foreground">Loading workspace...</p>
        </div>
      </div>
    );
  }

  const headerProjects = projects.map(p => ({ id: p.id, name: p.name, domain: p.domain }));
  const sectionInfo = sectionTitles[activeSection] || { title: "Dashboard", subtitle: "" };

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
          activeProject={effectiveActiveProject}
          onProjectChange={(id) => setActiveProject(id)}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          onAddProject={addProject}
          onDeleteProject={deleteProject}
          canAddMore={projects.length < 2}
          userEmail={user?.email || ""}
          onSignOut={signOut}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
            {!currentProject ? (
              <OnboardingPanel onAddProject={addProject} />
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-foreground">{sectionInfo.title}</h2>
                  <p className="text-sm text-muted-foreground">{sectionInfo.subtitle}</p>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={activeSection} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Add your first project</h2>
          <p className="text-sm text-muted-foreground">Enter your website to start tracking SEO performance.</p>
        </div>
        <div className="surface-elevated p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Project Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="My Website" required className="input-premium" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1.5 block">Domain</label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" required className="input-premium pl-9" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create Project <ArrowRight className="h-3.5 w-3.5" /></>}
            </button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-4">2 free projects per account</p>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;

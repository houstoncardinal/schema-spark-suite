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
import { Loader2, Zap, Globe, ArrowRight, Sparkles, Brain, Shield } from "lucide-react";

const sectionTitles: Record<string, { title: string; subtitle: string }> = {
  overview: { title: "Dashboard Overview", subtitle: "Your SEO performance at a glance" },
  truerank: { title: "TrueRank™ Predictive Intelligence", subtitle: "AI-powered ranking forecasts and predictions" },
  agents: { title: "AI SEO Agents", subtitle: "Autonomous agents working for your rankings" },
  keywords: { title: "Keyword Tracking", subtitle: "Monitor and analyze keyword positions" },
  traffic: { title: "Traffic Analytics", subtitle: "Deep traffic source and trend analysis" },
  backlinks: { title: "Backlink Analytics", subtitle: "Authority building and link intelligence" },
  audit: { title: "Site Audit", subtitle: "Technical SEO health and issue tracking" },
  competitors: { title: "Competitor Analysis", subtitle: "Competitive intelligence and gap analysis" },
  topical: { title: "Topical Authority Map", subtitle: "Content cluster and authority mapping" },
  serp: { title: "SERP Simulator & Dominance", subtitle: "Search appearance optimization" },
  content: { title: "Content Performance", subtitle: "Content optimization and analytics" },
  tasks: { title: "Tasks & Recommendations", subtitle: "Prioritized SEO action items" },
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

  if (!authLoading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (authLoading || projLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="relative mx-auto w-14 h-14 mb-5">
            <div className="absolute inset-0 rounded-full border-2 border-border" />
            <div className="absolute inset-0 rounded-full border-2 border-t-accent animate-spin" />
            <Zap className="absolute inset-0 m-auto h-5 w-5 text-accent" />
          </div>
          <p className="text-sm font-medium text-foreground">Loading your workspace...</p>
          <p className="text-xs text-muted-foreground mt-1">Preparing SEO intelligence</p>
        </motion.div>
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
          <div className="p-6 lg:p-8 max-w-[1440px] mx-auto">
            {!currentProject ? (
              <OnboardingPanel onAddProject={addProject} />
            ) : (
              <>
                {/* Section header */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={activeSection}
                  className="mb-8"
                >
                  <h2 className="font-display text-2xl font-bold text-foreground tracking-tight">{sectionInfo.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{sectionInfo.subtitle}</p>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSection}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
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
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-6" style={{ background: "var(--gradient-accent)" }}>
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground mb-3 tracking-tight">Welcome to SEOPulse</h2>
          <p className="text-muted-foreground leading-relaxed">
            Add your first website to unlock AI-powered SEO intelligence and start climbing the rankings.
          </p>
        </div>

        <div className="glass-card-premium p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-[13px] font-medium text-foreground mb-2 block">Project Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="My Website" required
                className="input-premium" />
            </div>
            <div>
              <label className="text-[13px] font-medium text-foreground mb-2 block">Domain</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input value={domain} onChange={e => setDomain(e.target.value)} placeholder="example.com" required
                  className="input-premium pl-10" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary-gradient w-full gap-2 py-3.5">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>Create Project <ArrowRight className="h-4 w-4" /></>
              )}
            </button>
          </form>

          <div className="separator-gradient my-6" />

          <div className="flex items-center justify-center gap-5 text-muted-foreground">
            <div className="flex items-center gap-1.5 text-[11px]"><Shield className="h-3.5 w-3.5" /> 2 Free Projects</div>
            <div className="flex items-center gap-1.5 text-[11px]"><Brain className="h-3.5 w-3.5" /> AI Analysis</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;

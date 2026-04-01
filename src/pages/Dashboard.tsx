import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const defaultProjects = [
  { id: "seopulse-io", name: "SEOPulse", domain: "seopulse.io" },
  { id: "acme-com", name: "Acme Corp", domain: "acme.com" },
  { id: "techblog-dev", name: "TechBlog", domain: "techblog.dev" },
];

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
  const [activeProject, setActiveProject] = useState(defaultProjects[0].id);
  const [activeSection, setActiveSection] = useState("overview");
  const [timeRange, setTimeRange] = useState("3m");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const currentProject = defaultProjects.find(p => p.id === activeProject) || defaultProjects[0];
  const dashboardData = useMemo(() => generateDashboardData(currentProject.domain), [currentProject.domain]);
  const predictiveData = useMemo(() => generatePredictiveData(
    currentProject.domain,
    dashboardData.project.healthScore,
    dashboardData.project.domainAuthority,
    dashboardData.project.organicTraffic
  ), [currentProject.domain, dashboardData]);

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
          projectName={currentProject.name}
          domain={currentProject.domain}
          projects={defaultProjects}
          activeProject={activeProject}
          onProjectChange={setActiveProject}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 max-w-[1400px] mx-auto">
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
                {activeSection === "overview" && <OverviewPanel data={dashboardData} />}
                {activeSection === "truerank" && <PredictiveModeling data={predictiveData} />}
                {activeSection === "agents" && <AIAgentsPanel data={predictiveData} />}
                {activeSection === "keywords" && <KeywordTracker data={dashboardData} />}
                {activeSection === "traffic" && <TrafficAnalytics data={dashboardData} />}
                {activeSection === "backlinks" && <BacklinkAnalytics data={dashboardData} />}
                {activeSection === "audit" && <SiteAuditPanel data={dashboardData} />}
                {activeSection === "competitors" && <CompetitorAnalysis data={dashboardData} />}
                {activeSection === "topical" && <TopicalAuthorityPanel data={predictiveData} />}
                {activeSection === "serp" && <SERPSimulatorPanel data={predictiveData} />}
                {activeSection === "content" && <ContentPerformance data={dashboardData} />}
                {activeSection === "tasks" && <TaskCenter data={dashboardData} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

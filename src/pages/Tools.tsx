import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, Link2, FileCode2, FileText, Brain, Cloud, 
  ChevronLeft, ChevronRight, Search, Globe, Zap, Target,
  PanelLeftClose, PanelLeft
} from "lucide-react";
import { AISEOAudit } from "@/components/tools/AISEOAudit";
import { KeywordResearchTool } from "@/components/tools/KeywordResearchTool";
import { ContentAnalyzer } from "@/components/tools/ContentAnalyzer";
import { EnvironmentalAnalysis } from "@/components/tools/EnvironmentalAnalysis";
import { SchemaGenerator } from "@/components/tools/SchemaGenerator";
import { BacklinkChecker } from "@/components/tools/BacklinkChecker";

const toolsList = [
  { id: "ai-audit", icon: Brain, title: "AI SEO Audit", desc: "200+ factor deep analysis", accent: "text-accent", metaTitle: "Free AI SEO Audit Tool — 200+ Factor Analysis | SEO Cloud Lab", metaDesc: "Run a comprehensive AI-powered SEO audit with 200+ ranking factors. Get detailed scores for technical SEO, content, authority, UX, speed, and schema markup." },
  { id: "keywords", icon: Search, title: "Keyword Research", desc: "Volume, difficulty & trends", accent: "text-chart-5", metaTitle: "Keyword Research Tool — Volume, Difficulty & Trends | SEO Cloud Lab", metaDesc: "Discover high-impact keywords with search volume, difficulty scores, CPC data, and trend analysis. Find untapped keyword opportunities for organic growth." },
  { id: "environment", icon: Target, title: "Market Analysis", desc: "Competitive landscape", accent: "text-chart-4", metaTitle: "Competitive Market Analysis — SEO Landscape Tool | SEO Cloud Lab", metaDesc: "Analyze your competitive SEO landscape. Understand market positioning, competitor strategies, and identify gaps to outrank your competition." },
  { id: "content", icon: FileText, title: "Content Analyzer", desc: "NLP & readability scoring", accent: "text-success", metaTitle: "Content Analyzer — NLP & Readability Scoring | SEO Cloud Lab", metaDesc: "Analyze your content with NLP scoring, readability metrics, keyword density, and topical coverage analysis. Optimize content for maximum search visibility." },
  { id: "backlinks", icon: Link2, title: "Backlink Checker", desc: "Link profile & toxicity", accent: "text-warning", metaTitle: "Backlink Checker — Link Profile & Toxicity Analysis | SEO Cloud Lab", metaDesc: "Analyze your backlink profile with toxicity scoring, anchor text distribution, referring domain quality, and link velocity tracking." },
  { id: "schema", icon: FileCode2, title: "Schema Generator", desc: "JSON-LD structured data", accent: "text-info", metaTitle: "Schema Markup Generator — JSON-LD Builder | SEO Cloud Lab", metaDesc: "Generate valid JSON-LD schema markup for rich search results. Support for Article, Product, LocalBusiness, FAQ, Organization, and more schema types." },
];

const Tools = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [activeTool, setActiveTool] = useState(toolId || "ai-audit");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (toolId && toolId !== activeTool) {
      setActiveTool(toolId);
    }
  }, [toolId]);

  const selectTool = (id: string) => {
    setActiveTool(id);
    navigate(`/tools/${id}`, { replace: true });
  };

  const activeToolData = toolsList.find(t => t.id === activeTool) || toolsList[0];

  const toolsJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: activeToolData.title,
    description: activeToolData.metaDesc,
    url: `https://seocloudlab.io/tools/${activeToolData.id}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    provider: { "@type": "Organization", name: "SEO Cloud Lab", url: "https://seocloudlab.io" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://seocloudlab.io/" },
      { "@type": "ListItem", position: 2, name: "Tools", item: "https://seocloudlab.io/tools" },
      { "@type": "ListItem", position: 3, name: activeToolData.title, item: `https://seocloudlab.io/tools/${activeToolData.id}` },
    ],
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Helmet>
        <title>{activeToolData.metaTitle}</title>
        <meta name="description" content={activeToolData.metaDesc} />
        <link rel="canonical" href={`https://seocloudlab.io/tools/${activeToolData.id}`} />
        <meta property="og:title" content={activeToolData.metaTitle} />
        <meta property="og:description" content={activeToolData.metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://seocloudlab.io/tools/${activeToolData.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={activeToolData.metaTitle} />
        <script type="application/ld+json">{JSON.stringify(toolsJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full z-40 border-r border-border bg-card/80 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        sidebarCollapsed ? "w-[68px]" : "w-[260px]"
      }`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[hsl(var(--google-blue))] to-[hsl(var(--apple-purple))] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Cloud className="h-4 w-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <span className="text-sm font-bold text-foreground tracking-tight">SEO Cloud Lab</span>
            )}
          </Link>
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            {sidebarCollapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        </div>

        <nav className="p-3 space-y-1" aria-label="Tools navigation">
          {!sidebarCollapsed && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground px-3 mb-3">
              Analysis Tools
            </p>
          )}
          {toolsList.map((tool) => {
            const isActive = activeTool === tool.id;
            return (
              <button key={tool.id} onClick={() => selectTool(tool.id)}
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative ${
                  isActive ? "bg-accent/8 text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
                title={sidebarCollapsed ? tool.title : undefined}
                aria-current={isActive ? "page" : undefined}>
                {isActive && (
                  <motion.div layoutId="activeToolIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-accent"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                )}
                <tool.icon className={`h-4 w-4 shrink-0 ${isActive ? tool.accent : ""} transition-colors`} />
                {!sidebarCollapsed && (
                  <div className="text-left min-w-0">
                    <p className={`text-[13px] font-medium leading-tight ${isActive ? "text-foreground" : ""}`}>{tool.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5 truncate">{tool.desc}</p>
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {!sidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
            <Link to="/" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <ChevronLeft className="h-3 w-3" /> Back to Homepage
            </Link>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        sidebarCollapsed ? "ml-[68px]" : "ml-[260px]"
      }`}>
        <div className="sticky top-0 z-30 h-16 flex items-center justify-between px-8 border-b border-border bg-background/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <activeToolData.icon className={`h-5 w-5 ${activeToolData.accent}`} />
            <div>
              <h1 className="text-sm font-bold text-foreground">{activeToolData.title}</h1>
              <p className="text-[11px] text-muted-foreground">{activeToolData.desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-secondary">
              Dashboard
            </Link>
            <Link to="/contact" className="btn-primary-gradient text-xs px-4 py-2">
              Get Expert Help
            </Link>
          </div>
        </div>

        <div className="p-6 md:p-8 max-w-[1200px]">
          <AnimatePresence mode="wait">
            <motion.div key={activeTool} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
              {activeTool === "ai-audit" && <AISEOAudit />}
              {activeTool === "keywords" && <KeywordResearchTool />}
              {activeTool === "environment" && <EnvironmentalAnalysis />}
              {activeTool === "content" && <ContentAnalyzer />}
              {activeTool === "backlinks" && <BacklinkChecker />}
              {activeTool === "schema" && <SchemaGenerator />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default Tools;

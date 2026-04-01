import { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { BarChart3, Link2, FileCode2, FileText, Brain, Sparkles } from "lucide-react";
import { AISEOAudit } from "@/components/tools/AISEOAudit";
import { KeywordResearchTool } from "@/components/tools/KeywordResearchTool";
import { ContentAnalyzer } from "@/components/tools/ContentAnalyzer";
import { EnvironmentalAnalysis } from "@/components/tools/EnvironmentalAnalysis";
import { SchemaGenerator } from "@/components/tools/SchemaGenerator";
import { BacklinkChecker } from "@/components/tools/BacklinkChecker";

const toolsList = [
  { id: "ai-audit", icon: Brain, title: "AI SEO Audit", desc: "AI-powered deep analysis" },
  { id: "keywords", icon: BarChart3, title: "Keyword Research", desc: "Volume, difficulty & trends" },
  { id: "environment", icon: Sparkles, title: "Market Analysis", desc: "Competitive landscape" },
  { id: "content", icon: FileText, title: "Content Analyzer", desc: "NLP & readability" },
  { id: "backlinks", icon: Link2, title: "Backlink Checker", desc: "Link profile analysis" },
  { id: "schema", icon: FileCode2, title: "Schema Generator", desc: "JSON-LD structured data" },
];

const Tools = () => {
  const { toolId } = useParams();
  const [activeTool, setActiveTool] = useState(toolId || "ai-audit");

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="label-overline mb-3">Tools</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              SEO Analysis Engine
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Professional tools powered by real algorithms for actionable intelligence.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-1.5 mb-8">
            {toolsList.map(tool => (
              <button key={tool.id} onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeTool === tool.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}>
                <tool.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tool.title}</span>
              </button>
            ))}
          </div>

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
      </section>
    </Layout>
  );
};

export default Tools;

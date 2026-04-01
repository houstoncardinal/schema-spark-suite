import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Search, BarChart3, Link2, FileCode2, Shield, FileText, ArrowRight, Globe, Loader2, Brain, Sparkles, Zap } from "lucide-react";
import { AISEOAudit } from "@/components/tools/AISEOAudit";
import { KeywordResearchTool } from "@/components/tools/KeywordResearchTool";
import { ContentAnalyzer } from "@/components/tools/ContentAnalyzer";
import { EnvironmentalAnalysis } from "@/components/tools/EnvironmentalAnalysis";

const toolsList = [
  { id: "ai-audit", icon: Brain, title: "AI SEO Audit", desc: "AI-powered deep analysis", featured: true },
  { id: "keywords", icon: BarChart3, title: "Keyword Research", desc: "Volume, difficulty & trends" },
  { id: "environment", icon: Sparkles, title: "Market Analysis", desc: "Competitive landscape" },
  { id: "content", icon: FileText, title: "Content Analyzer", desc: "NLP & readability" },
  { id: "backlinks", icon: Link2, title: "Backlink Checker", desc: "Link profile analysis" },
  { id: "schema", icon: FileCode2, title: "Schema Generator", desc: "JSON-LD structured data" },
];

const Tools = () => {
  const [activeTool, setActiveTool] = useState("ai-audit");

  return (
    <Layout>
      <section className="section-padding relative">
        <div className="absolute inset-0 mesh-bg" />
        <div className="container-wide relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-xs font-semibold text-accent mb-4">
              <Zap className="h-3 w-3" /> AI-Powered Intelligence Suite
            </div>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Advanced SEO <span className="gradient-text">Analysis Engine</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Deep analytical tools powered by AI — uncover insights that transform your search performance.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {toolsList.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all relative ${
                  activeTool === tool.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                <tool.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tool.title}</span>
                {tool.featured && activeTool !== tool.id && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTool === "ai-audit" && <AISEOAudit />}
              {activeTool === "keywords" && <KeywordResearchTool />}
              {activeTool === "environment" && <EnvironmentalAnalysis />}
              {activeTool === "content" && <ContentAnalyzer />}
              {(activeTool === "backlinks" || activeTool === "schema") && (
                <div className="glass-card-float p-16 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10 mb-4">
                    {(() => { const t = toolsList.find(t => t.id === activeTool); return t ? <t.icon className="h-8 w-8 text-accent" /> : null; })()}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {toolsList.find(t => t.id === activeTool)?.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">Advanced analysis engine coming soon. Get early access.</p>
                  <a href="/contact" className="btn-primary-gradient text-sm gap-2">Get Early Access <ArrowRight className="h-4 w-4" /></a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default Tools;

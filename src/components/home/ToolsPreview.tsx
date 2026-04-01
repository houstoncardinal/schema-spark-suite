import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, BarChart3, Link2, FileCode2, ArrowRight, Brain, Cpu, Network, Eye } from "lucide-react";

const tools = [
  {
    icon: Brain,
    title: "AI SEO Audit",
    description: "200+ ranking factors analyzed by AI with prioritized recommendations and predictive impact scores.",
    href: "/tools/ai-audit",
    accent: "accent",
  },
  {
    icon: Search,
    title: "Keyword Intelligence",
    description: "Discover high-intent keywords with AI-powered difficulty scoring, SERP analysis, and trend forecasting.",
    href: "/tools/keywords",
    accent: "chart-4",
  },
  {
    icon: Link2,
    title: "Backlink Analyzer",
    description: "Deep backlink profiling with toxicity detection, authority mapping, and competitive gap analysis.",
    href: "/tools/backlinks",
    accent: "success",
  },
  {
    icon: FileCode2,
    title: "Schema Generator",
    description: "Generate and validate JSON-LD structured data for rich results with one-click deployment.",
    href: "/tools/schema",
    accent: "warning",
  },
  {
    icon: Network,
    title: "Topical Authority",
    description: "Map your content clusters, identify topic gaps, and build comprehensive authority in your niche.",
    href: "/dashboard",
    accent: "info",
  },
  {
    icon: Eye,
    title: "SERP Simulator",
    description: "Preview and optimize your search appearance across devices with real-time SERP rendering.",
    href: "/dashboard",
    accent: "chart-4",
  },
];

export function ToolsPreview() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 mesh-bg" />
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <span className="label-overline mb-4 block">Platform Capabilities</span>
          <h2 className="headline-section text-foreground mb-5">
            Everything to{" "}
            <span className="gradient-text">Dominate Search</span>
          </h2>
          <p className="body-large max-w-xl mx-auto">
            Enterprise-grade tools powered by AI that deliver actionable intelligence in seconds, not hours.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            >
              <Link
                to={tool.href}
                className="glass-card-premium block p-7 h-full group"
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-${tool.accent}/10 mb-5 group-hover:bg-${tool.accent}/15 transition-colors`}>
                  <tool.icon className={`h-5 w-5 text-${tool.accent}`} />
                </div>
                <h3 className="font-display text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{tool.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

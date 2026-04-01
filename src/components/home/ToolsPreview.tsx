import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, BarChart3, Link2, FileCode2, ArrowRight, Brain, Network, Eye } from "lucide-react";

const tools = [
  { icon: Brain, title: "AI SEO Audit", description: "200+ ranking factors analyzed with prioritized, actionable recommendations.", href: "/tools/ai-audit", accent: true },
  { icon: Search, title: "Keyword Intelligence", description: "Discover high-intent keywords with difficulty scoring and SERP analysis.", href: "/tools/keywords" },
  { icon: Link2, title: "Backlink Analyzer", description: "Deep backlink profiling with toxicity detection and authority mapping.", href: "/tools/backlinks" },
  { icon: FileCode2, title: "Schema Generator", description: "Generate and validate JSON-LD structured data for rich results.", href: "/tools/schema" },
  { icon: Network, title: "Topical Authority", description: "Map content clusters, identify topic gaps, and build domain authority.", href: "/dashboard" },
  { icon: Eye, title: "SERP Simulator", description: "Preview and optimize your search appearance across all devices.", href: "/dashboard" },
];

export function ToolsPreview() {
  return (
    <section className="section-padding relative noise-texture">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="label-overline mb-4">Platform</p>
          <h2 className="headline-section text-foreground mb-5">
            Everything you need to{" "}
            <span className="font-serif italic gradient-text">rank higher</span>
          </h2>
          <p className="body-large max-w-lg mx-auto">
            Enterprise-grade tools that deliver actionable intelligence in seconds.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link to={tool.href}
                className={`block p-7 h-full group rounded-2xl border transition-all duration-500 ${
                  tool.accent 
                    ? "border-accent/20 bg-accent/[0.03] hover:border-accent/40 hover:bg-accent/[0.06]" 
                    : "border-border bg-card hover:border-foreground/10"
                }`}
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 ${
                  tool.accent ? "bg-accent/10" : "bg-secondary"
                }`}>
                  <tool.icon className={`h-5 w-5 ${tool.accent ? "text-accent" : "text-muted-foreground group-hover:text-accent"} transition-colors`} />
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{tool.description}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

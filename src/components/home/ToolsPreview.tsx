import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, BarChart3, Link2, FileCode2, ArrowRight, Brain, Network, Eye } from "lucide-react";

const tools = [
  { icon: Brain, title: "AI SEO Audit", description: "200+ ranking factors analyzed by AI with prioritized recommendations.", href: "/tools/ai-audit" },
  { icon: Search, title: "Keyword Intelligence", description: "Discover high-intent keywords with difficulty scoring and SERP analysis.", href: "/tools/keywords" },
  { icon: Link2, title: "Backlink Analyzer", description: "Deep backlink profiling with toxicity detection and authority mapping.", href: "/tools/backlinks" },
  { icon: FileCode2, title: "Schema Generator", description: "Generate and validate JSON-LD structured data for rich results.", href: "/tools/schema" },
  { icon: Network, title: "Topical Authority", description: "Map content clusters, identify topic gaps, and build domain authority.", href: "/dashboard" },
  { icon: Eye, title: "SERP Simulator", description: "Preview and optimize your search appearance across all devices.", href: "/dashboard" },
];

export function ToolsPreview() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="label-overline mb-3">Platform</p>
          <h2 className="headline-section text-foreground mb-4">
            Everything you need to{" "}
            <span className="gradient-text">rank higher</span>
          </h2>
          <p className="body-large max-w-lg mx-auto">
            Enterprise-grade tools that deliver actionable intelligence in seconds.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={tool.href} className="surface-card-hover block p-6 h-full group">
                <tool.icon className="h-5 w-5 text-muted-foreground mb-4 group-hover:text-accent transition-colors" />
                <h3 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-accent transition-colors">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
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

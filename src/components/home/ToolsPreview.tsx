import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, Link2, FileCode2, ArrowRight, Brain, Network, Eye } from "lucide-react";

const tools = [
  { icon: Brain, title: "AI SEO Audit", description: "200+ ranking factors analyzed with prioritized, actionable recommendations.", href: "/tools/ai-audit" },
  { icon: Search, title: "Keyword Intelligence", description: "Discover high-intent keywords with difficulty scoring and SERP analysis.", href: "/tools/keywords" },
  { icon: Link2, title: "Backlink Analyzer", description: "Deep backlink profiling with toxicity detection and authority mapping.", href: "/tools/backlinks" },
  { icon: FileCode2, title: "Schema Generator", description: "Generate and validate JSON-LD structured data for rich results.", href: "/tools/schema" },
  { icon: Network, title: "Topical Authority", description: "Map content clusters, identify topic gaps, and build domain authority.", href: "/dashboard" },
  { icon: Eye, title: "SERP Simulator", description: "Preview and optimize your search appearance across all devices.", href: "/dashboard" },
];

function trackMouse(e: React.MouseEvent<HTMLAnchorElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function ToolsPreview() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-[0.35] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="pill-luxe mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--emerald-bright))]" />
            The Intelligence Suite
          </span>
          <h2 className="headline-section text-foreground mb-5 mt-4">
            Everything you need to{" "}
            <span className="font-serif italic gold-text">rank higher</span>
          </h2>
          <p className="body-large max-w-xl mx-auto">
            Enterprise-grade tools powered by proprietary algorithms that deliver actionable intelligence in seconds.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
            >
              <Link to={tool.href}
                onMouseMove={trackMouse}
                className="luxe-card luxe-sheen group block p-8 h-full"
              >
                <div className="relative h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                  style={{ background: "linear-gradient(135deg, hsl(var(--emerald-deep)), hsl(var(--emerald-rich)))", boxShadow: "0 6px 18px hsl(var(--emerald-deep) / 0.25), inset 0 1px 0 hsl(var(--gold-bright) / 0.4)" }}>
                  <tool.icon className="h-5 w-5 text-[hsl(var(--cream))]" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2.5 font-display tracking-tight group-hover:emerald-text transition-all duration-300">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{tool.description}</p>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[hsl(var(--gold-rich))] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
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

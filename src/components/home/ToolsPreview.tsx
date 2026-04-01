import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Search, BarChart3, Link2, FileCode2, ArrowRight } from "lucide-react";

const tools = [
  {
    icon: Search,
    title: "SEO Analyzer",
    description: "Complete technical SEO audit with actionable insights for any website.",
    href: "/tools/analyzer",
    color: "from-blue-500/10 to-cyan-500/10",
    iconColor: "text-blue-500",
  },
  {
    icon: BarChart3,
    title: "Keyword Research",
    description: "Discover high-value keywords with volume, difficulty, and trend data.",
    href: "/tools/keywords",
    color: "from-violet-500/10 to-purple-500/10",
    iconColor: "text-violet-500",
  },
  {
    icon: Link2,
    title: "Backlink Checker",
    description: "Analyze backlink profiles, domain authority, and link opportunities.",
    href: "/tools/backlinks",
    color: "from-emerald-500/10 to-green-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: FileCode2,
    title: "Schema Generator",
    description: "Generate valid JSON-LD structured data for rich search results.",
    href: "/tools/schema-generator",
    color: "from-orange-500/10 to-amber-500/10",
    iconColor: "text-orange-500",
  },
];

export function ToolsPreview() {
  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-accent mb-3">Powerful Tools</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need to{" "}
            <span className="gradient-text">Dominate Search</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Professional-grade SEO tools that deliver actionable insights in seconds.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link
                to={tool.href}
                className="glass-card hover-lift block p-6 h-full group"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} mb-4`}>
                  <tool.icon className={`h-6 w-6 ${tool.iconColor}`} />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">{tool.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-accent group-hover:gap-2 transition-all">
                  Try it free <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

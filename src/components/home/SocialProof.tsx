import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Zap, Code, BarChart3, Search, FileText, Eye } from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "AI-Driven Analysis",
    description: "Every audit is powered by intelligent algorithms that evaluate 200+ ranking factors simultaneously — delivering insights that would take an SEO expert hours to compile.",
  },
  {
    icon: Shield,
    title: "Transparent & Accurate",
    description: "No inflated scores, no vanity metrics. Every data point is derived from real analysis of your site's structure, content, and technical foundation.",
  },
  {
    icon: Zap,
    title: "Actionable Fix Plans",
    description: "Every issue comes with step-by-step fix instructions, difficulty ratings, and expected impact — so you know exactly what to do and why it matters.",
  },
  {
    icon: Code,
    title: "Schema & Structured Data",
    description: "Generate, validate, and implement JSON-LD structured data for rich results. Our schema tools cover Article, FAQ, Organization, Product, and more.",
  },
  {
    icon: BarChart3,
    title: "Competitive Intelligence",
    description: "Understand where you stand relative to competitors with keyword gap analysis, content comparison, and backlink profiling tools.",
  },
  {
    icon: Eye,
    title: "SERP Preview & Optimization",
    description: "See exactly how your pages appear in search results across devices. Optimize titles, descriptions, and rich snippets before publishing.",
  },
];

export function SocialProof() {
  return (
    <section className="section-padding border-t border-border">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="label-overline mb-3">Why SEOPulse</p>
          <h2 className="headline-section text-foreground mb-4">
            Built for SEO professionals who demand{" "}
            <span className="gradient-text">real data</span>
          </h2>
          <p className="body-large max-w-lg mx-auto">
            If you found us, our SEO works. Now let us show you how we do it for your site.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="surface-card p-6"
            >
              <cap.icon className="h-5 w-5 text-accent mb-4" />
              <h3 className="text-sm font-semibold text-foreground mb-2">{cap.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Proof through demonstration */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-card p-8 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
          <div className="relative">
            <p className="text-sm font-medium text-accent mb-2">The best proof is the product itself</p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
              Run a free audit. See the difference.
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
              No signup required. Enter any URL on this page and get a detailed analysis with actionable fixes — instantly.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/tools/ai-audit" className="btn-primary gap-2 text-sm">
                Try Full AI Audit <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors">
                View Services
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

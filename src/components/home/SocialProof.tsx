import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Zap, Code, BarChart3, Eye } from "lucide-react";

const capabilities = [
  {
    icon: Brain,
    title: "AI-Driven Analysis",
    description: "Every audit evaluates 200+ ranking factors simultaneously — delivering insights that would take an expert hours to compile.",
    number: "01",
    color: "google-blue",
  },
  {
    icon: Shield,
    title: "Transparent & Accurate",
    description: "No inflated scores, no vanity metrics. Every data point is derived from real analysis of your site's structure and content.",
    number: "02",
    color: "google-red",
  },
  {
    icon: Zap,
    title: "Actionable Fix Plans",
    description: "Every issue comes with step-by-step instructions, difficulty ratings, and expected impact — so you know exactly what to do.",
    number: "03",
    color: "google-yellow",
  },
  {
    icon: Code,
    title: "Schema & Structured Data",
    description: "Generate, validate, and implement JSON-LD structured data. Our tools cover Article, FAQ, Organization, Product, and more.",
    number: "04",
    color: "google-green",
  },
  {
    icon: BarChart3,
    title: "Competitive Intelligence",
    description: "Understand where you stand with keyword gap analysis, content comparison, and backlink profiling tools.",
    number: "05",
    color: "apple-purple",
  },
  {
    icon: Eye,
    title: "SERP Optimization",
    description: "See exactly how your pages appear in search results across devices. Optimize titles and rich snippets before publishing.",
    number: "06",
    color: "apple-teal",
  },
];

export function SocialProof() {
  return (
    <section className="section-padding relative overflow-hidden ambient-multicolor">
      <div className="section-divider absolute top-0 inset-x-0" />
      
      <div className="container-wide relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <p className="label-overline mb-4">Why SEO Cloud Lab</p>
          <h2 className="headline-section text-foreground mb-5">
            Built for professionals who demand{" "}
            <span className="font-serif italic gradient-text-rainbow">real data</span>
          </h2>
          <p className="body-large max-w-lg mx-auto">
            If you found us, our SEO works. Now let us show you how we do it for your site.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className={`group relative p-7 rounded-2xl border border-border bg-card hover:border-foreground/10 transition-all duration-500 feature-card-${cap.color}`}
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <span className="absolute top-6 right-6 text-[40px] font-bold text-foreground/[0.03] leading-none select-none tracking-tight">
                {cap.number}
              </span>
              <div className={`h-10 w-10 rounded-xl bg-${cap.color}/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300`}>
                <cap.icon className={`h-5 w-5 text-${cap.color} group-hover:text-accent transition-colors duration-300`} />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{cap.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="surface-multicolor p-10 md:p-14 text-center bg-card border border-border rounded-3xl"
        >
          <div className="relative">
            <p className="label-overline mb-3">The best proof is the product</p>
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
              Run a free audit. See the difference.
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
              No signup required. Enter any URL and get a detailed analysis with actionable fixes — instantly.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Link to="/tools/ai-audit" className="btn-rainbow gap-2">
                Try Full AI Audit <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link to="/services" className="btn-secondary gap-2">
                View Services
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

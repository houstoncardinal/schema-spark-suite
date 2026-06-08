import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Brain, Zap, Code, BarChart3, Eye } from "lucide-react";

const capabilities = [
  { icon: Brain, title: "AI-Driven Analysis", description: "Every audit evaluates 200+ ranking factors simultaneously — delivering insights that would take an expert hours to compile.", number: "01" },
  { icon: Shield, title: "Transparent & Accurate", description: "No inflated scores, no vanity metrics. Every data point is derived from real analysis of your site's structure and content.", number: "02" },
  { icon: Zap, title: "Actionable Fix Plans", description: "Every issue comes with step-by-step instructions, difficulty ratings, and expected impact — so you know exactly what to do.", number: "03" },
  { icon: Code, title: "Schema & Structured Data", description: "Generate, validate, and implement JSON-LD structured data. Our tools cover Article, FAQ, Organization, Product, and more.", number: "04" },
  { icon: BarChart3, title: "Competitive Intelligence", description: "Understand where you stand with keyword gap analysis, content comparison, and backlink profiling tools.", number: "05" },
  { icon: Eye, title: "SERP Optimization", description: "See exactly how your pages appear in search results across devices. Optimize titles and rich snippets before publishing.", number: "06" },
];

function trackMouse(e: React.MouseEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function SocialProof() {
  return (
    <section className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-[hsl(150_30%_98%)] to-background">
      <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
      <div className="section-divider absolute top-0 inset-x-0" />

      <div className="container-wide relative">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-16">
          <span className="pill-luxe mb-5">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--gold-rich))] animate-luxe-pulse" />
            Why SEO Cloud Lab
          </span>
          <h2 className="headline-section text-foreground mb-5 mt-4">
            Built for professionals who demand{" "}
            <span className="font-serif italic gold-text">real intelligence</span>
          </h2>
          <p className="body-large max-w-xl mx-auto">
            Proprietary algorithms. Transparent scoring. Zero fluff. The platform serious operators use to outrank, outperform, and outlast.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, ease: [0.23, 1, 0.32, 1] }}
              onMouseMove={trackMouse}
              className="luxe-card luxe-sheen group p-8"
            >
              <span className="absolute top-6 right-6 text-[44px] font-bold leading-none select-none tracking-tight font-display gold-text opacity-20">
                {cap.number}
              </span>
              <div className="relative h-12 w-12 rounded-2xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110"
                style={{ background: "linear-gradient(135deg, hsl(var(--emerald-rich) / 0.12), hsl(var(--gold-bright) / 0.12))", border: "1px solid hsl(var(--gold-bright) / 0.25)" }}>
                <cap.icon className="h-5 w-5 text-[hsl(var(--emerald-deep))]" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2.5 font-display tracking-tight">{cap.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{cap.description}</p>
              <div className="gold-divider mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onMouseMove={trackMouse}
          className="luxe-card luxe-sheen p-12 md:p-16 text-center"
        >
          <span className="pill-luxe mb-5">The best proof is the product</span>
          <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tight font-display mt-4">
            Run a free audit. <span className="font-serif italic gold-text">See the difference.</span>
          </h3>
          <p className="text-base text-muted-foreground max-w-md mx-auto mb-8">
            No signup required. Enter any URL and get a detailed analysis with actionable fixes — instantly.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/tools/ai-audit" className="btn-gold gap-2">
              Try Full AI Audit <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/services" className="btn-secondary gap-2">View Services</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

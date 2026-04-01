import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const caseStudies = [
  { metric: "+312%", label: "Organic Traffic", company: "E-Commerce Brand", description: "Tripled organic revenue in 8 months through AI-driven technical SEO." },
  { metric: "#1", label: "Local Rankings", company: "Houston Law Firm", description: "Dominated local search across 47 high-value keywords." },
  { metric: "10x", label: "Lead Generation", company: "SaaS Startup", description: "Scaled organic leads from 50 to 500+ per month." },
];

const testimonials = [
  { quote: "SEOPulse transformed our entire digital strategy. The AI analysis is incredibly thorough.", name: "Sarah Chen", role: "VP Marketing, TechScale" },
  { quote: "We went from page 5 to position 1 for our most valuable keywords in under 4 months.", name: "Marcus Rivera", role: "CEO, GrowthPath" },
];

export function SocialProof() {
  return (
    <section className="section-padding border-t border-border">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <p className="label-overline mb-3">Results</p>
          <h2 className="headline-section text-foreground mb-4">Proven at scale</h2>
          <p className="body-large max-w-lg mx-auto">Join thousands of companies achieving measurable growth.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {caseStudies.map((study, i) => (
            <motion.div key={study.company} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="surface-card p-6 text-center">
              <p className="text-4xl font-bold gradient-text mb-1">{study.metric}</p>
              <p className="text-sm font-medium text-foreground mb-0.5">{study.label}</p>
              <p className="text-xs text-accent mb-3">{study.company}</p>
              <p className="text-sm text-muted-foreground">{study.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="surface-card p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-4">"{t.quote}"</p>
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.role}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services" className="btn-primary gap-2">
            View All Results <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

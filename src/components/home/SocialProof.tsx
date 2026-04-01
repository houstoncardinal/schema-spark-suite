import { motion } from "framer-motion";
import { TrendingUp, Users, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const caseStudies = [
  {
    metric: "+312%",
    label: "Organic Traffic",
    company: "E-Commerce Brand",
    description: "Tripled organic revenue in 8 months through technical SEO and content strategy.",
    icon: TrendingUp,
  },
  {
    metric: "#1",
    label: "Local Rankings",
    company: "Houston Law Firm",
    description: "Dominated local search across 47 high-value keywords in a competitive market.",
    icon: Award,
  },
  {
    metric: "10x",
    label: "Lead Generation",
    company: "SaaS Startup",
    description: "Scaled organic leads from 50 to 500+ per month with programmatic SEO.",
    icon: Users,
  },
];

const testimonials = [
  {
    quote: "SEOPulse transformed our entire digital strategy. The tools are incredible and the consulting took us to another level.",
    name: "Sarah Chen",
    role: "VP Marketing, TechScale",
  },
  {
    quote: "We went from page 5 to position 1 for our most valuable keywords. The ROI has been phenomenal.",
    name: "Marcus Rivera",
    role: "CEO, GrowthPath",
  },
];

export function SocialProof() {
  return (
    <section className="section-padding">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-accent mb-3">Proven Results</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Results That <span className="gradient-text">Speak Volumes</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-elevated hover-lift p-8 text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
                <study.icon className="h-6 w-6 text-accent" />
              </div>
              <p className="font-display text-4xl font-bold gradient-text mb-1">{study.metric}</p>
              <p className="text-sm font-semibold text-foreground mb-2">{study.label}</p>
              <p className="text-xs text-accent font-medium mb-3">{study.company}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{study.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card p-8"
            >
              <p className="text-foreground leading-relaxed mb-6 italic">"{t.quote}"</p>
              <div>
                <p className="font-display text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/services" className="btn-primary-gradient gap-2">
            See All Case Studies <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

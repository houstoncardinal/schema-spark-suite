import { motion } from "framer-motion";
import { TrendingUp, Users, Award, ArrowRight, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const caseStudies = [
  {
    metric: "+312%",
    label: "Organic Traffic",
    company: "E-Commerce Brand",
    description: "Tripled organic revenue in 8 months through AI-driven technical SEO and content strategy.",
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
    description: "Scaled organic leads from 50 to 500+ per month with programmatic SEO and AI agents.",
    icon: Users,
  },
];

const testimonials = [
  {
    quote: "SEOPulse transformed our entire digital strategy. The AI agents are incredible — it's like having a team of 10 SEO experts working 24/7.",
    name: "Sarah Chen",
    role: "VP Marketing, TechScale",
    rating: 5,
  },
  {
    quote: "We went from page 5 to position 1 for our most valuable keywords. The predictive intelligence gave us an unfair advantage.",
    name: "Marcus Rivera",
    role: "CEO, GrowthPath",
    rating: 5,
  },
];

export function SocialProof() {
  return (
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="label-overline mb-4 block">Proven Results</span>
          <h2 className="headline-section text-foreground mb-5">
            Results That <span className="gradient-text">Speak Volumes</span>
          </h2>
          <p className="body-large max-w-xl mx-auto">
            Join thousands of companies achieving extraordinary growth with our platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.company}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-premium hover-lift p-8 text-center"
            >
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 mb-5">
                <study.icon className="h-6 w-6 text-accent" />
              </div>
              <p className="font-display text-5xl font-bold gradient-text mb-2">{study.metric}</p>
              <p className="text-sm font-semibold text-foreground mb-1">{study.label}</p>
              <p className="text-xs font-medium text-accent mb-4">{study.company}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{study.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-5 mb-14">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="glass-card-premium p-8 relative"
            >
              <Quote className="h-8 w-8 text-accent/15 absolute top-6 right-6" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-foreground leading-relaxed mb-6">{t.quote}</p>
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

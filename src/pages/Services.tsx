import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, Star, Shield, BarChart3, Globe, Zap, Users } from "lucide-react";

const services = [
  {
    icon: BarChart3,
    title: "SEO Consulting",
    price: "From $2,500/mo",
    description: "Comprehensive monthly SEO strategy and execution for sustained growth.",
    deliverables: ["Full technical audit", "Content strategy", "Link building", "Monthly reporting", "Dedicated SEO manager"],
    featured: true,
  },
  {
    icon: Shield,
    title: "Technical SEO Audit",
    price: "From $1,500",
    description: "Deep-dive technical analysis with prioritized action plan.",
    deliverables: ["200+ checkpoint audit", "Site architecture review", "Core Web Vitals", "Schema implementation", "Competitor analysis"],
    featured: false,
  },
  {
    icon: Globe,
    title: "Local SEO",
    price: "From $1,000/mo",
    description: "Dominate local search in Houston and surrounding high-income areas.",
    deliverables: ["Google Business optimization", "Local citation building", "Review management", "Local content strategy", "Map pack targeting"],
    featured: false,
  },
  {
    icon: Zap,
    title: "Enterprise SEO",
    price: "Custom",
    description: "Large-scale SEO strategy for enterprise organizations.",
    deliverables: ["Custom strategy", "Dedicated team", "API integrations", "Executive reporting", "Priority support"],
    featured: false,
  },
];

const Services = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="text-sm font-semibold text-accent mb-3">Professional Services</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              SEO Services for <span className="gradient-text">Serious Growth</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Expert-led SEO consulting designed for businesses that demand real, measurable results.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 mb-20">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card-elevated hover-lift p-8 relative ${service.featured ? "ring-2 ring-accent" : ""}`}
              >
                {service.featured && (
                  <div className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                    Most Popular
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <service.icon className="h-6 w-6 text-accent" />
                  </div>
                  <span className="font-display text-lg font-bold text-foreground">{service.price}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                <ul className="space-y-2.5 mb-8">
                  {service.deliverables.map((d) => (
                    <li key={d} className="flex items-center gap-2.5 text-sm text-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold w-full transition-all ${
                  service.featured ? "btn-primary-gradient" : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}>
                  Get Started <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Process */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">Our Process</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {[
              { step: "01", title: "Discovery", desc: "Deep-dive into your business, competition, and goals." },
              { step: "02", title: "Strategy", desc: "Custom SEO roadmap with prioritized actions." },
              { step: "03", title: "Execution", desc: "Implementation of technical, content, and link strategies." },
              { step: "04", title: "Results", desc: "Transparent reporting and continuous optimization." },
            ].map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="glass-card p-6 text-center">
                <span className="font-display text-3xl font-bold gradient-text">{s.step}</span>
                <h3 className="font-display text-lg font-semibold text-foreground mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Hourly */}
          <div className="glass-card-elevated p-8 md:p-12 text-center max-w-2xl mx-auto">
            <Users className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Hourly Consulting</h3>
            <p className="text-3xl font-bold gradient-text mb-4">$350/hour</p>
            <p className="text-muted-foreground mb-6">Need expert advice without a long-term commitment? Book hourly sessions with our senior SEO strategists.</p>
            <Link to="/contact" className="btn-primary-gradient gap-2">
              Book a Session <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;

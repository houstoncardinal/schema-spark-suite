import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { CheckCircle, ArrowRight, BarChart3, Shield, Globe, Zap } from "lucide-react";

const services = [
  {
    icon: BarChart3, title: "SEO Consulting", price: "From $2,500/mo",
    description: "Comprehensive monthly SEO strategy and execution.",
    deliverables: ["Full technical audit", "Content strategy", "Link building", "Monthly reporting", "Dedicated SEO manager"],
    featured: true,
  },
  {
    icon: Shield, title: "Technical SEO Audit", price: "From $1,500",
    description: "Deep-dive technical analysis with prioritized action plan.",
    deliverables: ["200+ checkpoint audit", "Site architecture review", "Core Web Vitals", "Schema implementation", "Competitor analysis"],
  },
  {
    icon: Globe, title: "Local SEO", price: "From $1,000/mo",
    description: "Dominate local search in your target market.",
    deliverables: ["Google Business optimization", "Local citation building", "Review management", "Local content strategy", "Map pack targeting"],
  },
  {
    icon: Zap, title: "Enterprise SEO", price: "Custom",
    description: "Large-scale SEO strategy for enterprise organizations.",
    deliverables: ["Custom strategy", "Dedicated team", "API integrations", "Executive reporting", "Priority support"],
  },
];

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "SEO Services",
  description: "Professional SEO consulting and audit services by SEOPulse",
  url: "https://seopulse.io/services",
  numberOfItems: services.length,
  itemListElement: services.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.description,
      provider: { "@type": "Organization", name: "SEOPulse" },
      offers: { "@type": "Offer", description: s.price },
    },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seopulse.io/" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://seopulse.io/services" },
  ],
};

const Services = () => (
  <Layout>
    <Helmet>
      <title>Professional SEO Services — Consulting, Audits & Strategy | SEOPulse</title>
      <meta name="description" content="Expert SEO consulting, technical audits, local SEO, and enterprise strategy services. Get measurable results with data-driven SEO from SEOPulse." />
      <link rel="canonical" href="https://seopulse.io/services" />
      <meta property="og:title" content="Professional SEO Services | SEOPulse" />
      <meta property="og:description" content="Expert SEO consulting, technical audits, and enterprise strategy services with measurable results." />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://seopulse.io/services" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Professional SEO Services | SEOPulse" />
      <script type="application/ld+json">{JSON.stringify(servicesJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
    </Helmet>
    <section className="section-padding">
      <div className="container-wide">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <p className="label-overline mb-3">Services</p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
            Professional SEO services
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">Expert consulting for businesses that demand measurable results.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-16">
          {services.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className={`surface-card p-6 ${s.featured ? "ring-1 ring-foreground/10" : ""}`}>
              {s.featured && <span className="inline-block rounded-full bg-foreground text-background px-3 py-0.5 text-[10px] font-medium mb-3">Most Popular</span>}
              <div className="flex items-start justify-between mb-3">
                <s.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">{s.price}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.description}</p>
              <ul className="space-y-2 mb-5">
                {s.deliverables.map(d => (
                  <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" /> {d}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className={s.featured ? "btn-primary w-full gap-2" : "btn-secondary w-full gap-2"}>
                Get Started <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Our Process</h2>
        </motion.div>
        <div className="grid sm:grid-cols-4 gap-4 mb-16">
          {[
            { step: "01", title: "Discovery", desc: "Deep-dive into your business and goals." },
            { step: "02", title: "Strategy", desc: "Custom SEO roadmap with priorities." },
            { step: "03", title: "Execution", desc: "Technical, content, and link strategies." },
            { step: "04", title: "Results", desc: "Transparent reporting and optimization." },
          ].map((s, i) => (
            <motion.div key={s.step} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="surface-card p-5 text-center">
              <span className="text-2xl font-bold gradient-text">{s.step}</span>
              <h3 className="text-sm font-semibold text-foreground mt-2 mb-1">{s.title}</h3>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="surface-elevated p-8 text-center max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-2">Hourly Consulting</h3>
          <p className="text-2xl font-bold gradient-text mb-3">$350/hour</p>
          <p className="text-sm text-muted-foreground mb-5">Expert advice without a long-term commitment.</p>
          <Link to="/contact" className="btn-primary gap-2">Book a Session <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
      </div>
    </section>
  </Layout>
);

export default Services;

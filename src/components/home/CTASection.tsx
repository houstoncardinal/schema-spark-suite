import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

export function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0 dot-pattern opacity-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container-tight relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-4 py-1.5 text-xs font-medium text-primary-foreground/80 mb-6">
            <Zap className="h-3 w-3" />
            Limited availability
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6 leading-tight">
            Ready to Dominate<br />Your Search Rankings?
          </h2>

          <p className="text-primary-foreground/70 max-w-lg mx-auto mb-10 leading-relaxed">
            Get a comprehensive SEO strategy tailored to your business. Our experts will identify opportunities and create a roadmap to page one.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-8 py-4 text-sm font-semibold text-primary transition-all hover:opacity-90 hover:-translate-y-0.5"
            >
              Book Free Consultation <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tools/ai-audit"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/20 px-8 py-4 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-foreground/10"
            >
              Try Free SEO Audit
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

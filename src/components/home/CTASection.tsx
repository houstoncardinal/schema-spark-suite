import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32 md:py-40 relative overflow-hidden noise-texture ambient-multicolor">
      <div className="section-divider absolute top-0 inset-x-0" />
      
      <div className="container-tight text-center relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}>
          
          <span className="pill-luxe mb-8">
            <Sparkles className="h-3 w-3" />
            Start for free
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-[-0.03em] leading-[1.05] font-display mt-6">
            Ready to rank{" "}
            <span className="font-serif italic gold-text">higher?</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg leading-relaxed">
            AI-powered SEO intelligence. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/pricing" className="btn-gold gap-2 text-base px-8 py-4">
              Start Free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/tools/ai-audit" className="btn-secondary gap-2 text-base px-8 py-4">
              Try Free Audit
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

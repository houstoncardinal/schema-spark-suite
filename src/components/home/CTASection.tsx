import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 md:py-32 border-t border-border">
      <div className="container-tight text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 tracking-tight">
            Ready to rank higher?
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
            Get AI-powered SEO intelligence. Free to start, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/auth" className="btn-primary gap-2">
              Start Free <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link to="/tools/ai-audit" className="btn-secondary gap-2">
              Try Free Audit
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

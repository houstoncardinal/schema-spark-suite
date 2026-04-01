import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, Brain } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] -translate-y-1/3 translate-x-1/4" style={{ background: "hsl(var(--accent) / 0.15)" }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] translate-y-1/3 -translate-x-1/4" style={{ background: "hsl(var(--info) / 0.1)" }} />

      <div className="container-tight relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-2 text-xs font-medium text-white/70 mb-8">
            <Zap className="h-3 w-3" />
            Start for free — no credit card required
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 leading-[1.08] tracking-tight">
            Ready to Dominate<br />Your Search Rankings?
          </h2>

          <p className="text-white/50 max-w-lg mx-auto mb-12 leading-relaxed text-lg">
            Get AI-powered SEO intelligence that gives you an unfair advantage. Join 10,000+ professionals already winning.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-4 text-sm font-semibold text-primary transition-all hover:bg-white/90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Brain className="h-4 w-4" /> Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/tools/ai-audit"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm px-8 py-4 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white"
            >
              <Shield className="h-4 w-4" /> Try Free SEO Audit
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

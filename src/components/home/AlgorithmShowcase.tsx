import { motion } from "framer-motion";
import { Cpu, Database, GitBranch, Layers, Sparkles, Radar, LineChart, Lock } from "lucide-react";

const algorithms = [
  { icon: Cpu, name: "ASTRA-Rank™", description: "Adaptive Semantic Topical Ranking Algorithm — evaluates entity coverage, semantic depth and topical authority across 47 dimensions.", metric: "47 dim", metricLabel: "Vectors" },
  { icon: Radar, name: "VITALS-Pulse™", description: "Continuous Core Web Vitals modeling with synthetic + RUM blended scoring against your live ranking cohort.", metric: "<200ms", metricLabel: "Latency" },
  { icon: GitBranch, name: "LinkGraph-Δ™", description: "Differential backlink graph that detects toxicity, link velocity anomalies, and authority flow in real time.", metric: "12B", metricLabel: "Edges" },
  { icon: Layers, name: "SERP-Mirror™", description: "Proprietary SERP fingerprinting models intent, feature mix, and competitive saturation before you publish.", metric: "94.2%", metricLabel: "Accuracy" },
  { icon: Database, name: "Corpus-IQ™", description: "Trained on 2.4M ranking pages with continual re-indexing — surfaces what actually moves positions, not what blogs say.", metric: "2.4M", metricLabel: "Pages" },
  { icon: LineChart, name: "Forecast-Edge™", description: "Predictive ranking modeling forecasts position shifts 14–90 days out based on your roadmap and competitor velocity.", metric: "±1.4", metricLabel: "Position MAE" },
];

function trackMouse(e: React.MouseEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function AlgorithmShowcase() {
  return (
    <section className="relative section-padding overflow-hidden text-[hsl(var(--cream))]"
      style={{ background: "linear-gradient(180deg, hsl(161 50% 5%) 0%, hsl(161 60% 8%) 50%, hsl(161 50% 5%) 100%)" }}>
      {/* Ambient orbits */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit">
          <div className="h-[700px] w-[700px] rounded-full border border-[hsl(var(--gold-bright)/0.15)]" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-orbit" style={{ animationDuration: "45s", animationDirection: "reverse" }}>
          <div className="h-[1000px] w-[1000px] rounded-full border border-[hsl(var(--emerald-bright)/0.12)]" />
        </div>
      </div>
      <div className="absolute inset-0 dot-pattern opacity-[0.06] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold-bright)/0.5)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold-bright)/0.5)] to-transparent" />

      <div className="container-wide relative">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] mb-6"
            style={{ background: "hsl(var(--gold-bright) / 0.08)", border: "1px solid hsl(var(--gold-bright) / 0.3)", color: "hsl(var(--gold-bright))" }}>
            <Lock className="h-3 w-3" />
            Proprietary Engines
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-[-0.03em] mb-6 font-display">
            Six intelligence engines.{" "}
            <span className="font-serif italic gold-text">One unfair advantage.</span>
          </h2>
          <p className="text-lg text-[hsl(var(--cream)/0.65)] leading-relaxed">
            We don't resell third-party APIs. Every signal you see is computed by a proprietary algorithm we built, train, and operate in-house.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {algorithms.map((a, i) => (
            <motion.div
              key={a.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
              onMouseMove={trackMouse}
              className="relative group rounded-3xl p-7 overflow-hidden transition-all duration-700"
              style={{
                background: "linear-gradient(180deg, hsl(161 50% 8% / 0.6), hsl(161 50% 5% / 0.6))",
                border: "1px solid hsl(var(--gold-bright) / 0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* spotlight */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "radial-gradient(500px circle at var(--mx,50%) var(--my,0%), hsl(var(--gold-bright)/0.12), transparent 40%)" }} />

              <div className="relative flex items-start justify-between mb-6">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(var(--gold-bright)/0.18), hsl(var(--gold-bright)/0.04))", border: "1px solid hsl(var(--gold-bright)/0.3)" }}>
                  <a.icon className="h-5 w-5 text-[hsl(var(--gold-bright))]" strokeWidth={1.75} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold gold-text font-display tabular-nums">{a.metric}</div>
                  <div className="text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--cream)/0.5)] mt-0.5">{a.metricLabel}</div>
                </div>
              </div>

              <h3 className="text-lg font-semibold mb-2.5 font-display tracking-tight text-[hsl(var(--cream))]">
                {a.name}
              </h3>
              <p className="text-sm leading-relaxed text-[hsl(var(--cream)/0.65)]">
                {a.description}
              </p>

              <div className="mt-6 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gold-bright)/0.3)] to-transparent" />
              <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[hsl(var(--cream)/0.5)]">
                <Sparkles className="h-3 w-3 text-[hsl(var(--gold-bright))]" />
                Trained in-house · Continuous learning
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust strip */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[hsl(var(--gold-bright)/0.2)]">
          {[
            { v: "2.4M+", l: "Pages analyzed" },
            { v: "47", l: "Ranking dimensions" },
            { v: "94.2%", l: "Forecast accuracy" },
            { v: "<200ms", l: "Avg query latency" },
          ].map(s => (
            <div key={s.l} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gold-text font-display tabular-nums">{s.v}</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-[hsl(var(--cream)/0.5)] mt-2">{s.l}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ArrowRight, Mail, Globe, Target, DollarSign, CheckCircle } from "lucide-react";

const Contact = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", website: "", goal: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, val: string) => setFormData({ ...formData, [key]: val });

  const handleSubmit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-tight text-center">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 mb-6">
                <CheckCircle className="h-10 w-10 text-green-500" />
              </div>
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">Request Received!</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                Our team will review your information and reach out within 24 hours with a customized SEO strategy proposal.
              </p>
            </motion.div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-tight">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-sm font-semibold text-accent mb-3">Get Started</p>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Get Your Free <span className="gradient-text">SEO Strategy</span>
            </h1>
            <p className="text-muted-foreground">Tell us about your business and we'll craft a custom plan.</p>
          </motion.div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"
                }`}>{s}</div>
                {s < 3 && <div className={`w-12 h-0.5 rounded ${step > s ? "bg-accent" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="glass-card-elevated p-8 max-w-lg mx-auto">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">About You</h3>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
                  <input value={formData.name} onChange={e => update("name", e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                  <input type="email" value={formData.email} onChange={e => update("email", e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <button onClick={() => setStep(2)} className="btn-primary-gradient w-full gap-2 py-3 mt-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Your Business</h3>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Website URL</label>
                  <input value={formData.website} onChange={e => update("website", e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Primary Goal</label>
                  <select value={formData.goal} onChange={e => update("goal", e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent">
                    <option value="">Select a goal</option>
                    <option>Increase organic traffic</option>
                    <option>Improve local rankings</option>
                    <option>Technical SEO fix</option>
                    <option>Full SEO strategy</option>
                    <option>E-commerce SEO</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 rounded-xl bg-secondary text-foreground py-3 text-sm font-medium hover:bg-secondary/80 transition-colors">
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 btn-primary-gradient gap-2 py-3">
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">Budget & Details</h3>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Monthly Budget</label>
                  <select value={formData.budget} onChange={e => update("budget", e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent">
                    <option value="">Select budget range</option>
                    <option>$500 - $1,000</option>
                    <option>$1,000 - $2,500</option>
                    <option>$2,500 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000+</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Additional Details</label>
                  <textarea value={formData.message} onChange={e => update("message", e.target.value)} rows={3}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent resize-none" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="flex-1 rounded-xl bg-secondary text-foreground py-3 text-sm font-medium hover:bg-secondary/80 transition-colors">
                    Back
                  </button>
                  <button onClick={handleSubmit} className="flex-1 btn-primary-gradient gap-2 py-3">
                    Submit Request <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

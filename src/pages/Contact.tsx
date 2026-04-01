import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { ArrowRight, CheckCircle } from "lucide-react";

const Contact = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", website: "", goal: "", budget: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const update = (key: string, val: string) => setFormData({ ...formData, [key]: val });

  if (submitted) {
    return (
      <Layout>
        <section className="section-padding">
          <div className="container-tight text-center">
            <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">Request Received</h1>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">We'll review your information and reach out within 24 hours.</p>
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
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="label-overline mb-3">Contact</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">Get your free SEO strategy</h1>
            <p className="text-sm text-muted-foreground">Tell us about your business and goals.</p>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold ${step >= s ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"}`}>{s}</div>
                {s < 3 && <div className={`w-8 h-px ${step > s ? "bg-foreground" : "bg-border"}`} />}
              </div>
            ))}
          </div>

          <div className="surface-elevated p-6 max-w-md mx-auto">
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">About You</h3>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Full Name</label>
                  <input value={formData.name} onChange={e => update("name", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
                  <input type="email" value={formData.email} onChange={e => update("email", e.target.value)} className="input-premium" />
                </div>
                <button onClick={() => setStep(2)} className="btn-primary w-full gap-2">Continue <ArrowRight className="h-3.5 w-3.5" /></button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Your Business</h3>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Website URL</label>
                  <input value={formData.website} onChange={e => update("website", e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Primary Goal</label>
                  <select value={formData.goal} onChange={e => update("goal", e.target.value)} className="input-premium">
                    <option value="">Select a goal</option>
                    <option>Increase organic traffic</option>
                    <option>Improve local rankings</option>
                    <option>Technical SEO fix</option>
                    <option>Full SEO strategy</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1 gap-2">Continue <ArrowRight className="h-3.5 w-3.5" /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground mb-3">Budget & Details</h3>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Monthly Budget</label>
                  <select value={formData.budget} onChange={e => update("budget", e.target.value)} className="input-premium">
                    <option value="">Select range</option>
                    <option>$500 - $1,000</option>
                    <option>$1,000 - $2,500</option>
                    <option>$2,500 - $5,000</option>
                    <option>$5,000+</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1.5 block">Additional Details</label>
                  <textarea value={formData.message} onChange={e => update("message", e.target.value)} rows={3} className="input-premium resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1">Back</button>
                  <button onClick={() => setSubmitted(true)} className="btn-primary flex-1 gap-2">Submit <ArrowRight className="h-3.5 w-3.5" /></button>
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

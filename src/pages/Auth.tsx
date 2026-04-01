import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff, Zap, Shield, Brain, BarChart3 } from "lucide-react";
import { toast } from "sonner";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error("Login failed", { description: error.message });
        } else {
          toast.success("Welcome back!");
          navigate("/dashboard");
        }
      } else {
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password);
        if (error) {
          toast.error("Signup failed", { description: error.message });
        } else {
          toast.success("Account created!", { description: "Check your email to confirm, or sign in now." });
          setMode("login");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <section className="relative overflow-hidden min-h-[85vh] flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 grid-pattern opacity-[0.03]" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20" style={{ background: "hsl(var(--accent))" }} />

        <div className="relative w-full max-w-[440px] mx-auto px-5">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-5" style={{ background: "var(--gradient-accent)" }}>
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h1 className="font-display text-3xl font-bold text-white mb-3 tracking-tight">
                {mode === "login" ? "Welcome Back" : "Get Started Free"}
              </h1>
              <p className="text-sm text-white/50">
                {mode === "login" ? "Sign in to your SEO intelligence dashboard" : "Create your account and start dominating search"}
              </p>
            </div>

            {/* Card */}
            <div className="rounded-2xl bg-card border border-border/30 p-8" style={{ boxShadow: "var(--shadow-2xl)" }}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-[13px] font-medium text-foreground mb-2 block">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="input-premium pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[13px] font-medium text-foreground mb-2 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="input-premium pl-10 pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary-gradient w-full gap-2 py-3.5 mt-1">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                    <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button onClick={() => setMode(mode === "login" ? "signup" : "login")}
                    className="font-semibold text-accent hover:underline">
                    {mode === "login" ? "Sign up free" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>

            {/* Trust */}
            {mode === "signup" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="mt-8 flex items-center justify-center gap-6 text-white/30">
                <div className="flex items-center gap-1.5 text-[11px]"><Shield className="h-3.5 w-3.5" /> 2 Free Projects</div>
                <div className="flex items-center gap-1.5 text-[11px]"><Brain className="h-3.5 w-3.5" /> AI-Powered</div>
                <div className="flex items-center gap-1.5 text-[11px]"><BarChart3 className="h-3.5 w-3.5" /> No CC Required</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;

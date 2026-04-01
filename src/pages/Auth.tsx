import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff, Zap } from "lucide-react";
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
      <section className="section-padding flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-4">
              <Zap className="h-6 w-6 text-accent" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {mode === "login" ? "Sign in to your SEOPulse dashboard" : "Start tracking your SEO performance"}
            </p>
          </div>

          <div className="glass-card-elevated p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full rounded-xl border border-input bg-background pl-10 pr-10 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary-gradient w-full gap-2 py-3 mt-2">
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
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </div>

          {mode === "signup" && (
            <p className="text-xs text-muted-foreground text-center mt-4">
              Free plan includes 2 projects. No credit card required.
            </p>
          )}
        </motion.div>
      </section>
    </Layout>
  );
};

export default Auth;

import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
        if (error) { toast.error("Login failed", { description: error.message }); }
        else { toast.success("Welcome back!"); navigate("/dashboard"); }
      } else {
        if (password.length < 6) { toast.error("Password must be at least 6 characters"); setLoading(false); return; }
        const { error } = await signUp(email, password);
        if (error) { toast.error("Signup failed", { description: error.message }); }
        else { toast.success("Account created!", { description: "Check your email to confirm." }); setMode("login"); }
      }
    } finally { setLoading(false); }
  };

  return (
    <Layout>
      <Helmet>
        <title>{mode === "login" ? "Sign In" : "Create Account"} | SEOPulse</title>
        <meta name="description" content="Sign in or create your free SEOPulse account to access the SEO dashboard, save projects, and track your rankings." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-sm mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {mode === "login" ? "Sign in to your account" : "Start your free account"}
              </p>
            </div>

            <div className="surface-elevated p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="text-xs font-medium text-foreground mb-1.5 block">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required className="input-premium pl-9" autoComplete="email" />
                  </div>
                </div>
                <div>
                  <label htmlFor="password" className="text-xs font-medium text-foreground mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input id="password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} className="input-premium pl-9 pr-9" autoComplete={mode === "login" ? "current-password" : "new-password"} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label={showPassword ? "Hide password" : "Show password"}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full gap-2 py-3">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight className="h-3.5 w-3.5" /></>}
                </button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                {mode === "login" ? "No account?" : "Already have one?"}{" "}
                <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="font-medium text-accent hover:underline">
                  {mode === "login" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Auth;

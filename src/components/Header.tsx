import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon, LogIn, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Tools", href: "/tools", children: [
    { label: "AI SEO Audit", href: "/tools/ai-audit" },
    { label: "Keyword Research", href: "/tools/keywords" },
    { label: "Backlink Checker", href: "/tools/backlinks" },
    { label: "Schema Generator", href: "/tools/schema" },
  ]},
  { label: "Schema Library", href: "/schema-library" },
  { label: "Learning Hub", href: "/blog" },
  { label: "Services", href: "/services" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-transparent">
      <div className="absolute inset-0 bg-background/60 backdrop-blur-2xl" />
      <div className="container-wide relative flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
            <Zap className="h-4 w-4 text-white" />
          </div>
          <span className="font-display text-lg font-bold text-foreground tracking-tight">SEOPulse</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setHoveredNav(item.label)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <Link
                to={item.href}
                className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-[13px] font-medium transition-all duration-200 hover:bg-secondary/60 ${
                  location.pathname.startsWith(item.href) ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3 w-3" />}
              </Link>

              <AnimatePresence>
                {item.children && hoveredNav === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-56 rounded-2xl border border-border/40 bg-card p-1.5"
                    style={{ boxShadow: "var(--shadow-xl)" }}
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-xl px-3.5 py-2.5 text-[13px] text-muted-foreground transition-all duration-200 hover:bg-secondary/60 hover:text-foreground"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleDark}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all duration-200 hover:bg-secondary/60 hover:text-foreground"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <Link to="/dashboard" className="btn-primary-gradient hidden sm:inline-flex text-[13px] px-5 py-2.5 gap-2">
              <Zap className="h-3.5 w-3.5" /> Dashboard
            </Link>
          ) : (
            <Link to="/auth" className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-accent/20 bg-accent/5 px-5 py-2.5 text-[13px] font-medium text-accent hover:bg-accent/10 transition-all duration-200">
              <LogIn className="h-3.5 w-3.5" /> Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary/60"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-border/30 bg-card overflow-hidden relative"
          >
            <div className="container-wide py-4 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-7 py-2.5 text-sm text-muted-foreground hover:bg-secondary/60 transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="separator-gradient my-2" />
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="btn-primary-gradient mt-1 text-center text-sm"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

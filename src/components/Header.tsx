import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, Cloud } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Tools", href: "/tools", children: [
    { label: "AI SEO Audit", href: "/tools/ai-audit", desc: "200+ factor analysis" },
    { label: "Keyword Research", href: "/tools/keywords", desc: "Intent-driven discovery" },
    { label: "Backlink Checker", href: "/tools/backlinks", desc: "Authority mapping" },
    { label: "Schema Generator", href: "/tools/schema", desc: "JSON-LD builder" },
  ]},
  { label: "Schema Library", href: "/schema-library" },
  { label: "Schema Validator", href: "/schema-validator" },
  { label: "Learning Hub", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Services", href: "/services" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 mt-3">
        <div className="container-wide bg-background/70 backdrop-blur-2xl border border-border/60 rounded-2xl shadow-sm">
          <div className="flex h-14 items-center justify-between px-5">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-[hsl(var(--google-blue))] to-[hsl(var(--apple-purple))] flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Cloud className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-base font-bold text-foreground tracking-tight">SEO Cloud Lab</span>
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
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-all duration-200 ${
                      location.pathname.startsWith(item.href) 
                        ? "text-foreground bg-secondary/80" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {item.label}
                    {item.children && <ChevronDown className="h-3 w-3 opacity-50" />}
                  </Link>

                  <AnimatePresence>
                    {item.children && hoveredNav === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-0 mt-2 w-56 rounded-2xl border border-border bg-card/95 backdrop-blur-xl p-2 overflow-hidden"
                        style={{ boxShadow: 'var(--shadow-heavy)' }}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary group/item"
                          >
                            <span className="block text-[13px] font-medium text-foreground group-hover/item:text-accent transition-colors">
                              {child.label}
                            </span>
                            {'desc' in child && (
                              <span className="block text-[11px] text-muted-foreground mt-0.5">{child.desc}</span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <Link to="/dashboard" className="btn-primary-gradient text-[13px] px-5 py-2">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/auth" className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5">
                    <LogIn className="h-3.5 w-3.5" /> Sign In
                  </Link>
                  <Link to="/auth" className="hidden sm:inline-flex btn-rainbow text-[13px] px-5 py-2">
                    Get Started
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="flex lg:hidden h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden mx-4 mt-2 border border-border bg-card/95 backdrop-blur-xl rounded-2xl overflow-hidden"
            style={{ boxShadow: 'var(--shadow-heavy)' }}
          >
            <div className="p-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-8 py-2.5 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="separator-rainbow my-2" />
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn-rainbow text-center text-sm mt-1">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

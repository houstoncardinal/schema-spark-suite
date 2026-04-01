import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navItems = [
  { label: "Tools", href: "/tools", children: [
    { label: "AI SEO Audit", href: "/tools/ai-audit" },
    { label: "Keyword Research", href: "/tools/keywords" },
    { label: "Backlink Checker", href: "/tools/backlinks" },
    { label: "Schema Generator", href: "/tools/schema" },
  ]},
  { label: "Schema Library", href: "/schema-library" },
  { label: "Schema Validator", href: "/schema-validator" },
  { label: "Learning Hub", href: "/blog" },
  { label: "Services", href: "/services" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container-wide flex h-14 items-center justify-between">
        <Link to="/" className="text-base font-bold text-foreground tracking-tight">
          SEOPulse
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && setHoveredNav(item.label)}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <Link
                to={item.href}
                className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  location.pathname.startsWith(item.href) ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3 w-3" />}
              </Link>

              <AnimatePresence>
                {item.children && hoveredNav === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-48 rounded-xl border border-border bg-card p-1 shadow-lg"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-lg px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
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

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard" className="btn-primary text-[13px] px-4 py-2">
              Dashboard
            </Link>
          ) : (
            <Link to="/auth" className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              <LogIn className="h-3.5 w-3.5" /> Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex lg:hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
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
            className="lg:hidden border-t border-border bg-card overflow-hidden"
          >
            <div className="container-wide py-3 flex flex-col gap-0.5">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-6 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="h-px bg-border my-2" />
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="btn-primary text-center text-sm mt-1">
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

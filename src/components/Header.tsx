import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon, LogIn } from "lucide-react";
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

  const toggleDark = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">S</span>
          </div>
          <span className="font-display text-lg font-bold text-foreground">SEOPulse</span>
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
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${
                  location.pathname.startsWith(item.href) ? "text-accent" : "text-muted-foreground"
                }`}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3 w-3" />}
              </Link>

              <AnimatePresence>
                {item.children && hoveredNav === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-border bg-background p-2 shadow-lg"
                  >
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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

        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="hidden lg:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link to="/contact" className="btn-primary-gradient hidden sm:inline-flex text-sm px-5 py-2">
            Get SEO Strategy
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex lg:hidden h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary"
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
            className="lg:hidden border-t border-border bg-background overflow-hidden"
          >
            <div className="container-wide py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-lg px-6 py-2 text-sm text-muted-foreground hover:bg-secondary"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="btn-primary-gradient mt-2 text-center text-sm"
              >
                Get SEO Strategy
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

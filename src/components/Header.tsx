import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogIn, Mail, ShieldCheck, Globe2, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/Logo";

const navItems = [
  {
    label: "Platform",
    href: "/tools",
    children: [
      { label: "AI SEO Audit", href: "/tools/ai-audit", desc: "200+ factor analysis" },
      { label: "Keyword Research", href: "/tools/keywords", desc: "Intent-driven discovery" },
      { label: "Backlink Checker", href: "/tools/backlinks", desc: "Authority mapping" },
      { label: "Schema Generator", href: "/tools/schema", desc: "JSON-LD builder" },
    ],
  },
  {
    label: "Solutions",
    href: "/services",
    children: [
      { label: "Schema Library", href: "/schema-library", desc: "1000+ JSON-LD templates" },
      { label: "Schema Validator", href: "/schema-validator", desc: "Live structured data testing" },
      { label: "Managed Services", href: "/services", desc: "Done-for-you SEO programs" },
    ],
  },
  { label: "Learning Hub", href: "/blog" },
  { label: "Pricing", href: "/pricing" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top utility bar */}
      <div className="hidden md:block bg-neutral-950 text-neutral-300 text-[12px]">
        <div className="mx-auto max-w-[1400px] px-6 flex h-9 items-center justify-between">
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5 text-neutral-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Real-time crawl · Live SERP grounding
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-neutral-400">
              <Globe2 className="h-3.5 w-3.5 text-sky-400" />
              Powered by Google PageSpeed & proprietary scoring
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="mailto:sales@seocloudlab.io" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" /> sales@seocloudlab.io
            </a>
            <Link to="/contact" className="text-white/90 hover:text-white font-medium inline-flex items-center gap-1">
              Contact Sales <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main header bar — solid white, full width */}
      <div
        className={`bg-white border-b transition-shadow duration-300 ${
          scrolled ? "border-neutral-200 shadow-[0_4px_20px_-8px_rgba(15,23,42,0.12)]" : "border-neutral-100"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-4 md:px-6">
          <div className="flex h-[68px] items-center justify-between">
            <Logo variant="light" />

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.children && setHoveredNav(item.label)}
                    onMouseLeave={() => setHoveredNav(null)}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center gap-1 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold tracking-tight transition-colors ${
                        active
                          ? "text-neutral-900"
                          : "text-neutral-600 hover:text-neutral-900"
                      }`}
                    >
                      {item.label}
                      {item.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" />}
                    </Link>
                    {active && (
                      <span className="absolute left-3.5 right-3.5 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-[#4285F4] via-[#34A853] to-[#EA4335]" />
                    )}

                    <AnimatePresence>
                      {item.children && hoveredNav === item.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                          className="absolute top-full left-0 mt-2 w-72 rounded-2xl border border-neutral-200 bg-white p-2 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.18)]"
                        >
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-neutral-50 group/item"
                            >
                              <span className="block text-[13.5px] font-semibold text-neutral-900 group-hover/item:text-[#4285F4] transition-colors">
                                {child.label}
                              </span>
                              <span className="block text-[11.5px] text-neutral-500 mt-0.5">{child.desc}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
              {user ? (
                <Link
                  to="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-neutral-800 transition-colors"
                >
                  Open Dashboard <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-semibold text-neutral-700 hover:text-neutral-900 transition-colors"
                  >
                    <LogIn className="h-3.5 w-3.5" /> Sign In
                  </Link>
                  <Link
                    to="/contact"
                    className="hidden md:inline-flex items-center rounded-xl border border-neutral-200 px-4 py-2 text-[13px] font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    Book a Demo
                  </Link>
                  <Link
                    to="/auth"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-neutral-900 px-4 py-2 text-[13px] font-semibold text-white hover:bg-neutral-800 transition-colors"
                  >
                    Start Free <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
                className="flex lg:hidden h-10 w-10 items-center justify-center rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
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
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden bg-white border-b border-neutral-200 overflow-hidden shadow-[0_20px_40px_-12px_rgba(15,23,42,0.15)]"
          >
            <div className="px-4 py-4 flex flex-col gap-0.5 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold transition-colors ${
                      location.pathname === item.href
                        ? "bg-neutral-100 text-neutral-900"
                        : "text-neutral-900 hover:bg-neutral-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.children && <ChevronDown className="h-4 w-4 text-neutral-400" />}
                  </Link>
                  {item.children?.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex flex-col rounded-xl px-8 py-2.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                    >
                      <span className="font-medium">{child.label}</span>
                      <span className="text-[11px] text-neutral-400 mt-0.5">{child.desc}</span>
                    </Link>
                  ))}
                </div>
              ))}
              <div className="h-px bg-neutral-200 my-3" />
              {user ? (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Open Dashboard
                </Link>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    <LogIn className="h-4 w-4" /> Sign In
                  </Link>
                  <Link
                    to="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl border border-neutral-200 px-4 py-3 text-center text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors"
                  >
                    Book a Demo
                  </Link>
                  <Link
                    to="/auth"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    Start Free
                  </Link>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col gap-2 text-[12px] text-neutral-500">
                <a href="tel:+18005550100" className="inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> +1 (800) 555-0100</a>
                <a href="mailto:sales@seocloudlab.io" className="inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> sales@seocloudlab.io</a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

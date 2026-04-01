import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const footerSections = [
  {
    title: "SEO Tools",
    links: [
      { label: "AI SEO Audit", href: "/tools/ai-audit" },
      { label: "Keyword Research", href: "/tools/keywords" },
      { label: "Backlink Checker", href: "/tools/backlinks" },
      { label: "Schema Generator", href: "/tools/schema" },
    ],
  },
  {
    title: "Schema Library",
    links: [
      { label: "Article Schema", href: "/schema-library" },
      { label: "LocalBusiness", href: "/schema-library" },
      { label: "Product Schema", href: "/schema-library" },
      { label: "FAQ Schema", href: "/schema-library" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learning Hub", href: "/blog" },
      { label: "Case Studies", href: "/services" },
      { label: "SEO Consulting", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-card/50">
      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">
          <div className="col-span-2 md:col-span-1 mb-2 md:mb-0">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold text-foreground tracking-tight">SEOPulse</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The AI-powered SEO intelligence platform trusted by 10,000+ professionals worldwide.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-[13px] font-semibold text-foreground mb-4 tracking-tight">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="separator-gradient my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} SEOPulse. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="text-xs text-muted-foreground/60 hover:text-accent transition-colors duration-200">Privacy</Link>
            <Link to="/" className="text-xs text-muted-foreground/60 hover:text-accent transition-colors duration-200">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

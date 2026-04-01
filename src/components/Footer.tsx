import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "SEO Tools",
    links: [
      { label: "SEO Analyzer", href: "/tools/analyzer" },
      { label: "Keyword Research", href: "/tools/keywords" },
      { label: "Backlink Checker", href: "/tools/backlinks" },
      { label: "Schema Generator", href: "/tools/schema-generator" },
      { label: "On-Page Checker", href: "/tools/on-page" },
    ],
  },
  {
    title: "Schema Library",
    links: [
      { label: "Article Schema", href: "/schema-library" },
      { label: "LocalBusiness", href: "/schema-library" },
      { label: "Product Schema", href: "/schema-library" },
      { label: "FAQ Schema", href: "/schema-library" },
      { label: "Organization", href: "/schema-library" },
    ],
  },
  {
    title: "Learning Hub",
    links: [
      { label: "Technical SEO", href: "/blog" },
      { label: "Local SEO", href: "/blog" },
      { label: "Schema & Structured Data", href: "/blog" },
      { label: "AI + SEO", href: "/blog" },
      { label: "Case Studies", href: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "SEO Consulting", href: "/services" },
      { label: "Technical Audits", href: "/services" },
      { label: "Local SEO", href: "/services" },
      { label: "Enterprise SEO", href: "/services" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container-wide section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">S</span>
              </div>
              <span className="font-display text-lg font-bold text-foreground">SEOPulse</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              The ultimate SEO intelligence platform. Analyze, optimize, and scale your organic rankings.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display text-sm font-semibold text-foreground mb-4">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SEOPulse. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/" className="text-xs text-muted-foreground hover:text-accent transition-colors">Privacy</Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-accent transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "AI SEO Audit", href: "/tools/ai-audit" },
      { label: "Keyword Research", href: "/tools/keywords" },
      { label: "Backlink Checker", href: "/tools/backlinks" },
      { label: "Schema Generator", href: "/tools/schema" },
    ],
  },
  {
    title: "Schema",
    links: [
      { label: "Schema Library", href: "/schema-library" },
      { label: "Schema Validator", href: "/schema-validator" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Learning Hub", href: "/blog" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/auth" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-[#fafafa] dark:bg-card">
      <div className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-1 mb-4 group">
              <img src="/images/logo.png" alt="SEO Cloud Labs" className="h-14 group-hover:scale-105 transition-transform duration-300" />
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
              AI-powered SEO intelligence for professionals who demand real data.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-semibold text-gray-900 dark:text-foreground uppercase tracking-wider mb-4">{group.title}</p>
              <div className="space-y-2.5">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block text-sm text-gray-500 hover:text-gray-900 dark:text-muted-foreground dark:hover:text-foreground transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="separator-rainbow mb-8" />
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} SEO Cloud Labs. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            The Ultimate SEO Business Suite
          </p>
        </div>
      </div>
    </footer>
  );
}

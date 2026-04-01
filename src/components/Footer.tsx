import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border py-12">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Product</p>
            <div className="space-y-2">
              <Link to="/tools/ai-audit" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">AI SEO Audit</Link>
              <Link to="/tools/keywords" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Keyword Research</Link>
              <Link to="/tools/backlinks" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Backlink Checker</Link>
              <Link to="/tools/schema" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Schema Generator</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Schema</p>
            <div className="space-y-2">
              <Link to="/schema-library" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Schema Library</Link>
              <Link to="/schema-validator" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Schema Validator</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Resources</p>
            <div className="space-y-2">
              <Link to="/blog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Learning Hub</Link>
              <Link to="/services" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link>
              <Link to="/contact" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Account</p>
            <div className="space-y-2">
              <Link to="/auth" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/dashboard" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard</Link>
            </div>
          </div>
        </div>
        <div className="h-px bg-border mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} SEOPulse. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">AI-Powered SEO Intelligence Platform</p>
        </div>
      </div>
    </footer>
  );
}

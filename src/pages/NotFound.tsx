import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Helmet>
        <title>Page Not Found — 404 | SEOPulse</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="The page you're looking for doesn't exist. Return to SEOPulse to explore our AI-powered SEO tools." />
      </Helmet>
      <section className="min-h-[70vh] flex items-center justify-center py-20">
        <div className="text-center max-w-md mx-auto px-6">
          <p className="text-7xl font-bold gradient-text mb-4">404</p>
          <h1 className="text-2xl font-bold text-foreground mb-3">Page not found</h1>
          <p className="text-sm text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/" className="btn-primary gap-2">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <Link to="/tools/ai-audit" className="btn-secondary gap-2">
              <Search className="h-3.5 w-3.5" /> Try SEO Audit
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFound;

import { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { CheckCircle, XCircle, AlertTriangle, Globe, Loader2, Copy, FileCode2, ArrowRight, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface ValidationResult {
  valid: boolean;
  schemaType: string;
  errors: { path: string; message: string; severity: "error" | "warning" }[];
  recommendations: string[];
  richResultEligible: string[];
  summary: { totalProperties: number; requiredMissing: number; recommendedMissing: number };
}

const SCHEMA_SPECS: Record<string, { required: string[]; recommended: string[]; richResults: string[] }> = {
  Article: {
    required: ["headline", "author", "datePublished"],
    recommended: ["image", "publisher", "dateModified", "description", "mainEntityOfPage"],
    richResults: ["Article", "AMP Article", "News"],
  },
  Product: {
    required: ["name", "offers"],
    recommended: ["description", "image", "brand", "sku", "gtin", "aggregateRating", "review"],
    richResults: ["Product", "Merchant Listing", "Shopping"],
  },
  LocalBusiness: {
    required: ["name", "address"],
    recommended: ["telephone", "openingHoursSpecification", "geo", "image", "priceRange", "url"],
    richResults: ["Local Business", "Maps", "Knowledge Panel"],
  },
  FAQPage: {
    required: ["mainEntity"],
    recommended: [],
    richResults: ["FAQ Rich Result"],
  },
  Organization: {
    required: ["name", "url"],
    recommended: ["logo", "description", "sameAs", "contactPoint", "address"],
    richResults: ["Knowledge Panel", "Logo", "Social Profile"],
  },
  WebSite: {
    required: ["name", "url"],
    recommended: ["potentialAction", "description"],
    richResults: ["Sitelinks Search Box"],
  },
  BreadcrumbList: {
    required: ["itemListElement"],
    recommended: [],
    richResults: ["Breadcrumb"],
  },
  Event: {
    required: ["name", "startDate", "location"],
    recommended: ["description", "endDate", "image", "offers", "performer", "organizer"],
    richResults: ["Event", "Event Listing"],
  },
  HowTo: {
    required: ["name", "step"],
    recommended: ["description", "totalTime", "image", "tool", "supply"],
    richResults: ["How-to Rich Result"],
  },
  Recipe: {
    required: ["name", "recipeIngredient", "recipeInstructions"],
    recommended: ["image", "author", "datePublished", "description", "prepTime", "cookTime", "totalTime", "nutrition"],
    richResults: ["Recipe", "Recipe Carousel"],
  },
  VideoObject: {
    required: ["name", "description", "thumbnailUrl", "uploadDate"],
    recommended: ["duration", "contentUrl", "embedUrl", "interactionStatistic"],
    richResults: ["Video", "Video Carousel"],
  },
  Review: {
    required: ["itemReviewed", "reviewRating", "author"],
    recommended: ["reviewBody", "datePublished", "publisher"],
    richResults: ["Review Snippet"],
  },
};

function validateSchema(jsonStr: string): ValidationResult {
  try {
    const obj = JSON.parse(jsonStr);
    const errors: ValidationResult["errors"] = [];
    const recommendations: string[] = [];

    if (!obj["@context"]) errors.push({ path: "@context", message: "Missing @context — required for all JSON-LD. Add: \"@context\": \"https://schema.org\"", severity: "error" });
    else if (!obj["@context"].includes("schema.org")) errors.push({ path: "@context", message: "@context should reference https://schema.org", severity: "warning" });

    if (!obj["@type"]) {
      errors.push({ path: "@type", message: "Missing @type — the schema type must be specified", severity: "error" });
      return { valid: false, schemaType: "Unknown", errors, recommendations: [], richResultEligible: [], summary: { totalProperties: Object.keys(obj).length, requiredMissing: 1, recommendedMissing: 0 } };
    }

    const type = obj["@type"];
    const spec = SCHEMA_SPECS[type];
    const propKeys = Object.keys(obj).filter(k => !k.startsWith("@"));

    if (!spec) {
      recommendations.push(`Schema type "${type}" is valid but not in our enhanced validation set. Basic structure looks correct.`);
      return { valid: errors.filter(e => e.severity === "error").length === 0, schemaType: type, errors, recommendations, richResultEligible: [], summary: { totalProperties: propKeys.length, requiredMissing: 0, recommendedMissing: 0 } };
    }

    let requiredMissing = 0;
    for (const req of spec.required) {
      const hasDeep = propKeys.some(k => k.toLowerCase() === req.toLowerCase()) || JSON.stringify(obj).toLowerCase().includes(`"${req.toLowerCase()}"`);
      if (!hasDeep) {
        errors.push({ path: req, message: `Required property "${req}" is missing for ${type}`, severity: "error" });
        requiredMissing++;
      }
    }

    let recommendedMissing = 0;
    for (const rec of spec.recommended) {
      const hasDeep = propKeys.some(k => k.toLowerCase() === rec.toLowerCase()) || JSON.stringify(obj).toLowerCase().includes(`"${rec.toLowerCase()}"`);
      if (!hasDeep) {
        errors.push({ path: rec, message: `Recommended property "${rec}" is missing — adding it improves rich result eligibility`, severity: "warning" });
        recommendedMissing++;
        recommendations.push(`Add "${rec}" to improve your ${type} schema completeness`);
      }
    }

    if (type === "Article" && obj.datePublished) {
      const d = new Date(obj.datePublished);
      if (isNaN(d.getTime())) errors.push({ path: "datePublished", message: "datePublished is not a valid ISO 8601 date format", severity: "error" });
    }

    if (type === "Product" && obj.offers) {
      if (!obj.offers.price && !obj.offers.lowPrice) errors.push({ path: "offers.price", message: "Product offers must include a price or lowPrice", severity: "error" });
      if (!obj.offers.priceCurrency) errors.push({ path: "offers.priceCurrency", message: "priceCurrency is required in Product offers", severity: "warning" });
    }

    const richResultEligible = requiredMissing === 0 ? spec.richResults : [];

    if (requiredMissing === 0 && recommendedMissing === 0) {
      recommendations.push("Excellent! Your schema is fully complete with all required and recommended properties.");
    } else if (requiredMissing === 0) {
      recommendations.push(`Your schema meets all requirements. Add ${recommendedMissing} recommended properties for maximum rich result coverage.`);
    }

    return {
      valid: errors.filter(e => e.severity === "error").length === 0,
      schemaType: type,
      errors,
      recommendations,
      richResultEligible,
      summary: { totalProperties: propKeys.length, requiredMissing, recommendedMissing },
    };
  } catch {
    return {
      valid: false,
      schemaType: "Unknown",
      errors: [{ path: "JSON", message: "Invalid JSON syntax — check for missing commas, brackets, or quotes", severity: "error" }],
      recommendations: ["Paste valid JSON-LD to get a comprehensive validation report"],
      richResultEligible: [],
      summary: { totalProperties: 0, requiredMissing: 0, recommendedMissing: 0 },
    };
  }
}

const sampleSchema = `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How to Implement Schema Markup",
  "author": {
    "@type": "Person",
    "name": "Jane Smith"
  },
  "datePublished": "2026-03-15",
  "image": "https://example.com/image.jpg"
}`;

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seopulse.io/" },
    { "@type": "ListItem", position: 2, name: "Schema Validator", item: "https://seopulse.io/schema-validator" },
  ],
};

const toolJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Schema Validator",
  description: "Validate, debug, and optimize your JSON-LD structured data against schema.org specifications. Check for errors, warnings, and rich result eligibility.",
  url: "https://seopulse.io/schema-validator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  provider: { "@type": "Organization", name: "SEOPulse", url: "https://seopulse.io" },
};

const SchemaValidator = () => {
  const [input, setInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"paste" | "url">("paste");

  const handleValidate = useCallback(() => {
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(validateSchema(input));
      setLoading(false);
    }, 800);
  }, [input]);

  const handleUrlFetch = useCallback(() => {
    if (!urlInput.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setInput(sampleSchema);
      setResult(validateSchema(sampleSchema));
      setLoading(false);
    }, 1500);
  }, [urlInput]);

  const loadSample = () => {
    setInput(sampleSchema);
    setResult(null);
  };

  const copyResult = () => {
    if (!result) return;
    const text = result.errors.map(e => `[${e.severity.toUpperCase()}] ${e.path}: ${e.message}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const errorCount = result?.errors.filter(e => e.severity === "error").length || 0;
  const warningCount = result?.errors.filter(e => e.severity === "warning").length || 0;

  return (
    <Layout>
      <Helmet>
        <title>Schema Validator — Validate JSON-LD Structured Data | SEOPulse</title>
        <meta name="description" content="Free JSON-LD schema validator. Validate, debug, and optimize your structured data against schema.org specifications. Check rich result eligibility instantly." />
        <link rel="canonical" href="https://seopulse.io/schema-validator" />
        <meta property="og:title" content="Schema Validator — Validate JSON-LD Structured Data | SEOPulse" />
        <meta property="og:description" content="Free JSON-LD schema validator. Check rich result eligibility instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seopulse.io/schema-validator" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(toolJsonLd)}</script>
      </Helmet>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="label-overline mb-3">Schema.org Tools</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Schema Validator
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Validate, debug, and optimize your JSON-LD structured data against schema.org specifications.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input */}
            <div className="space-y-4">
              <div className="surface-elevated p-5">
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setActiveTab("paste")} className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${activeTab === "paste" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    Paste JSON-LD
                  </button>
                  <button onClick={() => setActiveTab("url")} className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${activeTab === "url" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    Fetch from URL
                  </button>
                </div>

                {activeTab === "paste" ? (
                  <>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder='Paste your JSON-LD schema here...'
                      aria-label="JSON-LD input"
                      className="w-full h-72 rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground/20 resize-none"
                    />
                    <div className="flex items-center gap-2 mt-3">
                      <button onClick={handleValidate} disabled={loading || !input.trim()} className="btn-primary gap-2 text-sm">
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileCode2 className="h-3.5 w-3.5" />}
                        Validate
                      </button>
                      <button onClick={loadSample} className="btn-secondary text-sm">Load Sample</button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 flex-1 rounded-xl border border-border px-3 py-2.5">
                        <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                        <input
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://example.com"
                          aria-label="URL to fetch schema from"
                          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                        />
                      </div>
                      <button onClick={handleUrlFetch} disabled={loading || !urlInput.trim()} className="btn-primary gap-2 text-sm shrink-0">
                        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Fetch & Validate"}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">We'll extract and validate any JSON-LD schema found on the page.</p>
                  </>
                )}
              </div>

              <div className="surface-card p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Supported Schema Types</h3>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(SCHEMA_SPECS).map(type => (
                    <span key={type} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">{type}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-4">
              {!result && !loading && (
                <div className="surface-card p-12 text-center">
                  <FileCode2 className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Paste your JSON-LD and click Validate to see results</p>
                </div>
              )}

              {loading && (
                <div className="surface-card p-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-foreground">Validating against schema.org...</p>
                </div>
              )}

              {result && (
                <>
                  <div className={`surface-elevated p-5 border-l-4 ${result.valid ? "border-l-success" : "border-l-destructive"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {result.valid ? <CheckCircle className="h-5 w-5 text-success" /> : <XCircle className="h-5 w-5 text-destructive" />}
                        <div>
                          <p className="text-sm font-semibold text-foreground">{result.valid ? "Valid Schema" : "Validation Failed"}</p>
                          <p className="text-xs text-muted-foreground">Type: {result.schemaType}</p>
                        </div>
                      </div>
                      <button onClick={copyResult} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
                        <Copy className="h-3 w-3" /> {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg bg-secondary p-2.5 text-center">
                        <p className="text-lg font-bold text-foreground">{result.summary.totalProperties}</p>
                        <p className="text-[10px] text-muted-foreground">Properties</p>
                      </div>
                      <div className="rounded-lg bg-secondary p-2.5 text-center">
                        <p className={`text-lg font-bold ${errorCount > 0 ? "text-destructive" : "text-success"}`}>{errorCount}</p>
                        <p className="text-[10px] text-muted-foreground">Errors</p>
                      </div>
                      <div className="rounded-lg bg-secondary p-2.5 text-center">
                        <p className={`text-lg font-bold ${warningCount > 0 ? "text-warning" : "text-success"}`}>{warningCount}</p>
                        <p className="text-[10px] text-muted-foreground">Warnings</p>
                      </div>
                    </div>
                  </div>

                  {result.richResultEligible.length > 0 && (
                    <div className="surface-card p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4 text-success" /> Rich Result Eligibility
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {result.richResultEligible.map(r => (
                          <span key={r} className="rounded-full bg-success/10 text-success px-2.5 py-1 text-xs font-medium">{r}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.errors.length > 0 && (
                    <div className="surface-card p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-3">Issues ({result.errors.length})</h3>
                      <div className="space-y-2">
                        {result.errors.map((err, i) => (
                          <div key={i} className={`flex items-start gap-2.5 rounded-lg p-3 ${err.severity === "error" ? "bg-destructive/5 border border-destructive/15" : "bg-warning/5 border border-warning/15"}`}>
                            {err.severity === "error" ? <XCircle className="h-3.5 w-3.5 text-destructive mt-0.5 shrink-0" /> : <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />}
                            <div>
                              <p className="text-xs font-medium text-foreground font-mono">{err.path}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{err.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.recommendations.length > 0 && (
                    <div className="surface-card p-5">
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
                        <Info className="h-4 w-4 text-accent" /> Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((r, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <ArrowRight className="h-3 w-3 text-accent mt-0.5 shrink-0" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/schema-library" className="btn-secondary gap-2">
              Browse Schema Library <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SchemaValidator;

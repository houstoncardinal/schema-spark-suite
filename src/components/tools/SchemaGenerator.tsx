import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Code, Loader2, ArrowRight, CheckCircle, Copy, Plus, Trash2, FileCode2 } from "lucide-react";

type SchemaType = "Article" | "LocalBusiness" | "Product" | "FAQ" | "Organization" | "BreadcrumbList" | "WebSite" | "Service" | "Event" | "HowTo";

interface SchemaField {
  key: string;
  value: string;
  required: boolean;
}

const schemaTemplates: Record<SchemaType, { fields: SchemaField[]; description: string }> = {
  Article: {
    description: "Blog posts, news articles, editorial content",
    fields: [
      { key: "headline", value: "", required: true },
      { key: "author", value: "", required: true },
      { key: "datePublished", value: new Date().toISOString().split("T")[0], required: true },
      { key: "image", value: "", required: false },
      { key: "publisher", value: "", required: false },
      { key: "description", value: "", required: false },
    ],
  },
  LocalBusiness: {
    description: "Local businesses for Maps & local pack",
    fields: [
      { key: "name", value: "", required: true },
      { key: "streetAddress", value: "", required: true },
      { key: "city", value: "", required: true },
      { key: "state", value: "", required: true },
      { key: "telephone", value: "", required: false },
      { key: "openingHours", value: "Mo-Fr 09:00-17:00", required: false },
      { key: "priceRange", value: "$$", required: false },
    ],
  },
  Product: {
    description: "E-commerce products with price & availability",
    fields: [
      { key: "name", value: "", required: true },
      { key: "description", value: "", required: true },
      { key: "price", value: "", required: true },
      { key: "currency", value: "USD", required: true },
      { key: "availability", value: "InStock", required: false },
      { key: "brand", value: "", required: false },
      { key: "sku", value: "", required: false },
    ],
  },
  FAQ: {
    description: "FAQ pages for rich result dropdowns",
    fields: [
      { key: "question1", value: "", required: true },
      { key: "answer1", value: "", required: true },
      { key: "question2", value: "", required: false },
      { key: "answer2", value: "", required: false },
      { key: "question3", value: "", required: false },
      { key: "answer3", value: "", required: false },
    ],
  },
  Organization: {
    description: "Company info for knowledge panel",
    fields: [
      { key: "name", value: "", required: true },
      { key: "url", value: "", required: true },
      { key: "logo", value: "", required: false },
      { key: "description", value: "", required: false },
      { key: "email", value: "", required: false },
      { key: "sameAs", value: "", required: false },
    ],
  },
  BreadcrumbList: {
    description: "Breadcrumb navigation for SERPs",
    fields: [
      { key: "item1_name", value: "Home", required: true },
      { key: "item1_url", value: "", required: true },
      { key: "item2_name", value: "", required: false },
      { key: "item2_url", value: "", required: false },
      { key: "item3_name", value: "", required: false },
      { key: "item3_url", value: "", required: false },
    ],
  },
  WebSite: {
    description: "Sitelinks search box in Google",
    fields: [
      { key: "name", value: "", required: true },
      { key: "url", value: "", required: true },
      { key: "searchUrl", value: "", required: false },
    ],
  },
  Service: {
    description: "Professional services with areas served",
    fields: [
      { key: "name", value: "", required: true },
      { key: "provider", value: "", required: true },
      { key: "description", value: "", required: false },
      { key: "areaServed", value: "", required: false },
      { key: "serviceType", value: "", required: false },
    ],
  },
  Event: {
    description: "Events with dates, location, tickets",
    fields: [
      { key: "name", value: "", required: true },
      { key: "startDate", value: "", required: true },
      { key: "location", value: "", required: true },
      { key: "description", value: "", required: false },
      { key: "endDate", value: "", required: false },
      { key: "ticketUrl", value: "", required: false },
    ],
  },
  HowTo: {
    description: "Step-by-step instructions for rich results",
    fields: [
      { key: "name", value: "", required: true },
      { key: "step1_name", value: "", required: true },
      { key: "step1_text", value: "", required: true },
      { key: "step2_name", value: "", required: false },
      { key: "step2_text", value: "", required: false },
      { key: "totalTime", value: "", required: false },
    ],
  },
};

function generateJsonLd(type: SchemaType, fields: SchemaField[]): string {
  const getVal = (key: string) => fields.find(f => f.key === key)?.value || "";

  const builders: Record<SchemaType, () => object> = {
    Article: () => ({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: getVal("headline") || "Article Title",
      author: { "@type": "Person", name: getVal("author") || "Author Name" },
      datePublished: getVal("datePublished"),
      ...(getVal("image") && { image: getVal("image") }),
      ...(getVal("publisher") && { publisher: { "@type": "Organization", name: getVal("publisher") } }),
      ...(getVal("description") && { description: getVal("description") }),
    }),
    LocalBusiness: () => ({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      name: getVal("name") || "Business Name",
      address: {
        "@type": "PostalAddress",
        streetAddress: getVal("streetAddress"),
        addressLocality: getVal("city"),
        addressRegion: getVal("state"),
      },
      ...(getVal("telephone") && { telephone: getVal("telephone") }),
      ...(getVal("openingHours") && { openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "17:00" } }),
      ...(getVal("priceRange") && { priceRange: getVal("priceRange") }),
    }),
    Product: () => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: getVal("name") || "Product Name",
      description: getVal("description"),
      offers: {
        "@type": "Offer",
        price: getVal("price"),
        priceCurrency: getVal("currency") || "USD",
        availability: `https://schema.org/${getVal("availability") || "InStock"}`,
      },
      ...(getVal("brand") && { brand: { "@type": "Brand", name: getVal("brand") } }),
      ...(getVal("sku") && { sku: getVal("sku") }),
    }),
    FAQ: () => {
      const questions = [];
      for (let i = 1; i <= 3; i++) {
        const q = getVal(`question${i}`);
        const a = getVal(`answer${i}`);
        if (q && a) questions.push({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } });
      }
      return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: questions };
    },
    Organization: () => ({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: getVal("name") || "Organization Name",
      url: getVal("url"),
      ...(getVal("logo") && { logo: getVal("logo") }),
      ...(getVal("description") && { description: getVal("description") }),
      ...(getVal("email") && { email: getVal("email") }),
      ...(getVal("sameAs") && { sameAs: getVal("sameAs").split(",").map(s => s.trim()) }),
    }),
    BreadcrumbList: () => {
      const items = [];
      for (let i = 1; i <= 3; i++) {
        const name = getVal(`item${i}_name`);
        const url = getVal(`item${i}_url`);
        if (name) items.push({ "@type": "ListItem", position: i, name, ...(url && { item: url }) });
      }
      return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items };
    },
    WebSite: () => ({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: getVal("name"),
      url: getVal("url"),
      ...(getVal("searchUrl") && { potentialAction: { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: getVal("searchUrl") }, "query-input": "required name=search_term_string" } }),
    }),
    Service: () => ({
      "@context": "https://schema.org",
      "@type": "Service",
      name: getVal("name"),
      provider: { "@type": "Organization", name: getVal("provider") },
      ...(getVal("description") && { description: getVal("description") }),
      ...(getVal("areaServed") && { areaServed: getVal("areaServed") }),
      ...(getVal("serviceType") && { serviceType: getVal("serviceType") }),
    }),
    Event: () => ({
      "@context": "https://schema.org",
      "@type": "Event",
      name: getVal("name"),
      startDate: getVal("startDate"),
      location: { "@type": "Place", name: getVal("location") },
      ...(getVal("description") && { description: getVal("description") }),
      ...(getVal("endDate") && { endDate: getVal("endDate") }),
      ...(getVal("ticketUrl") && { offers: { "@type": "Offer", url: getVal("ticketUrl") } }),
    }),
    HowTo: () => {
      const steps = [];
      for (let i = 1; i <= 2; i++) {
        const name = getVal(`step${i}_name`);
        const text = getVal(`step${i}_text`);
        if (name) steps.push({ "@type": "HowToStep", name, text: text || name });
      }
      return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: getVal("name"),
        step: steps,
        ...(getVal("totalTime") && { totalTime: getVal("totalTime") }),
      };
    },
  };

  return JSON.stringify(builders[type](), null, 2);
}

function validateJsonLd(json: string): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  try {
    const obj = JSON.parse(json);
    if (!obj["@context"]) errors.push("Missing @context — required for valid JSON-LD");
    if (!obj["@type"]) errors.push("Missing @type — schema type not specified");
    if (obj["@type"] === "Article" && !obj.headline) errors.push("Article: 'headline' is required");
    if (obj["@type"] === "Article" && !obj.author) warnings.push("Article: 'author' recommended for E-E-A-T");
    if (obj["@type"] === "Product" && !obj.offers?.price) errors.push("Product: 'price' is required in offers");
    if (obj["@type"] === "LocalBusiness" && !obj.address) errors.push("LocalBusiness: 'address' is required");
    if (obj["@type"] === "FAQPage" && (!obj.mainEntity || obj.mainEntity.length === 0)) errors.push("FAQ: At least one question required");
    if (!obj.description && ["Article", "Product", "Service"].includes(obj["@type"])) warnings.push(`${obj["@type"]}: 'description' recommended`);
    if (errors.length === 0 && warnings.length === 0) warnings.push("Schema is valid — no issues detected");
    return { valid: errors.length === 0, errors, warnings };
  } catch (e) {
    return { valid: false, errors: ["Invalid JSON syntax — check for missing commas or brackets"], warnings: [] };
  }
}

const schemaTypes = Object.keys(schemaTemplates) as SchemaType[];

export function SchemaGenerator() {
  const [selectedType, setSelectedType] = useState<SchemaType>("Article");
  const [fields, setFields] = useState<SchemaField[]>([...schemaTemplates.Article.fields]);
  const [generated, setGenerated] = useState<string>("");
  const [validation, setValidation] = useState<{ valid: boolean; errors: string[]; warnings: string[] } | null>(null);
  const [copied, setCopied] = useState(false);

  const selectType = (type: SchemaType) => {
    setSelectedType(type);
    setFields([...schemaTemplates[type].fields]);
    setGenerated("");
    setValidation(null);
  };

  const updateField = (index: number, value: string) => {
    setFields(prev => prev.map((f, i) => i === index ? { ...f, value } : f));
  };

  const generate = () => {
    const json = generateJsonLd(selectedType, fields);
    setGenerated(json);
    setValidation(validateJsonLd(json));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Schema type selector */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Select Schema Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {schemaTypes.map(type => (
            <button
              key={type}
              onClick={() => selectType(type)}
              className={`rounded-xl px-3 py-3 text-xs font-medium transition-all text-center ${
                selectedType === type
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <FileCode2 className="h-4 w-4 mx-auto mb-1" />
              {type}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">{schemaTemplates[selectedType].description}</p>
      </div>

      {/* Field editor */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Configure Fields</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {fields.map((field, i) => (
            <div key={field.key} className="relative">
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                {field.key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/(\d)/g, " $1").trim()}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => updateField(i, e.target.value)}
                placeholder={`Enter ${field.key}...`}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>
          ))}
        </div>
        <button onClick={generate} className="btn-primary-gradient gap-2 mt-6">
          <Code className="h-4 w-4" /> Generate JSON-LD
        </button>
      </div>

      {/* Generated output */}
      {generated && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card-float p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-sm font-semibold text-foreground">Generated JSON-LD</h3>
              <button onClick={copyCode} className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
                {copied ? <><CheckCircle className="h-3.5 w-3.5 text-success" /> Copied</> : <><Copy className="h-3.5 w-3.5" /> Copy</>}
              </button>
            </div>
            <div className="relative rounded-xl bg-primary/5 p-4 overflow-x-auto">
              <pre className="text-xs text-foreground font-mono whitespace-pre">{generated}</pre>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Add this inside a <code className="bg-secondary px-1 rounded text-foreground">&lt;script type="application/ld+json"&gt;</code> tag in your page's <code className="bg-secondary px-1 rounded text-foreground">&lt;head&gt;</code>.
            </p>
          </div>

          {/* Validation */}
          {validation && (
            <div className="glass-card-float p-6">
              <div className="flex items-center gap-2 mb-3">
                {validation.valid ? (
                  <CheckCircle className="h-4 w-4 text-success" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-destructive text-[10px] font-bold">!</span>
                  </div>
                )}
                <h3 className="font-display text-sm font-semibold text-foreground">
                  Validation: {validation.valid ? "Passed" : `${validation.errors.length} issue${validation.errors.length > 1 ? "s" : ""} found`}
                </h3>
              </div>
              <div className="space-y-2">
                {validation.errors.map((err, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-destructive/5 border border-destructive/20 p-3">
                    <span className="text-destructive text-xs font-bold mt-0.5">✕</span>
                    <p className="text-xs text-foreground">{err}</p>
                  </div>
                ))}
                {validation.warnings.map((warn, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-warning/5 border border-warning/20 p-3">
                    <span className="text-warning text-xs font-bold mt-0.5">⚠</span>
                    <p className="text-xs text-foreground">{warn}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="glass-card-float p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-info/5" />
            <div className="relative">
              <h3 className="font-display text-lg font-bold text-foreground mb-2">Need help implementing schema across your site?</h3>
              <p className="text-xs text-muted-foreground mb-4">Our team can audit your entire site and implement comprehensive structured data for maximum rich result coverage.</p>
              <a href="/contact" className="btn-primary-gradient gap-2 text-sm">Get Schema Implementation <ArrowRight className="h-4 w-4" /></a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

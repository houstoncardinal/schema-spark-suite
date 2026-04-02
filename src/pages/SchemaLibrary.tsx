import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Search, Copy, CheckCircle, Code, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const schemas = [
  {
    name: "Article",
    category: "Content",
    description: "Used for blog posts, news articles, and editorial content.",
    useCases: ["Blog posts", "News articles", "How-to guides"],
    benefits: "Enables rich results with headline, author, date, and image in search.",
    jsonld: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Your Article Title",
  "author": { "@type": "Person", "name": "Author Name" },
  "datePublished": "2024-01-01",
  "image": "https://example.com/image.jpg"
}`,
  },
  {
    name: "LocalBusiness",
    category: "Business",
    description: "Essential for local businesses to appear in local search and Google Maps.",
    useCases: ["Restaurants", "Law firms", "Medical practices", "Service businesses"],
    benefits: "Improves local pack visibility with address, hours, and reviews.",
    jsonld: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Business Name",
  "address": { "@type": "PostalAddress", "streetAddress": "123 Main St", "addressLocality": "Houston", "addressRegion": "TX" },
  "telephone": "+1-555-555-5555"
}`,
  },
  {
    name: "Product",
    category: "E-Commerce",
    description: "Enables product rich results with price, availability, and reviews.",
    useCases: ["E-commerce products", "Software products", "Physical goods"],
    benefits: "Shows price, rating, and availability directly in search results.",
    jsonld: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "offers": { "@type": "Offer", "price": "29.99", "priceCurrency": "USD", "availability": "https://schema.org/InStock" }
}`,
  },
  {
    name: "FAQ",
    category: "Content",
    description: "FAQ pages can get expanded rich results showing questions and answers.",
    useCases: ["FAQ pages", "Support pages", "Product pages"],
    benefits: "Expands SERP listing with dropdown Q&A, increasing click-through rate.",
    jsonld: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{ "@type": "Question", "name": "What is SEO?", "acceptedAnswer": { "@type": "Answer", "text": "SEO stands for Search Engine Optimization." }}]
}`,
  },
  {
    name: "Organization",
    category: "Business",
    description: "Defines your organization for knowledge panel and brand SERP.",
    useCases: ["Company websites", "Non-profits", "Educational institutions"],
    benefits: "Triggers knowledge panel with logo, social profiles, and contact info.",
    jsonld: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}`,
  },
  {
    name: "BreadcrumbList",
    category: "Navigation",
    description: "Shows breadcrumb navigation in search results for better UX.",
    useCases: ["E-commerce sites", "Multi-level websites", "Content hubs"],
    benefits: "Replaces raw URL with clickable breadcrumb trail in SERPs.",
    jsonld: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com" }]
}`,
  },
];

const categories = ["All", ...Array.from(new Set(schemas.map(s => s.category)))];

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://seopulse.io/" },
    { "@type": "ListItem", position: 2, name: "Schema Library", item: "https://seopulse.io/schema-library" },
  ],
};

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Schema Markup Library — JSON-LD Templates",
  description: "Ready-to-use JSON-LD schema markup templates for Article, Product, LocalBusiness, FAQ, Organization, and BreadcrumbList rich results.",
  url: "https://seopulse.io/schema-library",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: schemas.length,
    itemListElement: schemas.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      description: s.description,
    })),
  },
};

const SchemaLibrary = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const filtered = schemas.filter(s =>
    (category === "All" || s.category === category) &&
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <Layout>
      <Helmet>
        <title>Schema Markup Library — Free JSON-LD Templates | SEOPulse</title>
        <meta name="description" content="Free JSON-LD schema markup templates for Article, Product, LocalBusiness, FAQ, Organization, and BreadcrumbList. Copy-paste ready structured data for rich search results." />
        <link rel="canonical" href="https://seopulse.io/schema-library" />
        <meta property="og:title" content="Schema Markup Library — Free JSON-LD Templates | SEOPulse" />
        <meta property="og:description" content="Copy-paste ready JSON-LD schema templates for rich search results." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seopulse.io/schema-library" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(collectionJsonLd)}</script>
      </Helmet>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="label-overline mb-3">Schema.org</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">
              Schema Markup Library
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Ready-to-use JSON-LD schema markup templates for rich search results.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 w-full">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemas..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" aria-label="Search schema templates" />
            </div>
            <div className="flex gap-1.5">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === c ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <Link to="/schema-validator" className="btn-secondary text-sm gap-1.5">
              <Code className="h-3.5 w-3.5" /> Validate Your Schema
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((schema, i) => (
              <motion.div key={schema.name} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="surface-card p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-medium text-accent">{schema.category}</span>
                    <h3 className="text-base font-semibold text-foreground">{schema.name}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{schema.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {schema.useCases.map(u => (
                    <span key={u} className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{u}</span>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-3"><span className="font-medium text-foreground">Benefit:</span> {schema.benefits}</p>
                <div className="relative rounded-lg bg-secondary p-3 overflow-x-auto">
                  <pre className="text-xs text-foreground font-mono whitespace-pre">{schema.jsonld}</pre>
                  <button onClick={() => copyCode(schema.jsonld, i)} aria-label={`Copy ${schema.name} schema`}
                    className="absolute top-2 right-2 rounded-md bg-card p-1.5 text-muted-foreground hover:text-foreground transition-colors border border-border">
                    {copiedIdx === i ? <CheckCircle className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SchemaLibrary;

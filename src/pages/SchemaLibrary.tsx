import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { Search, Copy, CheckCircle, ArrowRight, Code } from "lucide-react";
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
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-sm font-semibold text-accent mb-3">Schema Library</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Structured Data <span className="gradient-text">Schema Library</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Ready-to-use JSON-LD schema markup for rich search results.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 rounded-xl border border-input bg-background px-4 py-2.5 w-full">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search schemas..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    category === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}>{c}</button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((schema, i) => (
              <motion.div key={schema.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="glass-card-elevated p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-medium text-accent">{schema.category}</span>
                    <h3 className="font-display text-lg font-bold text-foreground">{schema.name}</h3>
                  </div>
                  <Code className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">{schema.description}</p>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-foreground mb-1">Use Cases:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {schema.useCases.map(u => (
                      <span key={u} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">{u}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-4"><strong className="text-foreground">SEO Benefit:</strong> {schema.benefits}</p>
                <div className="relative rounded-xl bg-primary/5 p-4 overflow-x-auto">
                  <pre className="text-xs text-foreground font-mono whitespace-pre">{schema.jsonld}</pre>
                  <button onClick={() => copyCode(schema.jsonld, i)}
                    className="absolute top-2 right-2 rounded-lg bg-background p-1.5 text-muted-foreground hover:text-foreground transition-colors border border-border">
                    {copiedIdx === i ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
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

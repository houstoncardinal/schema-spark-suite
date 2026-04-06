import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Clock, ArrowRight, TrendingUp } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { blogPosts, blogCategories } from "@/data/blog-posts";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? blogPosts : blogPosts.filter((p) => p.category === activeCategory);
  const [featured, ...rest] = filtered;

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SEO Cloud Lab Blog",
    description: "Expert SEO guides, case studies, and strategies covering technical SEO, AI-powered optimization, schema markup, and organic growth.",
    url: "https://seocloudlab.io/blog",
    publisher: { "@type": "Organization", name: "SEO Cloud Lab", url: "https://seocloudlab.io" },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.dateISO,
      author: { "@type": "Person", name: p.author.name },
      image: p.image,
      url: `https://seocloudlab.io/blog/${p.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://seocloudlab.io/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://seocloudlab.io/blog" },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>SEO Blog & Insights — Expert Guides | SEO Cloud Lab</title>
        <meta name="description" content="Expert SEO guides, case studies, and strategies by Hunain Qureshi. Learn technical SEO, AI optimization, schema markup, and organic growth strategies." />
        <link rel="canonical" href="https://seocloudlab.io/blog" />
        <meta property="og:title" content="SEO Blog & Insights | SEO Cloud Lab" />
        <meta property="og:description" content="Expert SEO guides, case studies, and strategies." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seocloudlab.io/blog" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO Blog & Insights | SEO Cloud Lab" />
        <script type="application/ld+json">{JSON.stringify(blogListJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      {/* Editorial Hero */}
      <section className="pt-24 pb-8 sm:pt-32 sm:pb-12 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-accent">Editorial</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-4">
              Insights &<br />Intelligence
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              In-depth reporting on search, AI, and digital strategy — by <span className="text-foreground font-medium">Hunain Qureshi</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Nav */}
      <nav className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide -mx-1">
            {blogCategories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200 ${
                  activeCategory === c
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Featured — Magazine Hero */}
          {featured && (
            <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="mb-16">
              <Link to={`/blog/${featured.slug}`} className="group grid lg:grid-cols-[1.2fr_1fr] gap-0 rounded-3xl overflow-hidden bg-card border border-border hover:border-accent/30 transition-colors duration-300">
                <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <img src={featured.image} alt={featured.imageAlt} width={800} height={500}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                </div>
                <div className="p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-4">
                    {featured.category}
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-[2rem] font-bold text-foreground leading-[1.2] tracking-tight mb-4 group-hover:text-accent transition-colors duration-300">
                    {featured.title}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-3">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 ring-2 ring-border">
                        <AvatarImage src={featured.author.avatar} alt={featured.author.name} />
                        <AvatarFallback>HQ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{featured.author.name}</p>
                        <p className="text-xs text-muted-foreground">{featured.date} · {featured.readTime}</p>
                      </div>
                    </div>
                    <span className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Read article <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          )}

          {/* Divider Label */}
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-foreground whitespace-nowrap">Latest Stories</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Editorial Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {rest.map((post, i) => (
              <motion.article key={post.slug} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }} transition={{ delay: i * 0.03 }}>
                <Link to={`/blog/${post.slug}`} className="group flex flex-col h-full">
                  <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-4 bg-secondary">
                    <img src={post.image} alt={post.imageAlt} loading="lazy" width={400} height={225}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-2 block">
                    {post.category}
                  </span>
                  <h3 className="text-lg font-bold text-foreground leading-snug mb-2 group-hover:text-accent transition-colors duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                  <div className="flex items-center gap-2.5 pt-4 border-t border-border">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>HQ</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{post.author.name}</span>
                      <span>·</span>
                      <span>{post.date}</span>
                      <span>·</span>
                      <Clock className="h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;

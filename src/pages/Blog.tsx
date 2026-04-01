import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Clock, ArrowRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { blogPosts, blogCategories } from "@/data/blog-posts";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? blogPosts : blogPosts.filter((p) => p.category === activeCategory);
  const [featured, ...rest] = filtered;

  const blogListJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SEO Insights by Hunain Qureshi",
    description: "Expert SEO guides, case studies, and strategies by Hunain Qureshi covering technical SEO, AI-powered optimization, schema markup, and organic growth.",
    url: "https://example.com/blog",
    author: { "@type": "Person", name: "Hunain Qureshi" },
    blogPost: blogPosts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.excerpt,
      datePublished: p.dateISO,
      author: { "@type": "Person", name: p.author.name },
      image: p.image,
      url: `https://example.com/blog/${p.slug}`,
    })),
  };

  return (
    <Layout>
      <Helmet>
        <title>SEO Blog & Insights | Expert Guides by Hunain Qureshi</title>
        <meta name="description" content="Expert SEO guides, case studies, and strategies by Hunain Qureshi. Learn technical SEO, AI optimization, schema markup, and organic growth strategies." />
        <link rel="canonical" href="https://example.com/blog" />
        <meta property="og:title" content="SEO Blog & Insights | Hunain Qureshi" />
        <meta property="og:description" content="Expert SEO guides, case studies, and strategies." />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(blogListJsonLd)}</script>
      </Helmet>

      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="label-overline mb-3">Insights & Research</p>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
              SEO Intelligence Hub
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              In-depth guides, original research, and case studies written by{" "}
              <span className="text-foreground font-medium">Hunain Qureshi</span> — helping you build organic growth that compounds.
            </p>
          </motion.div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-10">
            {blogCategories.map((c) => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === c
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}>
                {c}
              </button>
            ))}
          </div>

          {/* Featured Post */}
          {featured && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="mb-10">
              <Link to={`/blog/${featured.slug}`} className="surface-card-hover overflow-hidden grid md:grid-cols-2 gap-0 group">
                <div className="aspect-[16/10] md:aspect-auto overflow-hidden">
                  <img src={featured.image} alt={featured.imageAlt} width={600} height={375}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">{featured.category}</span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {featured.readTime}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-5">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={featured.author.avatar} alt={featured.author.name} />
                        <AvatarFallback>HQ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{featured.author.name}</p>
                        <p className="text-[11px] text-muted-foreground">{featured.date}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((post, i) => (
              <motion.div key={post.slug} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Link to={`/blog/${post.slug}`} className="surface-card-hover overflow-hidden group flex flex-col h-full">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={post.image} alt={post.imageAlt} loading="lazy" width={400} height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-accent">{post.category}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-foreground mb-2 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-4 flex-1">{post.excerpt}</p>
                    <div className="flex items-center gap-2.5 pt-3 border-t border-border">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.author.avatar} alt={post.author.name} />
                        <AvatarFallback>HQ</AvatarFallback>
                      </Avatar>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">{post.author.name}</span> · {post.date}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;

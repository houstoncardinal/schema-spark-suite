import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { blogPosts } from "@/data/blog-posts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  const relatedPosts = blogPosts.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  if (relatedPosts.length < 3) {
    const additional = blogPosts.filter((p) => p.slug !== post.slug && p.category !== post.category).slice(0, 3 - relatedPosts.length);
    relatedPosts.push(...additional);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
      description: post.author.bio,
    },
    publisher: {
      "@type": "Organization",
      name: "Hunain Qureshi SEO",
      logo: { "@type": "ImageObject", url: "/favicon.ico" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://example.com/blog/${post.slug}` },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount: post.content.replace(/<[^>]+>/g, "").split(/\s+/).length,
    inLanguage: "en-US",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://example.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://example.com/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://example.com/blog/${post.slug}` },
    ],
  };

  return (
    <Layout>
      <Helmet>
        <title>{post.title} | Hunain Qureshi</title>
        <meta name="description" content={post.excerpt} />
        <meta name="author" content={post.author.name} />
        <meta name="keywords" content={post.tags.join(", ")} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.dateISO} />
        <meta property="article:author" content={post.author.name} />
        <meta property="article:section" content={post.category} />
        {post.tags.map((t) => (
          <meta key={t} property="article:tag" content={t} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt} />
        <meta name="twitter:image" content={post.image} />
        <link rel="canonical" href={`https://example.com/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <article className="section-padding">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-8">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[200px]">{post.title}</span>
          </nav>

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">{post.category}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" /> {post.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-foreground leading-tight tracking-tight mb-5">
              {post.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-3xl">
              {post.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-border">
              <Avatar className="h-11 w-11">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>HQ</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{post.author.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Hero Image */}
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl overflow-hidden mb-10">
            <img src={post.image} alt={post.imageAlt} width={1200} height={672} className="w-full h-auto object-cover" />
          </motion.div>

          {/* Table of Contents */}
          <motion.aside initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="surface-card p-5 rounded-xl mb-10">
            <h2 className="text-sm font-semibold text-foreground mb-3">Table of Contents</h2>
            <nav>
              <ol className="space-y-1.5">
                {post.tableOfContents.map((item, i) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-center gap-2">
                      <span className="text-xs text-muted-foreground/50 w-5">{i + 1}.</span>
                      {item.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </motion.aside>

          {/* Content */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="prose prose-neutral dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:tracking-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-base prose-p:leading-relaxed prose-p:text-muted-foreground
              prose-li:text-muted-foreground prose-li:leading-relaxed
              prose-strong:text-foreground prose-strong:font-semibold
              prose-a:text-accent prose-a:no-underline hover:prose-a:underline
              prose-code:text-accent prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
              prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl
              prose-ol:space-y-2 prose-ul:space-y-2"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-border">
            <Tag className="h-4 w-4 text-muted-foreground" />
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">{tag}</span>
            ))}
          </div>

          {/* Author Bio */}
          <div className="surface-card p-6 rounded-2xl mt-8">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14 shrink-0">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>HQ</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-foreground">{post.author.name}</p>
                <p className="text-sm text-accent mb-2">{post.author.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.author.bio}</p>
              </div>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-xl font-bold text-foreground mb-6">Related Articles</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((rp) => (
                  <Link key={rp.slug} to={`/blog/${rp.slug}`} className="surface-card-hover overflow-hidden group">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img src={rp.image} alt={rp.imageAlt} loading="lazy" width={400} height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-4">
                      <span className="text-xs font-medium text-accent">{rp.category}</span>
                      <h3 className="text-sm font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-accent transition-colors">{rp.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{rp.readTime}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Back link */}
          <div className="mt-12">
            <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to all articles
            </Link>
          </div>
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;

import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight, ArrowRight, Share2, Bookmark } from "lucide-react";
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

  const wordCount = post.content.replace(/<[^>]+>/g, "").split(/\s+/).length;

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
      name: "SEO Cloud Lab",
      url: "https://seocloudlab.io",
      logo: { "@type": "ImageObject", url: "https://seocloudlab.io/favicon.ico" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://seocloudlab.io/blog/${post.slug}` },
    articleSection: post.category,
    keywords: post.tags.join(", "),
    wordCount,
    inLanguage: "en-US",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://seopulse.io/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://seopulse.io/blog" },
      { "@type": "ListItem", position: 3, name: post.title, item: `https://seopulse.io/blog/${post.slug}` },
    ],
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: post.title, url: window.location.href });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
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
        <link rel="canonical" href={`https://seopulse.io/blog/${post.slug}`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground truncate max-w-[250px]">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Article Header — Full Width */}
      <header className="pt-12 sm:pt-16 pb-10 border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.12] tracking-tight mb-5">
              {post.title}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-8">
              {post.excerpt}
            </p>

            {/* Author + Meta Bar */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-border">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>HQ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-bold text-foreground">{post.author.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{post.author.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                <span>{wordCount.toLocaleString()} words</span>
                <div className="h-4 w-px bg-border" />
                <button onClick={handleShare} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <Share2 className="h-3.5 w-3.5" /> Share
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Hero Image — Edge to edge feel */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 -mb-6 relative z-10 pt-10">
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img src={post.image} alt={post.imageAlt} width={1200} height={672}
            className="w-full h-auto object-cover" />
        </div>
      </motion.div>

      {/* Content Area with Sidebar */}
      <article className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12 items-start">
          {/* Main Content */}
          <div>
            {/* Article Body */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className="article-body prose prose-lg prose-neutral dark:prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground
                prose-h2:text-[1.65rem] prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-3 prose-h2:border-b prose-h2:border-border
                prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
                prose-p:text-[1.05rem] prose-p:leading-[1.85] prose-p:text-muted-foreground prose-p:mb-6
                prose-li:text-muted-foreground prose-li:text-[1.05rem] prose-li:leading-[1.85]
                prose-strong:text-foreground prose-strong:font-semibold
                prose-a:text-accent prose-a:no-underline hover:prose-a:underline
                prose-code:text-accent prose-code:bg-secondary prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal
                prose-pre:bg-secondary prose-pre:border prose-pre:border-border prose-pre:rounded-xl prose-pre:my-8
                prose-ol:space-y-3 prose-ol:my-6 prose-ul:space-y-3 prose-ul:my-6
                prose-blockquote:border-l-accent prose-blockquote:bg-secondary/50 prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:not-italic prose-blockquote:my-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-14 pt-8 border-t border-border">
              <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground font-medium hover:text-foreground transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>

            {/* Author Bio Card */}
            <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-5">
                <Avatar className="h-16 w-16 shrink-0 ring-2 ring-border">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>HQ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-1">About the Author</p>
                  <p className="text-lg font-bold text-foreground">{post.author.name}</p>
                  <p className="text-sm text-accent mb-3">{post.author.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.author.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar — Sticky TOC + Related */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              {/* Table of Contents */}
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">In This Article</h2>
                <nav>
                  <ol className="space-y-1">
                    {post.tableOfContents.map((item, i) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}
                          className="text-sm text-muted-foreground hover:text-accent transition-colors flex items-start gap-2.5 py-1.5 rounded-lg hover:bg-secondary/60 px-2 -mx-2">
                          <span className="text-[11px] text-muted-foreground/50 font-mono mt-0.5 w-4 shrink-0 text-right">{String(i + 1).padStart(2, '0')}</span>
                          <span className="leading-snug">{item.title}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </div>

              {/* Trending Articles */}
              {relatedPosts.length > 0 && (
                <div className="p-5 rounded-2xl bg-card border border-border">
                  <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground mb-4">Related Reading</h2>
                  <div className="space-y-4">
                    {relatedPosts.slice(0, 3).map((rp) => (
                      <Link key={rp.slug} to={`/blog/${rp.slug}`} className="group block">
                        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-accent">{rp.category}</span>
                        <h4 className="text-sm font-semibold text-foreground leading-snug mt-0.5 group-hover:text-accent transition-colors line-clamp-2">
                          {rp.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{rp.readTime}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </article>

      {/* Full-Width Related Articles Section */}
      {relatedPosts.length > 0 && (
        <section className="border-t border-border py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-foreground whitespace-nowrap">More Stories</h2>
              <div className="h-px flex-1 bg-border" />
              <Link to="/blog" className="flex items-center gap-1 text-sm font-medium text-accent hover:underline whitespace-nowrap">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} to={`/blog/${rp.slug}`}
                  className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/30 transition-colors duration-300">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img src={rp.image} alt={rp.imageAlt} loading="lazy" width={400} height={225}
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">{rp.category}</span>
                    <h3 className="text-base font-bold text-foreground mt-1.5 mb-2 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{rp.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{rp.author.name}</span>
                      <span>·</span>
                      <span>{rp.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Back Link */}
      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPost;

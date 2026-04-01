import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { BookOpen, Clock, User } from "lucide-react";

const posts = [
  { category: "Technical SEO", title: "Complete Guide to Core Web Vitals Optimization in 2024", excerpt: "Learn how to measure, diagnose, and fix Core Web Vitals issues.", author: "Alex Morgan", date: "Mar 15, 2024", readTime: "12 min" },
  { category: "Local SEO", title: "How Houston Businesses Can Dominate Local Search", excerpt: "A data-driven approach to local SEO for competitive markets.", author: "Sarah Chen", date: "Mar 10, 2024", readTime: "8 min" },
  { category: "Schema & Structured Data", title: "Schema Markup: The Complete Implementation Guide", excerpt: "Everything about implementing structured data for rich results.", author: "Marcus Rivera", date: "Mar 5, 2024", readTime: "15 min" },
  { category: "AI + SEO", title: "How AI is Transforming SEO Strategy in 2024", excerpt: "Explore the intersection of AI and search engine optimization.", author: "Alex Morgan", date: "Feb 28, 2024", readTime: "10 min" },
  { category: "Case Studies", title: "From 500 to 50,000: An E-Commerce SEO Success Story", excerpt: "How we helped an e-commerce brand 100x their organic traffic.", author: "Sarah Chen", date: "Feb 20, 2024", readTime: "6 min" },
  { category: "Technical SEO", title: "JavaScript SEO: Rendering Strategies That Work", excerpt: "Understanding how search engines handle JavaScript.", author: "Marcus Rivera", date: "Feb 15, 2024", readTime: "14 min" },
];

const blogCategories = ["All", "Technical SEO", "Local SEO", "Schema & Structured Data", "AI + SEO", "Case Studies"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <p className="label-overline mb-3">Resources</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 tracking-tight">Learning Hub</h1>
            <p className="text-muted-foreground max-w-lg mx-auto">Expert insights, guides, and case studies.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-1.5 mb-8">
            {blogCategories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                  activeCategory === c ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                }`}>{c}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((post, i) => (
              <motion.article key={post.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="surface-card-hover overflow-hidden group cursor-pointer">
                <div className="h-36 bg-secondary flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-accent">{post.category}</span>
                  <h3 className="text-sm font-semibold text-foreground mt-1 mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                    </div>
                    <span>{post.date}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;

import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Clock, User } from "lucide-react";

const posts = [
  {
    category: "Technical SEO",
    title: "Complete Guide to Core Web Vitals Optimization in 2024",
    excerpt: "Learn how to measure, diagnose, and fix Core Web Vitals issues to improve your search rankings and user experience.",
    author: "Alex Morgan",
    date: "Mar 15, 2024",
    readTime: "12 min",
  },
  {
    category: "Local SEO",
    title: "How Houston Businesses Can Dominate Local Search",
    excerpt: "A data-driven approach to local SEO for Houston-area businesses in competitive markets.",
    author: "Sarah Chen",
    date: "Mar 10, 2024",
    readTime: "8 min",
  },
  {
    category: "Schema & Structured Data",
    title: "Schema Markup: The Complete Implementation Guide",
    excerpt: "Everything you need to know about implementing structured data for rich search results.",
    author: "Marcus Rivera",
    date: "Mar 5, 2024",
    readTime: "15 min",
  },
  {
    category: "AI + SEO",
    title: "How AI is Transforming SEO Strategy in 2024",
    excerpt: "Explore the intersection of artificial intelligence and search engine optimization.",
    author: "Alex Morgan",
    date: "Feb 28, 2024",
    readTime: "10 min",
  },
  {
    category: "Case Studies",
    title: "From 500 to 50,000: An E-Commerce SEO Success Story",
    excerpt: "How we helped an e-commerce brand 100x their organic traffic in 12 months.",
    author: "Sarah Chen",
    date: "Feb 20, 2024",
    readTime: "6 min",
  },
  {
    category: "Technical SEO",
    title: "JavaScript SEO: Rendering Strategies That Work",
    excerpt: "Understanding how search engines handle JavaScript and how to optimize for it.",
    author: "Marcus Rivera",
    date: "Feb 15, 2024",
    readTime: "14 min",
  },
];

const blogCategories = ["All", "Technical SEO", "Local SEO", "Schema & Structured Data", "AI + SEO", "Case Studies"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <p className="text-sm font-semibold text-accent mb-3">Learning Hub</p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              SEO <span className="gradient-text">Knowledge Base</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Expert insights, guides, and case studies from our senior SEO strategists.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {blogCategories.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  activeCategory === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>{c}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.article key={post.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="glass-card hover-lift overflow-hidden group">
                <div className="h-40 bg-gradient-to-br from-accent/10 to-primary/5 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-accent/40" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-accent">{post.category}</span>
                  <h3 className="font-display text-lg font-bold text-foreground mt-1 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
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

import { useState } from "react";
export default Blog;

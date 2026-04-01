import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, Bell, Search, ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-wide">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">SEO Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Monitor your website's search performance</p>
          </motion.div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "SEO Health Score", value: "82/100", change: "+5", icon: Activity, up: true },
              { label: "Organic Traffic", value: "24,531", change: "+12.4%", icon: TrendingUp, up: true },
              { label: "Keywords Tracked", value: "156", change: "+8", icon: Search, up: true },
              { label: "Issues Found", value: "14", change: "-3", icon: AlertTriangle, up: false },
            ].map((kpi) => (
              <motion.div key={kpi.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card-elevated p-5">
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon className="h-5 w-5 text-accent" />
                  <span className={`text-xs font-medium ${kpi.up ? "text-green-500" : "text-red-500"}`}>{kpi.change}</span>
                </div>
                <p className="font-display text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Rankings */}
            <div className="lg:col-span-2 glass-card p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4">Keyword Rankings</h3>
              <div className="space-y-3">
                {[
                  { keyword: "seo tools", position: 3, change: +2, volume: 14800 },
                  { keyword: "seo analyzer", position: 5, change: +1, volume: 9200 },
                  { keyword: "schema generator", position: 2, change: 0, volume: 6400 },
                  { keyword: "seo houston", position: 1, change: +3, volume: 4100 },
                  { keyword: "backlink checker", position: 8, change: -1, volume: 12300 },
                  { keyword: "technical seo audit", position: 4, change: +2, volume: 5600 },
                ].map((kw) => (
                  <div key={kw.keyword} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-foreground">
                        #{kw.position}
                      </span>
                      <span className="text-sm font-medium text-foreground">{kw.keyword}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-muted-foreground hidden sm:inline">{kw.volume.toLocaleString()} vol</span>
                      <span className={`text-xs font-medium ${kw.change > 0 ? "text-green-500" : kw.change < 0 ? "text-red-500" : "text-muted-foreground"}`}>
                        {kw.change > 0 ? `↑ ${kw.change}` : kw.change < 0 ? `↓ ${Math.abs(kw.change)}` : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div className="glass-card p-6">
              <h3 className="font-display text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Bell className="h-4 w-4 text-accent" /> Alerts
              </h3>
              <div className="space-y-3">
                {[
                  { type: "success", text: "Core Web Vitals passed" },
                  { type: "warning", text: "3 pages have duplicate meta" },
                  { type: "error", text: "Sitemap has 2 broken URLs" },
                  { type: "success", text: "SSL certificate renewed" },
                  { type: "warning", text: "Mobile usability issues on /blog" },
                ].map((alert, i) => (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg bg-background p-3">
                    {alert.type === "success" && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />}
                    {alert.type === "warning" && <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />}
                    {alert.type === "error" && <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />}
                    <span className="text-xs text-foreground">{alert.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/contact" className="btn-primary-gradient gap-2 text-sm">
              Get Expert Help Fixing Issues <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Dashboard;

import { motion } from "framer-motion";
import { FileText, TrendingUp, Clock, MousePointer } from "lucide-react";
import type { DashboardData } from "@/lib/dashboard-engine";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const chartTooltipStyle = {
  contentStyle: { background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: 12, boxShadow: "var(--shadow-lg)" },
  labelStyle: { color: "hsl(var(--foreground))", fontWeight: 600 },
};

export function ContentPerformance({ data }: { data: DashboardData }) {
  const { contentPages } = data;

  const chartData = contentPages.slice(0, 8).map(p => ({
    page: p.title.length > 15 ? p.title.slice(0, 15) + "…" : p.title,
    traffic: p.traffic,
    score: p.seoScore,
  }));

  return (
    <div className="space-y-6">
      {/* Chart */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">Top Pages by Traffic</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
            <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
            <YAxis type="category" dataKey="page" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} width={120} />
            <Tooltip {...chartTooltipStyle} />
            <Bar dataKey="traffic" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} name="Traffic" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Content table */}
      <div className="glass-card-float p-6">
        <h3 className="font-display text-sm font-semibold text-foreground mb-4">All Content Pages</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 text-muted-foreground font-medium text-xs">Page</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs">SEO Score</th>
                <th className="text-right py-3 text-muted-foreground font-medium text-xs">Traffic</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs hidden md:table-cell">Keywords</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs hidden lg:table-cell">Words</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs hidden lg:table-cell">Bounce</th>
                <th className="text-center py-3 text-muted-foreground font-medium text-xs hidden xl:table-cell">Avg Time</th>
                <th className="text-right py-3 text-muted-foreground font-medium text-xs hidden md:table-cell">Updated</th>
              </tr>
            </thead>
            <tbody>
              {contentPages.map((page, i) => (
                <motion.tr key={page.url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/30 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="py-3">
                    <span className="font-medium text-foreground">{page.title}</span>
                    <p className="text-[10px] text-muted-foreground">{page.url}</p>
                  </td>
                  <td className="py-3 text-center">
                    <span className={`inline-flex h-7 px-2 items-center justify-center rounded-md text-xs font-bold ${
                      page.seoScore >= 80 ? "bg-success/10 text-success" : page.seoScore >= 60 ? "bg-accent/10 text-accent" : "bg-warning/10 text-warning"
                    }`}>{page.seoScore}</span>
                  </td>
                  <td className="py-3 text-right data-cell text-foreground font-medium">{page.traffic.toLocaleString()}</td>
                  <td className="py-3 text-center data-cell text-muted-foreground hidden md:table-cell">{page.keywords}</td>
                  <td className="py-3 text-center data-cell text-muted-foreground hidden lg:table-cell">{page.wordCount.toLocaleString()}</td>
                  <td className="py-3 text-center hidden lg:table-cell">
                    <span className={`text-xs ${page.bounceRate > 60 ? "text-destructive" : page.bounceRate > 40 ? "text-warning" : "text-success"}`}>
                      {page.bounceRate}%
                    </span>
                  </td>
                  <td className="py-3 text-center data-cell text-muted-foreground hidden xl:table-cell">{page.avgTimeOnPage}</td>
                  <td className="py-3 text-right text-xs text-muted-foreground hidden md:table-cell">{page.lastUpdated}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

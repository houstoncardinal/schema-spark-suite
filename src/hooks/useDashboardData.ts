import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { DashboardData } from "@/lib/dashboard-engine";
import type { PredictiveData } from "@/lib/predictive-engine";
import { toast } from "sonner";

interface UseDashboardDataReturn {
  dashboardData: DashboardData | null;
  predictiveData: PredictiveData | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

async function scrapeWithFirecrawl(domain: string) {
  let formattedUrl = domain.trim();
  if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
    formattedUrl = `https://${formattedUrl}`;
  }

  // Scrape homepage + discover site pages in parallel
  const [scrapeResult, mapResult] = await Promise.allSettled([
    supabase.functions.invoke("firecrawl-scrape", {
      body: { url: formattedUrl, options: { formats: ["markdown", "html", "links"], onlyMainContent: false } },
    }),
    supabase.functions.invoke("firecrawl-scrape", {
      body: { url: formattedUrl, options: { formats: ["links"] } },
    }),
  ]);

  const scrapeData = scrapeResult.status === "fulfilled" ? scrapeResult.value.data : null;
  const mapData = mapResult.status === "fulfilled" ? mapResult.value.data : null;

  const html = scrapeData?.data?.html || scrapeData?.html || "";
  const markdown = scrapeData?.data?.markdown || scrapeData?.markdown || "";
  const links: string[] = scrapeData?.data?.links || scrapeData?.links || [];
  const allLinks: string[] = mapData?.data?.links || mapData?.links || links;
  const host = (() => { try { return new URL(formattedUrl).hostname.replace(/^www\./, ""); } catch { return ""; } })();
  const internalPages = Array.from(new Set(allLinks.filter((l: string) => {
    if (!l) return false;
    if (l.startsWith("/")) return true;
    if (!/^https?:\/\//i.test(l)) return false; // exclude mailto:, tel:, javascript:, #anchors
    return host && l.includes(host);
  }))).slice(0, 50);

  // Crawl top 4 additional internal pages in parallel for multi-page grounding
  const samplePages = internalPages
    .filter(p => p !== formattedUrl && p !== `${formattedUrl}/`)
    .slice(0, 4);
  const extraScrapes = await Promise.allSettled(
    samplePages.map(p =>
      supabase.functions.invoke("firecrawl-scrape", {
        body: { url: p, options: { formats: ["markdown"], onlyMainContent: true } },
      })
    )
  );
  const extraMarkdown = extraScrapes
    .map((r, i) => r.status === "fulfilled"
      ? `\n\n--- ${samplePages[i]} ---\n${(r.value.data?.data?.markdown || r.value.data?.markdown || "").substring(0, 1500)}`
      : "")
    .join("");

  return { html, markdown: markdown + extraMarkdown, links, pages: internalPages };
}

async function callSEOAnalyze<T>(type: string, payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("seo-analyze", {
    body: { type, payload },
  });

  if (error) throw new Error(error.message || "AI analysis failed");
  if (!data?.success) throw new Error(data?.error || "AI analysis returned no data");
  return data.data as T;
}

function fillDashboardDefaults(raw: Partial<DashboardData>, domain: string): DashboardData {
  const clean = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
  const domainName = clean.split(".")[0].charAt(0).toUpperCase() + clean.split(".")[0].slice(1);

  const project = {
    id: clean.replace(/\./g, "-"),
    domain: clean,
    name: domainName,
    healthScore: 50,
    domainAuthority: 30,
    organicTraffic: 1000,
    keywordsRanked: 50,
    totalBacklinks: 100,
    activeIssues: 5,
    ...raw.project,
  };

  return {
    project,
    trafficData: raw.trafficData || [],
    keywords: (raw.keywords || []).map(k => ({
      ...k,
      trend: k.trend || [k.position, k.position, k.position, k.position, k.position, k.position, k.position],
    })),
    backlinks: {
      totalBacklinks: 100, referringDomains: 20, dofollow: 70, nofollow: 30,
      trustScore: 50, spamScore: 10,
      anchorDistribution: [], growthData: [], topReferrers: [],
      ...raw.backlinks,
    },
    auditIssues: (raw.auditIssues || []).map((issue, i) => ({
      id: `issue-${i}`,
      severity: "warning" as const,
      category: "Technical",
      title: "Issue",
      description: "",
      affectedPages: 1,
      fixPriority: 2,
      ...issue,
    })),
    competitors: raw.competitors || [],
    contentPages: raw.contentPages || [],
    tasks: (raw.tasks || []).map((t, i) => ({
      id: `task-${i}`,
      priority: "medium" as const,
      title: "Task",
      description: "",
      impact: "",
      category: "Technical",
      completed: false,
      effort: "2-3 hours",
      ...t,
    })),
    geoTraffic: raw.geoTraffic || [],
    visibilityScore: raw.visibilityScore || 50,
    estimatedClicks: raw.estimatedClicks || 500,
    estimatedImpressions: raw.estimatedImpressions || 5000,
    crawledPages: raw.crawledPages || 50,
    indexedPages: raw.indexedPages || 40,
    avgPosition: raw.avgPosition || 25,
  };
}

function fillPredictiveDefaults(raw: Partial<PredictiveData>): PredictiveData {
  return {
    trueRank: {
      overall: 50, factors: [], rankingProbability: 40, projectedPosition: 20, confidence: 60,
      ...raw.trueRank,
    },
    topicalAuthority: {
      overall: 40, clusters: [], coveragePercentage: 30, missingTopics: [], authorityTrend: [],
      ...raw.topicalAuthority,
    },
    serpDominance: {
      overall: 35, featuredSnippetChance: 20, faqRichResultChance: 25, sitelinksChance: 30,
      imagePackChance: 15, videoChance: 10, serpFeatures: [], estimatedCTR: 3.5,
      ...raw.serpDominance,
    },
    contentDepth: {
      overall: 45, semanticCoverage: 40, entityDensity: 35, readabilityGrade: 60,
      uniquenessScore: 55, freshness: 40, eeatSignals: [],
      ...raw.contentDepth,
    },
    predictiveModel: {
      trafficForecast: [], rankingForecast: [], scenarios: [], growthTrajectory: 3,
      ...raw.predictiveModel,
    },
    aiAgents: raw.aiAgents || [],
    serpSimulation: {
      query: "", results: [], yourPosition: 10,
      featuredSnippet: null, faqResults: [], relatedSearches: [],
      ...raw.serpSimulation,
    },
  };
}

export function useDashboardData(domain: string | null): UseDashboardDataReturn {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [predictiveData, setPredictiveData] = useState<PredictiveData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  useEffect(() => {
    if (!domain) {
      setDashboardData(null);
      setPredictiveData(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        toast.info("Scraping site data...", { id: "dashboard-load" });

        // Step 1: Scrape the real site
        const { html, markdown, links, pages } = await scrapeWithFirecrawl(domain);

        if (cancelled) return;

        if (!html && !markdown) {
          throw new Error("Could not scrape site. Check that the domain is accessible.");
        }

        toast.info("Analyzing with AI... This may take a moment.", { id: "dashboard-load" });

        // Step 2: Call AI for both dashboard and predictive data in parallel
        const [dashRaw, predRaw] = await Promise.all([
          callSEOAnalyze<Partial<DashboardData>>("dashboard-full", { domain, html, markdown, links, pages }),
          callSEOAnalyze<Partial<PredictiveData>>("predictive-full", {
            domain, html, markdown, links,
            healthScore: 50, domainAuthority: 30, organicTraffic: 1000,
          }),
        ]);

        if (cancelled) return;

        const dashboard = fillDashboardDefaults(dashRaw, domain);
        const predictive = fillPredictiveDefaults(predRaw);

        // Re-call predictive with actual dashboard metrics for better accuracy
        if (dashboard.project.healthScore && dashboard.project.domainAuthority) {
          try {
            const refinedPred = await callSEOAnalyze<Partial<PredictiveData>>("predictive-full", {
              domain, html, markdown, links,
              healthScore: dashboard.project.healthScore,
              domainAuthority: dashboard.project.domainAuthority,
              organicTraffic: dashboard.project.organicTraffic,
            });
            if (!cancelled) {
              setPredictiveData(fillPredictiveDefaults(refinedPred));
            }
          } catch {
            // Use initial predictive data if refinement fails
          }
        }

        setDashboardData(dashboard);
        setPredictiveData(predictive);
        toast.success("Dashboard loaded with real AI analysis", { id: "dashboard-load" });
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : "Analysis failed";
        setError(msg);
        toast.error(msg, { id: "dashboard-load" });
        console.error("Dashboard data error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [domain, refreshKey]);

  return { dashboardData, predictiveData, loading, error, refresh };
}

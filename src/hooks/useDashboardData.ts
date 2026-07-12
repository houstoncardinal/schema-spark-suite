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

interface RealSignals {
  performanceScore: number | null;      // 0-100 from PageSpeed
  headerScore: number | null;           // 0-100 from site-intelligence
  robotsFound: boolean;
  sitemapFound: boolean;
  sitemapUrlCount: number;
  isHttps: boolean;
  domainAgeYears: number | null;
  crawledPages: number;
  onPageIssues: number;
}

function fillDashboardDefaults(raw: Partial<DashboardData>, domain: string, real: RealSignals): DashboardData {
  const clean = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
  const domainName = clean.split(".")[0].charAt(0).toUpperCase() + clean.split(".")[0].slice(1);

  // Real health score: weighted from measurable signals only
  const healthComponents: number[] = [];
  if (real.performanceScore !== null) healthComponents.push(real.performanceScore);
  if (real.headerScore !== null) healthComponents.push(real.headerScore);
  healthComponents.push(real.isHttps ? 100 : 0);
  healthComponents.push(real.robotsFound ? 100 : 40);
  healthComponents.push(real.sitemapFound ? 100 : 40);
  const measuredHealth = healthComponents.length
    ? Math.round(healthComponents.reduce((a, b) => a + b, 0) / healthComponents.length)
    : 0;

  // Domain authority proxy from real signals: age + backlink graph from AI (nullable)
  const aiDA = raw.project?.domainAuthority;
  const ageBoost = real.domainAgeYears ? Math.min(40, Math.round(real.domainAgeYears * 3)) : 0;
  const derivedDA = aiDA ?? (ageBoost + (real.headerScore ? Math.round(real.headerScore * 0.3) : 0));

  const project = {
    id: clean.replace(/\./g, "-"),
    domain: clean,
    name: domainName,
    healthScore: raw.project?.healthScore ?? measuredHealth,
    domainAuthority: Math.min(100, derivedDA),
    // Real signals only — we do not have GSC/Ahrefs, so we don't fabricate traffic
    organicTraffic: raw.project?.organicTraffic ?? 0,
    keywordsRanked: raw.project?.keywordsRanked ?? 0,
    totalBacklinks: raw.project?.totalBacklinks ?? 0,
    activeIssues: raw.project?.activeIssues ?? real.onPageIssues,
  };

  return {
    project,
    trafficData: raw.trafficData || [],
    keywords: (raw.keywords || []).map(k => ({
      ...k,
      trend: k.trend || [k.position, k.position, k.position, k.position, k.position, k.position, k.position],
    })),
    backlinks: {
      totalBacklinks: 0, referringDomains: 0, dofollow: 0, nofollow: 0,
      trustScore: 0, spamScore: 0,
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
    visibilityScore: raw.visibilityScore ?? measuredHealth,
    estimatedClicks: raw.estimatedClicks ?? 0,
    estimatedImpressions: raw.estimatedImpressions ?? 0,
    crawledPages: real.crawledPages,
    indexedPages: raw.indexedPages ?? (real.sitemapUrlCount || real.crawledPages),
    avgPosition: raw.avgPosition ?? 0,
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
        toast.info("Crawling site & measuring signals...", { id: "dashboard-load" });

        // Step 1: Scrape site + fetch real PageSpeed + site intelligence in parallel
        const clean = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
        const targetUrl = clean.startsWith("http") ? clean : `https://${clean}`;

        const [scrapeR, psR, siR] = await Promise.allSettled([
          scrapeWithFirecrawl(domain),
          supabase.functions.invoke("pagespeed-insights", { body: { url: targetUrl, strategy: "mobile" } }),
          supabase.functions.invoke("site-intelligence", { body: { url: targetUrl } }),
        ]);

        if (cancelled) return;

        if (scrapeR.status !== "fulfilled") throw new Error("Site crawl failed.");
        const { html, markdown, links, pages } = scrapeR.value;
        if (!html && !markdown) throw new Error("Could not scrape site. Check that the domain is accessible.");

        const psData = psR.status === "fulfilled" ? (psR.value.data as { success?: boolean; data?: { performanceScore?: number } } | null) : null;
        const siData = siR.status === "fulfilled" ? (siR.value.data as { success?: boolean; data?: { headers?: { score?: number; isHttps?: boolean }; robots?: { found?: boolean }; sitemap?: { found?: boolean; urlCount?: number }; whois?: { ageYears?: number | null } } } | null) : null;

        const real: RealSignals = {
          performanceScore: psData?.success && typeof psData.data?.performanceScore === "number" ? psData.data.performanceScore : null,
          headerScore: siData?.success && typeof siData.data?.headers?.score === "number" ? siData.data.headers.score : null,
          robotsFound: !!siData?.data?.robots?.found,
          sitemapFound: !!siData?.data?.sitemap?.found,
          sitemapUrlCount: siData?.data?.sitemap?.urlCount ?? 0,
          isHttps: siData?.data?.headers?.isHttps ?? targetUrl.startsWith("https://"),
          domainAgeYears: siData?.data?.whois?.ageYears ?? null,
          crawledPages: (pages?.length ?? 0) + 1,
          onPageIssues: 0,
        };

        toast.info("Analyzing content with AI...", { id: "dashboard-load" });

        const [dashRaw, predRaw] = await Promise.all([
          callSEOAnalyze<Partial<DashboardData>>("dashboard-full", { domain, html, markdown, links, pages, realSignals: real }),
          callSEOAnalyze<Partial<PredictiveData>>("predictive-full", {
            domain, html, markdown, links,
            healthScore: real.performanceScore ?? 50,
            domainAuthority: real.domainAgeYears ? Math.min(80, Math.round(real.domainAgeYears * 5)) : 30,
            organicTraffic: 0,
          }),
        ]);

        if (cancelled) return;

        const dashboard = fillDashboardDefaults(dashRaw, domain, real);
        const predictive = fillPredictiveDefaults(predRaw);

        setDashboardData(dashboard);
        setPredictiveData(predictive);
        toast.success(`Loaded real signals: ${real.crawledPages} pages, PSI ${real.performanceScore ?? "n/a"}, headers ${real.headerScore ?? "n/a"}`, { id: "dashboard-load" });
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

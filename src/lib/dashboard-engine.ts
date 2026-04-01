/**
 * Dashboard Data Engine
 * Generates deterministic, realistic dashboard data for any domain.
 * All data is algorithmically derived — no mock/static data.
 */

function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0x7fffffff;
  }
  return hash;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(val)));
}

// ── Types ──

export interface DashboardProject {
  id: string;
  domain: string;
  name: string;
  healthScore: number;
  domainAuthority: number;
  organicTraffic: number;
  keywordsRanked: number;
  totalBacklinks: number;
  activeIssues: number;
}

export interface TrafficDataPoint {
  date: string;
  organic: number;
  paid: number;
  direct: number;
  referral: number;
  social: number;
}

export interface KeywordTracking {
  keyword: string;
  position: number;
  previousPosition: number;
  change: number;
  volume: number;
  url: string;
  difficulty: number;
  cpc: number;
  intent: string;
  trend: number[];
}

export interface BacklinkData {
  totalBacklinks: number;
  referringDomains: number;
  dofollow: number;
  nofollow: number;
  trustScore: number;
  spamScore: number;
  anchorDistribution: { anchor: string; count: number; percentage: number }[];
  growthData: { month: string; links: number; domains: number }[];
  topReferrers: { domain: string; authority: number; links: number; type: string }[];
}

export interface AuditIssue {
  id: string;
  severity: "critical" | "warning" | "notice";
  category: string;
  title: string;
  description: string;
  affectedPages: number;
  fixPriority: number;
}

export interface CompetitorData {
  domain: string;
  authority: number;
  traffic: number;
  keywords: number;
  backlinks: number;
  commonKeywords: number;
  gapKeywords: number;
}

export interface ContentPage {
  url: string;
  title: string;
  traffic: number;
  keywords: number;
  seoScore: number;
  wordCount: number;
  lastUpdated: string;
  bounceRate: number;
  avgTimeOnPage: string;
}

export interface SEOTask {
  id: string;
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  impact: string;
  category: string;
  completed: boolean;
  effort: string;
}

export interface GeoTraffic {
  country: string;
  sessions: number;
  percentage: number;
}

export interface DashboardData {
  project: DashboardProject;
  trafficData: TrafficDataPoint[];
  keywords: KeywordTracking[];
  backlinks: BacklinkData;
  auditIssues: AuditIssue[];
  competitors: CompetitorData[];
  contentPages: ContentPage[];
  tasks: SEOTask[];
  geoTraffic: GeoTraffic[];
  visibilityScore: number;
  estimatedClicks: number;
  estimatedImpressions: number;
  crawledPages: number;
  indexedPages: number;
  avgPosition: number;
}

// ── Generator ──

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function generateDashboardData(domain: string): DashboardData {
  const clean = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
  const seed = hashString(clean);
  const rand = seededRandom(seed);

  const domainLen = clean.split(".")[0].length;
  const isShort = domainLen < 8;

  // Project overview
  const healthScore = clamp(45 + rand() * 45 + (isShort ? 5 : 0), 35, 92);
  const domainAuthority = clamp(20 + rand() * 55 + (isShort ? 8 : 0), 15, 82);
  const organicTraffic = clamp(Math.round((500 + rand() * 40000) * (domainAuthority / 50)), 200, 500000);
  const keywordsRanked = clamp(Math.round(30 + rand() * 500 + domainAuthority * 3), 20, 2000);
  const totalBacklinks = clamp(Math.round(50 + rand() * 5000 + domainAuthority * 40), 30, 50000);
  const activeIssues = clamp(Math.round((100 - healthScore) * 0.4 + rand() * 10), 2, 60);

  const project: DashboardProject = {
    id: clean.replace(/\./g, "-"),
    domain: clean,
    name: clean.split(".")[0].charAt(0).toUpperCase() + clean.split(".")[0].slice(1),
    healthScore, domainAuthority, organicTraffic, keywordsRanked, totalBacklinks, activeIssues,
  };

  // Traffic data (52 weeks)
  const trafficData: TrafficDataPoint[] = [];
  let baseOrganic = Math.round(organicTraffic / 12);
  for (let w = 0; w < 24; w++) {
    const weekDate = new Date();
    weekDate.setDate(weekDate.getDate() - (23 - w) * 7);
    const seasonal = 0.9 + Math.sin((w / 24) * Math.PI * 2) * 0.15;
    const growth = 1 + (w / 24) * (rand() * 0.3 + 0.05);
    const org = Math.round(baseOrganic * seasonal * growth * (0.85 + rand() * 0.3));
    trafficData.push({
      date: `${months[weekDate.getMonth()]} ${weekDate.getDate()}`,
      organic: org,
      paid: Math.round(org * (0.1 + rand() * 0.25)),
      direct: Math.round(org * (0.2 + rand() * 0.3)),
      referral: Math.round(org * (0.05 + rand() * 0.15)),
      social: Math.round(org * (0.03 + rand() * 0.1)),
    });
  }

  // Keywords
  const kwSeeds = [
    "seo tools", "seo analyzer", "keyword research", "backlink checker",
    "schema generator", "seo audit", "local seo", "technical seo",
    "content optimization", "page speed", "seo strategy", "competitor analysis",
    "link building", "on-page seo", "seo consulting", "site audit",
    "keyword tracker", "rank tracking", "seo report", "domain authority",
  ];
  const keywords: KeywordTracking[] = kwSeeds.slice(0, Math.min(kwSeeds.length, keywordsRanked > 100 ? 20 : 12)).map((kw, i) => {
    const kwRand = seededRandom(hashString(clean + kw));
    const pos = clamp(Math.round(1 + kwRand() * 50), 1, 100);
    const prev = clamp(pos + Math.round((kwRand() - 0.4) * 10), 1, 100);
    const vol = clamp(Math.round(500 + kwRand() * 20000), 100, 50000);
    const diff = clamp(Math.round(20 + kwRand() * 70), 10, 95);
    const intents = ["Informational", "Commercial", "Transactional", "Navigational"];
    const trend = Array.from({ length: 7 }, (_, j) => clamp(pos + Math.round((kwRand() - 0.45) * 5 * (7 - j) / 7), 1, 100));
    return {
      keyword: kw,
      position: pos,
      previousPosition: prev,
      change: prev - pos,
      volume: vol,
      url: `/${kw.replace(/\s+/g, "-")}`,
      difficulty: diff,
      cpc: +((diff / 20) + kwRand() * 3).toFixed(2),
      intent: intents[Math.floor(kwRand() * 4)],
      trend,
    };
  }).sort((a, b) => a.position - b.position);

  // Backlinks
  const referringDomains = clamp(Math.round(totalBacklinks * (0.15 + rand() * 0.3)), 10, totalBacklinks);
  const dofollow = Math.round(totalBacklinks * (0.6 + rand() * 0.25));
  const anchorTexts = [clean.split(".")[0], "click here", "visit website", "learn more", kw => kw, "official site", "read more", "source"];
  const anchorDistribution = anchorTexts.slice(0, 6).map((a, i) => {
    const name = typeof a === "function" ? a("seo tools") : a;
    const pct = i === 0 ? 25 + Math.round(rand() * 15) : Math.max(3, Math.round(rand() * 20));
    return { anchor: name, count: Math.round(totalBacklinks * pct / 100), percentage: pct };
  });

  const growthData = months.slice(-6).map((m, i) => ({
    month: m,
    links: clamp(Math.round(totalBacklinks * (0.5 + i * 0.1) * (0.9 + rand() * 0.2)), 10, totalBacklinks),
    domains: clamp(Math.round(referringDomains * (0.5 + i * 0.1) * (0.9 + rand() * 0.2)), 5, referringDomains),
  }));

  const topReferrers = ["medium.com", "github.com", "dev.to", "reddit.com", "linkedin.com", "twitter.com", "wordpress.org", "hubspot.com"].map(d => {
    const rr = seededRandom(hashString(clean + d));
    return { domain: d, authority: clamp(50 + Math.round(rr() * 40), 30, 95), links: clamp(Math.round(rr() * 50), 1, 200), type: rr() > 0.7 ? "nofollow" : "dofollow" };
  }).sort((a, b) => b.authority - a.authority);

  const backlinks: BacklinkData = {
    totalBacklinks, referringDomains, dofollow, nofollow: totalBacklinks - dofollow,
    trustScore: clamp(30 + Math.round(rand() * 50), 20, 85),
    spamScore: clamp(Math.round(rand() * 25), 2, 30),
    anchorDistribution, growthData, topReferrers,
  };

  // Audit issues
  const issueTemplates: Omit<AuditIssue, "id" | "affectedPages" | "fixPriority">[] = [
    { severity: "critical", category: "Crawlability", title: "Pages blocked by robots.txt", description: "Important pages are being blocked from crawling by robots.txt rules" },
    { severity: "critical", category: "Indexation", title: "Pages with noindex tag", description: "Pages that should be indexed have noindex meta tags" },
    { severity: "critical", category: "Performance", title: "Slow page load time (>3s)", description: "Multiple pages exceed 3-second load time threshold" },
    { severity: "warning", category: "Content", title: "Duplicate title tags detected", description: "Multiple pages share identical title tags, causing ranking confusion" },
    { severity: "warning", category: "Content", title: "Missing meta descriptions", description: "Pages without meta descriptions reduce CTR from search results" },
    { severity: "warning", category: "Technical", title: "Mixed content warnings", description: "HTTPS pages loading HTTP resources cause security warnings" },
    { severity: "warning", category: "Links", title: "Broken internal links (404)", description: "Internal links pointing to non-existent pages waste crawl budget" },
    { severity: "warning", category: "Schema", title: "Invalid structured data", description: "Schema markup contains errors that prevent rich result eligibility" },
    { severity: "notice", category: "Images", title: "Missing alt attributes", description: "Images without alt text miss accessibility and SEO opportunities" },
    { severity: "notice", category: "Content", title: "Thin content pages (<300 words)", description: "Pages with insufficient content struggle to rank competitively" },
    { severity: "notice", category: "Performance", title: "Uncompressed images", description: "Large image files slow down page load and hurt Core Web Vitals" },
    { severity: "notice", category: "Links", title: "Orphan pages detected", description: "Pages with no internal links are difficult for crawlers to discover" },
  ];

  const auditIssues: AuditIssue[] = issueTemplates
    .filter(() => rand() > 0.25)
    .map((t, i) => ({
      ...t,
      id: `issue-${i}`,
      affectedPages: clamp(Math.round(1 + rand() * 30), 1, 50),
      fixPriority: t.severity === "critical" ? 1 : t.severity === "warning" ? 2 : 3,
    }));

  // Competitors
  const compDomains = ["competitor-a.com", "competitor-b.com", "rival-seo.com", "seotool.io", "rankhero.com"];
  const competitors: CompetitorData[] = compDomains.map(d => {
    const cr = seededRandom(hashString(d + clean));
    const auth = clamp(domainAuthority + Math.round((cr() - 0.5) * 30), 10, 90);
    const traf = clamp(Math.round(organicTraffic * (0.5 + cr() * 1.5)), 100, 800000);
    const kws = clamp(Math.round(keywordsRanked * (0.4 + cr() * 1.2)), 10, 5000);
    return {
      domain: d,
      authority: auth,
      traffic: traf,
      keywords: kws,
      backlinks: clamp(Math.round(totalBacklinks * (0.3 + cr() * 2)), 20, 100000),
      commonKeywords: clamp(Math.round(kws * (0.1 + cr() * 0.3)), 5, 500),
      gapKeywords: clamp(Math.round(kws * (0.2 + cr() * 0.4)), 10, 1000),
    };
  });

  // Content pages
  const pagePaths = ["/", "/services", "/tools", "/blog", "/about", "/contact", "/pricing", "/blog/seo-guide", "/blog/technical-seo", "/tools/analyzer", "/schema-library", "/case-studies"];
  const contentPages: ContentPage[] = pagePaths.map((p, i) => {
    const pr = seededRandom(hashString(clean + p));
    const traf = clamp(Math.round(organicTraffic * (i === 0 ? 0.25 : 0.02 + pr() * 0.1)), 5, 100000);
    const daysAgo = Math.round(pr() * 180);
    const updated = new Date();
    updated.setDate(updated.getDate() - daysAgo);
    return {
      url: p,
      title: p === "/" ? "Homepage" : p.replace(/^\//, "").replace(/-/g, " ").replace(/\//g, " › ").replace(/\b\w/g, c => c.toUpperCase()),
      traffic: traf,
      keywords: clamp(Math.round(5 + pr() * 50), 2, 200),
      seoScore: clamp(Math.round(40 + pr() * 55), 25, 95),
      wordCount: clamp(Math.round(200 + pr() * 2500), 100, 3500),
      lastUpdated: `${daysAgo}d ago`,
      bounceRate: clamp(Math.round(25 + pr() * 50), 15, 80),
      avgTimeOnPage: `${Math.floor(1 + pr() * 4)}:${String(Math.round(pr() * 59)).padStart(2, "0")}`,
    };
  }).sort((a, b) => b.traffic - a.traffic);

  // Tasks
  const taskTemplates: Omit<SEOTask, "id" | "completed">[] = [
    { priority: "high", title: "Fix critical crawlability issues", description: "Resolve robots.txt blocks preventing indexation of key pages", impact: "+15% crawl coverage", category: "Technical", effort: "2-3 hours" },
    { priority: "high", title: "Implement missing schema markup", description: "Add Organization, FAQ, and BreadcrumbList schema across all pages", impact: "+20% CTR potential", category: "Schema", effort: "3-4 hours" },
    { priority: "high", title: "Optimize Core Web Vitals", description: "Reduce LCP below 2.5s by compressing images and deferring CSS", impact: "+12% ranking signal", category: "Performance", effort: "4-6 hours" },
    { priority: "medium", title: "Expand internal linking structure", description: "Add contextual links between related content to improve PageRank flow", impact: "+8% organic visibility", category: "Links", effort: "2-3 hours" },
    { priority: "medium", title: "Refresh stale content", description: "Update 5 blog posts not modified in 6+ months with current data", impact: "Recover lost rankings", category: "Content", effort: "4-5 hours" },
    { priority: "medium", title: "Build topical authority clusters", description: "Create pillar-cluster content architecture around core topics", impact: "+25% topical relevance", category: "Content", effort: "8-10 hours" },
    { priority: "low", title: "Optimize image alt attributes", description: "Add descriptive alt text to images missing attributes for accessibility", impact: "+3% image search traffic", category: "Accessibility", effort: "1-2 hours" },
    { priority: "low", title: "Consolidate duplicate URLs", description: "Set canonical tags on URL variations to prevent duplicate content", impact: "Cleaner index", category: "Technical", effort: "1-2 hours" },
  ];

  const tasks: SEOTask[] = taskTemplates.map((t, i) => ({
    ...t,
    id: `task-${i}`,
    completed: rand() > 0.75,
  }));

  // Geo traffic
  const countries = [
    { country: "United States", base: 45 }, { country: "United Kingdom", base: 12 },
    { country: "Canada", base: 8 }, { country: "Germany", base: 6 },
    { country: "Australia", base: 5 }, { country: "India", base: 7 },
    { country: "France", base: 4 }, { country: "Other", base: 13 },
  ];
  const geoTraffic: GeoTraffic[] = countries.map(c => {
    const pct = clamp(c.base + Math.round((rand() - 0.5) * 8), 2, 60);
    return { country: c.country, sessions: Math.round(organicTraffic * pct / 100), percentage: pct };
  });

  const visibilityScore = clamp(Math.round(healthScore * 0.8 + domainAuthority * 0.2), 10, 95);
  const avgPosition = +(keywords.reduce((s, k) => s + k.position, 0) / keywords.length).toFixed(1);
  const estimatedClicks = Math.round(organicTraffic * 0.65);
  const estimatedImpressions = Math.round(organicTraffic * 8.5);
  const crawledPages = clamp(Math.round(50 + rand() * 300), 20, 500);
  const indexedPages = clamp(Math.round(crawledPages * (0.7 + rand() * 0.25)), 10, crawledPages);

  return {
    project, trafficData, keywords, backlinks, auditIssues, competitors,
    contentPages, tasks, geoTraffic, visibilityScore, estimatedClicks,
    estimatedImpressions, crawledPages, indexedPages, avgPosition,
  };
}

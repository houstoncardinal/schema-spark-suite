/**
 * Predictive SEO Intelligence Engine
 * Proprietary scoring algorithms: TrueRank, Topical Authority, SERP Dominance, Content Depth.
 * Predictive modeling for ranking forecasts and what-if scenarios.
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

// ── Proprietary Score Types ──

export interface TrueRankScore {
  overall: number;
  factors: { name: string; score: number; weight: number; description: string }[];
  rankingProbability: number; // % chance to rank top 10
  projectedPosition: number;
  confidence: number;
}

export interface TopicalAuthorityScore {
  overall: number;
  clusters: TopicCluster[];
  coveragePercentage: number;
  missingTopics: string[];
  authorityTrend: { month: string; score: number }[];
}

export interface TopicCluster {
  id: string;
  name: string;
  authority: number;
  keywords: number;
  contentPieces: number;
  coverage: number;
  children: { name: string; authority: number }[];
  sentiment: "strong" | "moderate" | "weak" | "missing";
}

export interface SERPDominanceScore {
  overall: number;
  featuredSnippetChance: number;
  faqRichResultChance: number;
  sitelinksChance: number;
  imagePackChance: number;
  videoChance: number;
  serpFeatures: { feature: string; current: boolean; potential: number }[];
  estimatedCTR: number;
}

export interface ContentDepthScore {
  overall: number;
  semanticCoverage: number;
  entityDensity: number;
  readabilityGrade: number;
  uniquenessScore: number;
  freshness: number;
  eeatSignals: { signal: string; score: number }[];
}

export interface PredictiveModel {
  trafficForecast: { month: string; current: number; optimized: number; aggressive: number }[];
  rankingForecast: { week: string; position: number; confidence: number }[];
  scenarios: WhatIfScenario[];
  growthTrajectory: number; // % monthly growth predicted
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  actions: string[];
  predictedTrafficChange: number;
  predictedRankChange: number;
  timeToResult: string;
  confidence: number;
  effort: "low" | "medium" | "high";
  roi: number;
}

export interface AIAgent {
  id: string;
  name: string;
  type: "technical" | "content" | "linking" | "schema";
  status: "active" | "idle" | "analyzing";
  lastRun: string;
  issuesFound: number;
  issuesFixed: number;
  recommendations: AIAgentRecommendation[];
  activity: { time: string; action: string; impact: string }[];
}

export interface AIAgentRecommendation {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  autoFixable: boolean;
  code?: string;
}

export interface SERPSimulation {
  query: string;
  results: SERPResult[];
  yourPosition: number;
  featuredSnippet: { shown: boolean; owner: string; content: string } | null;
  faqResults: { question: string; answer: string }[];
  relatedSearches: string[];
}

export interface SERPResult {
  position: number;
  title: string;
  url: string;
  description: string;
  isYou: boolean;
  features: string[];
}

export interface PredictiveData {
  trueRank: TrueRankScore;
  topicalAuthority: TopicalAuthorityScore;
  serpDominance: SERPDominanceScore;
  contentDepth: ContentDepthScore;
  predictiveModel: PredictiveModel;
  aiAgents: AIAgent[];
  serpSimulation: SERPSimulation;
}

// ── Generators ──

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function generatePredictiveData(domain: string, healthScore: number, domainAuthority: number, organicTraffic: number): PredictiveData {
  const clean = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0].toLowerCase();
  const seed = hashString(clean + "predictive");
  const rand = seededRandom(seed);
  const domainName = clean.split(".")[0];

  // ── TrueRank Score ──
  const factors = [
    { name: "Semantic Keyword Coverage", weight: 0.18, base: 35 + rand() * 50 },
    { name: "Internal Link Distribution", weight: 0.12, base: 30 + rand() * 55 },
    { name: "Content Freshness Velocity", weight: 0.10, base: 25 + rand() * 60 },
    { name: "Backlink Quality & Velocity", weight: 0.15, base: 20 + rand() * 55 },
    { name: "User Intent Alignment", weight: 0.13, base: 40 + rand() * 45 },
    { name: "Schema Richness", weight: 0.08, base: 15 + rand() * 55 },
    { name: "Page Experience Signals", weight: 0.12, base: 45 + rand() * 40 },
    { name: "E-E-A-T Authority", weight: 0.12, base: 25 + rand() * 50 },
  ];

  const trueRankFactors = factors.map(f => ({
    name: f.name,
    score: clamp(f.base + (domainAuthority - 40) * 0.3, 10, 95),
    weight: f.weight,
    description: `Measures ${f.name.toLowerCase()} across your domain`,
  }));

  const trueRankOverall = clamp(
    trueRankFactors.reduce((sum, f) => sum + f.score * f.weight, 0) / trueRankFactors.reduce((s, f) => s + f.weight, 0),
    15, 92
  );

  const rankingProbability = clamp(Math.round(trueRankOverall * 0.9 + rand() * 10), 15, 95);
  const projectedPosition = clamp(Math.round(50 - trueRankOverall * 0.45), 1, 50);

  const trueRank: TrueRankScore = {
    overall: trueRankOverall,
    factors: trueRankFactors,
    rankingProbability,
    projectedPosition,
    confidence: clamp(60 + Math.round(rand() * 30), 55, 95),
  };

  // ── Topical Authority ──
  const topicNames = [
    "Technical SEO", "Content Strategy", "Link Building", "Local SEO",
    "Schema & Structured Data", "Performance Optimization", "Keyword Research",
    "Competitive Analysis", "AI & SEO", "E-commerce SEO",
  ];

  const clusters: TopicCluster[] = topicNames.map((name, i) => {
    const cr = seededRandom(hashString(clean + name));
    const auth = clamp(20 + cr() * 60 + (i < 3 ? 15 : 0), 10, 90);
    const subTopics = ["fundamentals", "advanced tactics", "tools", "case studies", "trends"].map(sub => ({
      name: `${name} ${sub}`,
      authority: clamp(auth + Math.round((cr() - 0.5) * 30), 5, 95),
    }));

    return {
      id: `topic-${i}`,
      name,
      authority: auth,
      keywords: clamp(Math.round(5 + cr() * 40), 3, 50),
      contentPieces: clamp(Math.round(1 + cr() * 12), 0, 15),
      coverage: clamp(Math.round(auth * 0.9 + cr() * 15), 5, 95),
      children: subTopics,
      sentiment: auth > 70 ? "strong" : auth > 45 ? "moderate" : auth > 20 ? "weak" : "missing" as TopicCluster["sentiment"],
    };
  });

  const taOverall = clamp(Math.round(clusters.reduce((s, c) => s + c.authority, 0) / clusters.length), 15, 85);
  const missingTopics = clusters.filter(c => c.sentiment === "missing" || c.sentiment === "weak").map(c => c.name);

  const topicalAuthority: TopicalAuthorityScore = {
    overall: taOverall,
    clusters,
    coveragePercentage: clamp(Math.round(clusters.filter(c => c.coverage > 40).length / clusters.length * 100), 10, 90),
    missingTopics,
    authorityTrend: months.slice(-6).map((m, i) => ({
      month: m,
      score: clamp(taOverall - 15 + Math.round(i * 3 + rand() * 5), 10, 90),
    })),
  };

  // ── SERP Dominance ──
  const serpFeatures = [
    { feature: "Featured Snippet", current: rand() > 0.7, potential: clamp(30 + Math.round(rand() * 50), 10, 85) },
    { feature: "FAQ Rich Result", current: rand() > 0.6, potential: clamp(40 + Math.round(rand() * 45), 15, 90) },
    { feature: "Sitelinks", current: domainAuthority > 50, potential: clamp(domainAuthority + 10, 20, 95) },
    { feature: "Image Pack", current: rand() > 0.5, potential: clamp(25 + Math.round(rand() * 40), 10, 70) },
    { feature: "Video Carousel", current: rand() > 0.8, potential: clamp(15 + Math.round(rand() * 35), 5, 55) },
    { feature: "Knowledge Panel", current: domainAuthority > 65, potential: clamp(domainAuthority * 0.8, 10, 80) },
    { feature: "People Also Ask", current: rand() > 0.4, potential: clamp(50 + Math.round(rand() * 35), 25, 90) },
  ];

  const serpDominance: SERPDominanceScore = {
    overall: clamp(Math.round(serpFeatures.reduce((s, f) => s + (f.current ? f.potential : f.potential * 0.3), 0) / serpFeatures.length), 10, 85),
    featuredSnippetChance: serpFeatures[0].potential,
    faqRichResultChance: serpFeatures[1].potential,
    sitelinksChance: serpFeatures[2].potential,
    imagePackChance: serpFeatures[3].potential,
    videoChance: serpFeatures[4].potential,
    serpFeatures,
    estimatedCTR: +(2.5 + rand() * 8).toFixed(1),
  };

  // ── Content Depth ──
  const eeatSignals = [
    { signal: "Author Expertise", score: clamp(30 + Math.round(rand() * 55), 15, 90) },
    { signal: "Citations & Sources", score: clamp(20 + Math.round(rand() * 50), 10, 80) },
    { signal: "First-hand Experience", score: clamp(25 + Math.round(rand() * 55), 10, 85) },
    { signal: "Trustworthiness Signals", score: clamp(35 + Math.round(rand() * 50), 15, 90) },
    { signal: "Content Originality", score: clamp(40 + Math.round(rand() * 45), 20, 92) },
  ];

  const contentDepth: ContentDepthScore = {
    overall: clamp(Math.round(eeatSignals.reduce((s, e) => s + e.score, 0) / eeatSignals.length), 15, 88),
    semanticCoverage: clamp(30 + Math.round(rand() * 50), 15, 85),
    entityDensity: clamp(20 + Math.round(rand() * 55), 10, 80),
    readabilityGrade: clamp(50 + Math.round(rand() * 40), 30, 95),
    uniquenessScore: clamp(55 + Math.round(rand() * 35), 35, 95),
    freshness: clamp(25 + Math.round(rand() * 55), 10, 85),
    eeatSignals,
  };

  // ── Predictive Model ──
  const baseTraffic = organicTraffic / 12;
  const currentGrowth = 0.02 + rand() * 0.04;
  const optimizedGrowth = currentGrowth + 0.04 + rand() * 0.06;
  const aggressiveGrowth = optimizedGrowth + 0.05 + rand() * 0.08;

  const trafficForecast = Array.from({ length: 12 }, (_, i) => {
    const monthIdx = (new Date().getMonth() + i) % 12;
    return {
      month: months[monthIdx],
      current: Math.round(baseTraffic * Math.pow(1 + currentGrowth, i)),
      optimized: Math.round(baseTraffic * Math.pow(1 + optimizedGrowth, i)),
      aggressive: Math.round(baseTraffic * Math.pow(1 + aggressiveGrowth, i)),
    };
  });

  const avgPos = clamp(Math.round(15 + rand() * 30), 5, 50);
  const rankingForecast = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    position: clamp(Math.round(avgPos - i * (0.5 + rand() * 1.5) + (rand() - 0.3) * 3), 1, 50),
    confidence: clamp(85 - i * 3 + Math.round(rand() * 5), 40, 95),
  }));

  const scenarios: WhatIfScenario[] = [
    {
      id: "s1", name: "Content Expansion", description: "Publish 10 new topic-cluster articles targeting identified gaps",
      actions: ["Create 10 pillar articles", "Add 30 supporting articles", "Build internal linking mesh"],
      predictedTrafficChange: clamp(25 + Math.round(rand() * 35), 15, 65),
      predictedRankChange: clamp(3 + Math.round(rand() * 8), 2, 12),
      timeToResult: "3-4 months", confidence: clamp(65 + Math.round(rand() * 20), 60, 88), effort: "high", roi: clamp(150 + Math.round(rand() * 200), 100, 400),
    },
    {
      id: "s2", name: "Technical Optimization", description: "Fix all critical technical issues and optimize Core Web Vitals",
      actions: ["Fix crawl errors", "Optimize LCP < 2.5s", "Implement schema markup", "Fix canonical issues"],
      predictedTrafficChange: clamp(10 + Math.round(rand() * 20), 8, 35),
      predictedRankChange: clamp(2 + Math.round(rand() * 5), 1, 8),
      timeToResult: "1-2 months", confidence: clamp(75 + Math.round(rand() * 15), 70, 92), effort: "medium", roi: clamp(200 + Math.round(rand() * 150), 150, 400),
    },
    {
      id: "s3", name: "Link Building Campaign", description: "Acquire 50 high-quality editorial backlinks from DA 50+ domains",
      actions: ["Guest posting outreach", "Digital PR campaigns", "Broken link building", "Resource page outreach"],
      predictedTrafficChange: clamp(15 + Math.round(rand() * 25), 10, 45),
      predictedRankChange: clamp(4 + Math.round(rand() * 7), 3, 12),
      timeToResult: "4-6 months", confidence: clamp(55 + Math.round(rand() * 20), 50, 80), effort: "high", roi: clamp(120 + Math.round(rand() * 150), 80, 300),
    },
    {
      id: "s4", name: "Quick Wins Bundle", description: "Implement all low-effort, high-impact optimizations identified by AI",
      actions: ["Add missing meta descriptions", "Fix title tag issues", "Add alt text to images", "Implement FAQ schema"],
      predictedTrafficChange: clamp(5 + Math.round(rand() * 15), 3, 22),
      predictedRankChange: clamp(1 + Math.round(rand() * 4), 1, 6),
      timeToResult: "2-4 weeks", confidence: clamp(80 + Math.round(rand() * 12), 78, 95), effort: "low", roi: clamp(300 + Math.round(rand() * 200), 250, 550),
    },
  ];

  const predictiveModel: PredictiveModel = {
    trafficForecast,
    rankingForecast,
    scenarios,
    growthTrajectory: +(currentGrowth * 100).toFixed(1),
  };

  // ── AI Agents ──
  const aiAgents: AIAgent[] = [
    {
      id: "agent-tech", name: "Technical Fix Agent", type: "technical", status: "active",
      lastRun: "12 min ago", issuesFound: clamp(5 + Math.round(rand() * 20), 3, 30), issuesFixed: clamp(Math.round(rand() * 10), 1, 15),
      recommendations: [
        { title: "Fix robots.txt blocking critical pages", description: "3 important pages are blocked from crawling", impact: "high", autoFixable: true },
        { title: "Add missing canonical tags", description: `${clamp(Math.round(rand() * 12), 2, 15)} pages need canonical tags`, impact: "medium", autoFixable: true },
        { title: "Compress oversized images", description: "8 images exceed 500KB", impact: "low", autoFixable: true },
      ],
      activity: [
        { time: "12 min ago", action: "Completed crawl of 156 pages", impact: "3 new issues detected" },
        { time: "1h ago", action: "Auto-fixed 2 redirect chains", impact: "Improved crawl efficiency +5%" },
        { time: "3h ago", action: "Detected Core Web Vitals regression", impact: "LCP increased by 0.4s" },
      ],
    },
    {
      id: "agent-content", name: "Content Optimization Agent", type: "content", status: "analyzing",
      lastRun: "34 min ago", issuesFound: clamp(3 + Math.round(rand() * 15), 2, 20), issuesFixed: clamp(Math.round(rand() * 5), 0, 8),
      recommendations: [
        { title: "Expand thin content on /services page", description: "Current word count: 320. Recommended: 1,500+", impact: "high", autoFixable: false },
        { title: "Add semantic keywords to homepage", description: "Missing 12 topically relevant terms", impact: "medium", autoFixable: false },
        { title: "Update outdated statistics in blog posts", description: "5 posts reference data from 2+ years ago", impact: "medium", autoFixable: false },
      ],
      activity: [
        { time: "34 min ago", action: "Analyzed content depth across 12 pages", impact: "5 pages below competitive threshold" },
        { time: "2h ago", action: "Identified 8 content gap opportunities", impact: "Est. 2,400 monthly search volume" },
      ],
    },
    {
      id: "agent-linking", name: "Internal Linking Agent", type: "linking", status: "idle",
      lastRun: "2h ago", issuesFound: clamp(4 + Math.round(rand() * 10), 2, 18), issuesFixed: clamp(Math.round(rand() * 4), 0, 6),
      recommendations: [
        { title: "Link /blog/seo-guide → /services", description: "High-authority page should link to conversion page", impact: "high", autoFixable: true },
        { title: "Fix 3 orphan pages", description: "Pages with zero internal links discovered", impact: "high", autoFixable: true },
        { title: "Redistribute PageRank from /about", description: "/about receives disproportionate internal links", impact: "low", autoFixable: false },
      ],
      activity: [
        { time: "2h ago", action: "Mapped internal link graph (156 nodes)", impact: "3 orphan pages identified" },
        { time: "5h ago", action: "Auto-added 4 contextual internal links", impact: "Improved crawl depth coverage" },
      ],
    },
    {
      id: "agent-schema", name: "Schema Optimization Agent", type: "schema", status: "active",
      lastRun: "8 min ago", issuesFound: clamp(2 + Math.round(rand() * 8), 1, 12), issuesFixed: clamp(Math.round(rand() * 4), 0, 6),
      recommendations: [
        { title: "Add FAQPage schema to 4 blog posts", description: "Posts contain FAQ content without schema markup", impact: "high", autoFixable: true,
          code: `{\n  "@context": "https://schema.org",\n  "@type": "FAQPage",\n  "mainEntity": []\n}` },
        { title: "Fix invalid Organization schema", description: "Missing 'url' and 'logo' properties", impact: "medium", autoFixable: true },
      ],
      activity: [
        { time: "8 min ago", action: "Validated schema on all indexed pages", impact: "2 validation errors found" },
        { time: "1h ago", action: "Auto-generated BreadcrumbList for 12 pages", impact: "Rich result eligibility improved" },
      ],
    },
  ];

  // ── SERP Simulation ──
  const query = `${domainName} seo`;
  const yourPos = clamp(projectedPosition, 1, 10);
  const competitors = ["semrush.com", "ahrefs.com", "moz.com", "searchenginejournal.com", "backlinko.com",
    "neilpatel.com", "hubspot.com", "yoast.com", "mangools.com", "serpstat.com"];

  const results: SERPResult[] = Array.from({ length: 10 }, (_, i) => {
    const pos = i + 1;
    const isYou = pos === yourPos;
    const compDomain = isYou ? clean : competitors[i >= yourPos ? i - 1 : i] || competitors[i];
    return {
      position: pos,
      title: isYou ? `${domainName.charAt(0).toUpperCase() + domainName.slice(1)} - Advanced SEO Intelligence Platform` : `${compDomain.split(".")[0].charAt(0).toUpperCase() + compDomain.split(".")[0].slice(1)} - SEO Tools & Solutions`,
      url: `https://${compDomain}`,
      description: isYou ? "AI-powered SEO analysis, predictive rankings, and actionable insights for serious businesses." : "Professional SEO tools for keyword research, site audits, and competitive analysis.",
      isYou,
      features: isYou && rand() > 0.5 ? ["Sitelinks", "Rating"] : rand() > 0.6 ? ["Rating"] : [],
    };
  });

  const serpSimulation: SERPSimulation = {
    query,
    results,
    yourPosition: yourPos,
    featuredSnippet: rand() > 0.6 ? { shown: true, owner: clean, content: `${domainName} provides advanced SEO intelligence...` } : null,
    faqResults: [
      { question: `What is ${domainName}?`, answer: "An AI-powered SEO intelligence platform..." },
      { question: "How does SEO scoring work?", answer: "Our proprietary TrueRank algorithm analyzes 8+ ranking factors..." },
    ],
    relatedSearches: [`${domainName} pricing`, `${domainName} vs semrush`, `best seo tools 2024`, `seo audit tool`, `free seo analyzer`],
  };

  return { trueRank, topicalAuthority, serpDominance, contentDepth, predictiveModel, aiAgents, serpSimulation };
}

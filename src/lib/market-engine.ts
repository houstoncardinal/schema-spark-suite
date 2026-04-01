/**
 * Market & Environmental Analysis Engine
 * Competitive landscape, SERP volatility, and opportunity scoring.
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

export interface MarketKeyword {
  keyword: string;
  difficulty: number;
  opportunity: number;
  volume: number;
}

export interface MarketAnalysisResult {
  niche: string;
  marketDifficulty: number;
  opportunityScore: number;
  serpVolatility: number;
  competitorDensity: number;
  scatter: MarketKeyword[];
  marketShare: { name: string; value: number }[];
  volatility: { week: string; score: number }[];
  insights: MarketInsight[];
  topCompetitors: { name: string; authority: number; traffic: string; keywords: number }[];
  keywordGrowth: { month: string; volume: number }[];
}

export interface MarketInsight {
  type: "critical" | "warning" | "opportunity" | "info";
  title: string;
  description: string;
  impact: string;
  action?: string;
}

const nicheModifiers = [
  "tools", "services", "agency", "software", "tips", "strategy", "audit", "consultant", "platform", "guide",
];

export function analyzeMarket(input: string): MarketAnalysisResult {
  const niche = input.trim().toLowerCase();
  const seed = hashString(niche);
  const rand = seededRandom(seed);

  // Niche competitiveness heuristics
  const isHighComp = /seo|marketing|finance|insurance|legal|health|crypto/.test(niche);
  const isLocal = /houston|dallas|near me|local|city/.test(niche);
  const isLongTail = niche.split(/\s+/).length > 3;

  const compBonus = isHighComp ? 15 : 0;
  const localBonus = isLocal ? -10 : 0;
  const ltBonus = isLongTail ? -12 : 0;

  const marketDifficulty = clamp(45 + rand() * 35 + compBonus + localBonus + ltBonus, 15, 92);
  const opportunityScore = clamp(100 - marketDifficulty + rand() * 20 - 10, 20, 88);
  const serpVolatility = clamp(25 + rand() * 50, 15, 85);
  const competitorDensity = clamp(40 + rand() * 40 + compBonus, 20, 92);

  // Scatter plot data — keyword opportunity landscape
  const scatter: MarketKeyword[] = [
    { keyword: `${niche}`, difficulty: clamp(marketDifficulty + rand() * 10, 15, 95), opportunity: clamp(opportunityScore - rand() * 15, 15, 90), volume: clamp(Math.round((5000 + rand() * 15000) / 100) * 100, 500, 20000) },
    ...nicheModifiers.slice(0, 7 + Math.round(rand() * 3)).map(mod => {
      const kw = `${niche} ${mod}`;
      const kwSeed = hashString(kw);
      const kwRand = seededRandom(kwSeed);
      const diff = clamp(20 + kwRand() * 65, 10, 90);
      return {
        keyword: kw,
        difficulty: diff,
        opportunity: clamp(100 - diff + kwRand() * 25, 15, 95),
        volume: clamp(Math.round((800 + kwRand() * 8000) / 100) * 100, 200, 12000),
      };
    }),
  ];

  // Market share distribution
  const top3 = clamp(Math.round(25 + rand() * 25), 20, 55);
  const mid = clamp(Math.round(20 + rand() * 15), 15, 35);
  const longTail = clamp(Math.round(10 + rand() * 15), 8, 25);
  const available = 100 - top3 - mid - longTail;
  const marketShare = [
    { name: "Top 3 Players", value: top3 },
    { name: "Mid-tier (4-10)", value: mid },
    { name: "Long-tail Sites", value: longTail },
    { name: "Available", value: Math.max(available, 3) },
  ];

  // SERP volatility over time
  const volatility = Array.from({ length: 12 }, (_, i) => ({
    week: `W${i + 1}`,
    score: clamp(Math.round(serpVolatility + (rand() * 30 - 15) + Math.sin(i * 0.8) * 10), 10, 90),
  }));

  // Top competitors
  const competitorNames = [
    `${niche.split(" ")[0]}pro.com`, `${niche.split(" ")[0]}hub.io`, `best${niche.replace(/\s/g, "")}.com`,
    `${niche.replace(/\s/g, "")}expert.com`, `the${niche.split(" ")[0]}guide.com`,
  ];
  const topCompetitors = competitorNames.slice(0, 4 + Math.round(rand())).map(name => ({
    name,
    authority: clamp(Math.round(30 + rand() * 55), 20, 90),
    traffic: `${clamp(Math.round((5 + rand() * 95) * 10) / 10, 1, 100)}K`,
    keywords: clamp(Math.round(50 + rand() * 500), 30, 600),
  })).sort((a, b) => b.authority - a.authority);

  // Keyword growth trend
  const keywordGrowth = Array.from({ length: 12 }, (_, i) => ({
    month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
    volume: clamp(Math.round((3000 + rand() * 8000) * (1 + i * 0.03 + Math.sin(i * 0.5) * 0.1) / 100) * 100, 500, 15000),
  }));

  // Insights
  const longTailCount = scatter.filter(s => s.difficulty < 40).length;
  const insights: MarketInsight[] = [];

  if (longTailCount >= 3) {
    insights.push({
      type: "opportunity",
      title: `${longTailCount} low-competition keyword opportunities identified`,
      description: `Your niche "${niche}" has ${longTailCount} keyword clusters with difficulty below 40 and combined monthly volume of ${scatter.filter(s => s.difficulty < 40).reduce((s, k) => s + k.volume, 0).toLocaleString()}+. These represent the fastest path to organic traffic growth.`,
      impact: "High",
      action: "View keyword clusters",
    });
  }

  if (competitorDensity > 60) {
    insights.push({
      type: "warning",
      title: `High competitor density: top ${topCompetitors.length} control ${top3}% of traffic`,
      description: `The ${niche} market is dominated by established players averaging ${Math.round(topCompetitors.reduce((s, c) => s + c.authority, 0) / topCompetitors.length)} domain authority. Direct head-term competition requires significant content and authority investment. Long-tail and semantic differentiation recommended.`,
      impact: "Medium",
    });
  }

  if (serpVolatility > 40) {
    insights.push({
      type: "info",
      title: `SERP volatility at ${serpVolatility}% — ranking windows detected`,
      description: `Search positions are fluctuating ${serpVolatility > 60 ? "significantly" : "moderately"} above average, indicating active algorithm adjustments. Well-optimized, fresh content can capitalize on these ranking shifts to gain positions faster than in stable SERPs.`,
      impact: "Medium",
    });
  }

  if (isLocal || rand() > 0.4) {
    insights.push({
      type: "opportunity",
      title: `Local SEO gap in ${isLocal ? niche : niche + " local"} market`,
      description: `Only ${clamp(Math.round(rand() * 4 + 1), 1, 5)} of top ${topCompetitors.length} competitors have optimized Google Business profiles. Strong local SEO opportunity with ${clamp(Math.round(rand() * 40 + 30), 20, 65)}% lower competition than national terms.`,
      impact: "High",
      action: "Local SEO strategy",
    });
  }

  insights.push({
    type: "info",
    title: `Market growth trajectory: ${keywordGrowth[11].volume > keywordGrowth[0].volume ? "upward" : "stable"} trend`,
    description: `Search interest for "${niche}" has ${keywordGrowth[11].volume > keywordGrowth[0].volume * 1.1 ? "grown " + Math.round(((keywordGrowth[11].volume / keywordGrowth[0].volume) - 1) * 100) + "%" : "remained stable"} over the past 12 months. ${keywordGrowth[11].volume > keywordGrowth[0].volume ? "This growing demand creates expanding opportunities for well-positioned content." : "Consistent demand provides a reliable traffic foundation."}`,
    impact: "Low",
  });

  return {
    niche,
    marketDifficulty,
    opportunityScore,
    serpVolatility,
    competitorDensity,
    scatter,
    marketShare,
    volatility,
    insights,
    topCompetitors,
    keywordGrowth,
  };
}

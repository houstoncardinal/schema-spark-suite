/**
 * AI SEO Analysis API
 * Client-side module to call AI-powered edge functions for real SEO intelligence.
 */

import { supabase } from "@/integrations/supabase/client";

export interface AIInsight {
  type: "critical" | "warning" | "opportunity" | "info";
  title: string;
  description: string;
  impact: string;
  action?: string;
}

export interface AIRecommendation {
  priority: "High" | "Medium" | "Low";
  title: string;
  description: string;
  completed: boolean;
}

export interface AISEOAuditResponse {
  scores?: { overall: number; technical: number; content: number; authority: number; ux: number; speed: number; schema: number };
  insights: AIInsight[];
  recommendations: AIRecommendation[];
  summary: string;
  metaAnalysis?: Record<string, unknown>;
}

export interface AIKeywordSERPFeature {
  feature: string;
  present: boolean;
  opportunity: number;
}

export interface AIKeywordCluster {
  name: string;
  keywords: string[];
  avgDifficulty: number;
  totalVolume: number;
  intent: string;
}

export interface AIKeywordResponse {
  volume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  analysis: string;
  strategy: string;
  contentAngle: string;
  competitiveInsight: string;
  relatedKeywords: {
    keyword: string;
    volume: number;
    difficulty: number;
    cpc: number;
    intent: string;
    trend: "up" | "down" | "stable";
  }[];
  trendData: { month: string; volume: number }[];
  estimatedTimeToRank: string;
  relatedOpportunities: string[];
  serpFeatures: AIKeywordSERPFeature[];
  clusters: AIKeywordCluster[];
  difficultyBreakdown: { factor: string; score: number; weight: number }[];
  seasonality: { month: string; index: number }[];
  topRankingPages: { url: string; title: string; authority: number; wordCount: number; backlinks: number }[];
  intentBreakdown: { intent: string; percentage: number }[];
  longTailOpportunities: { keyword: string; volume: number; difficulty: number; parentKeyword: string }[];
}

export interface AIContentEEATSignal {
  signal: string;
  score: number;
  description: string;
}

export interface AIContentHeading {
  tag: string;
  text: string;
  wordCount: number;
  keywordPresent: boolean;
}

export interface AIContentResponse {
  nlpScore: number;
  readability: number;
  keywordRelevance: number;
  semanticCoverage: number;
  contentDepth: number;
  wordCount: number;
  avgSentenceLength: number;
  fleschScore: number;
  topicAuthority: number;
  eeatSignals: number;
  metrics: { label: string; value: number; maxValue: number }[];
  keywordCloud: { word: string; relevance: number }[];
  missingClusters: { cluster: string; gap: number }[];
  competitorComparison: { metric: string; yours: number; competitor: number }[];
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  optimizations: { action: string; impact: string; description: string; effort: string }[];
  topicGaps: string[];
  competitorInsight: string;
  insights: AIInsight[];
  eeatAnalysis: AIContentEEATSignal[];
  headingStructure: AIContentHeading[];
  sentimentAnalysis: { positive: number; neutral: number; negative: number };
  contentScoreHistory: { metric: string; current: number; optimal: number }[];
  internalLinkSuggestions: { anchor: string; targetPage: string; reason: string }[];
  schemaOpportunities: { type: string; description: string; impact: string }[];
}

export interface AIBacklinkToxicLink {
  domain: string;
  reason: string;
  risk: "high" | "medium" | "low";
  action: string;
}

export interface AIBacklinkCompetitor {
  domain: string;
  backlinks: number;
  referringDomains: number;
  commonLinks: number;
  uniqueLinks: number;
}

export interface AIBacklinkResponse {
  domainAuthority: number;
  totalBacklinks: number;
  referringDomains: number;
  followPercent: number;
  nofollowPercent: number;
  spamScore: number;
  trustScore: number;
  growth: { month: string; backlinks: number; domains: number }[];
  topReferrers: { domain: string; authority: number; links: number; type: string }[];
  linkTypes: { name: string; value: number }[];
  anchorTexts: { label: string; value: number; maxValue: number }[];
  insights: AIInsight[];
  toxicLinks: AIBacklinkToxicLink[];
  competitorComparison: AIBacklinkCompetitor[];
  linkVelocity: { month: string; gained: number; lost: number; net: number }[];
  tldDistribution: { tld: string; count: number; percentage: number }[];
  linkByPage: { page: string; backlinks: number; referringDomains: number; topAnchor: string }[];
  freshness: { age: string; count: number; percentage: number }[];
}

export interface AIMarketSWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface AIMarketCompetitorRadar {
  metric: string;
  you: number;
  competitor1: number;
  competitor2: number;
  competitor3: number;
}

export interface AIMarketResponse {
  marketDifficulty: number;
  opportunityScore: number;
  serpVolatility: number;
  competitorDensity: number;
  scatter: { keyword: string; difficulty: number; opportunity: number; volume: number }[];
  marketShare: { name: string; value: number }[];
  volatility: { week: string; score: number }[];
  topCompetitors: { name: string; authority: number; traffic: string; keywords: number; growth: string; weaknesses: string }[];
  keywordGrowth: { month: string; volume: number }[];
  insights: AIInsight[];
  swot: AIMarketSWOT;
  competitorRadar: AIMarketCompetitorRadar[];
  trendForecast: { month: string; actual: number; predicted: number }[];
  contentGaps: { topic: string; searchVolume: number; competition: string; yourCoverage: number }[];
  marketTrends: { trend: string; direction: "rising" | "declining" | "stable"; impact: string; timeframe: string }[];
  entryBarriers: { barrier: string; severity: number; description: string }[];
}

export interface AIDashboardInsight {
  title: string;
  description: string;
  category: string;
  urgency: string;
  estimatedImpact: string;
}

export interface AIDashboardResponse {
  strategicInsights: AIDashboardInsight[];
  weeklyFocus: string;
  competitiveAlert: string;
  growthOpportunity: string;
}

export interface AIAgentResponse {
  recommendations: {
    title: string;
    description: string;
    impact: string;
    autoFixable: boolean;
    code?: string;
    estimatedEffect: string;
  }[];
  activityLog: { action: string; impact: string }[];
  prioritySummary: string;
}

async function callSEOAnalyze<T>(type: string, payload: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("seo-analyze", {
    body: { type, payload },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "AI analysis failed");
  }

  if (!data?.success) {
    throw new Error(data?.error || "AI analysis returned no data");
  }

  return data.data as T;
}

export const aiSEOApi = {
  async auditSiteReal(url: string, html: string, markdown: string, links: string[]): Promise<AISEOAuditResponse> {
    return callSEOAnalyze<AISEOAuditResponse>("seo-audit", { url, html, markdown, links });
  },

  async analyzeKeywordReal(keyword: string, html?: string, markdown?: string): Promise<AIKeywordResponse> {
    return callSEOAnalyze<AIKeywordResponse>("keyword-analysis", { keyword, html, markdown });
  },

  async analyzeContentReal(url: string, html: string, markdown: string, links: string[]): Promise<AIContentResponse> {
    return callSEOAnalyze<AIContentResponse>("content-analysis", { url, html, markdown, links });
  },

  async analyzeBacklinksReal(url: string, html: string, markdown: string, links: string[]): Promise<AIBacklinkResponse> {
    return callSEOAnalyze<AIBacklinkResponse>("backlink-analysis", { url, html, markdown, links });
  },

  async analyzeMarketReal(niche: string, searchResults?: unknown): Promise<AIMarketResponse> {
    return callSEOAnalyze<AIMarketResponse>("market-analysis", { niche, searchResults });
  },

  async getDashboardInsights(domain: string, metrics: Record<string, unknown>): Promise<AIDashboardResponse> {
    return callSEOAnalyze<AIDashboardResponse>("dashboard-insights", { domain, metrics });
  },

  async getAgentRecommendations(agentType: string, domain: string, issues: Record<string, unknown>[]): Promise<AIAgentResponse> {
    return callSEOAnalyze<AIAgentResponse>("agent-recommendations", { agentType, domain, issues });
  },
};

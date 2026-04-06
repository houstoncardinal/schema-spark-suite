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
  optimizations: { action: string; impact: string; description: string }[];
  topicGaps: string[];
  competitorInsight: string;
  insights: AIInsight[];
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
}

export interface AIMarketResponse {
  marketDifficulty: number;
  opportunityScore: number;
  serpVolatility: number;
  competitorDensity: number;
  scatter: { keyword: string; difficulty: number; opportunity: number; volume: number }[];
  marketShare: { name: string; value: number }[];
  volatility: { week: string; score: number }[];
  topCompetitors: { name: string; authority: number; traffic: string; keywords: number }[];
  keywordGrowth: { month: string; volume: number }[];
  insights: AIInsight[];
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

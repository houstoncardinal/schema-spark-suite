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
  insights: AIInsight[];
  recommendations: AIRecommendation[];
  summary: string;
}

export interface AIKeywordResponse {
  analysis: string;
  strategy: string;
  contentAngle: string;
  competitiveInsight: string;
  relatedOpportunities: string[];
  estimatedTimeToRank: string;
}

export interface AIContentResponse {
  analysis: string;
  strengths: string[];
  weaknesses: string[];
  optimizations: { action: string; impact: string; description: string }[];
  topicGaps: string[];
  competitorInsight: string;
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
  async auditSite(url: string, scores: Record<string, number>, issues: Record<string, unknown>[]): Promise<AISEOAuditResponse> {
    return callSEOAnalyze<AISEOAuditResponse>("seo-audit", { url, scores, issues });
  },

  async analyzeKeyword(keyword: string, data: Record<string, unknown>): Promise<AIKeywordResponse> {
    return callSEOAnalyze<AIKeywordResponse>("keyword-analysis", { keyword, data });
  },

  async analyzeContent(input: string, scores: Record<string, unknown>): Promise<AIContentResponse> {
    return callSEOAnalyze<AIContentResponse>("content-analysis", { input, scores });
  },

  async getDashboardInsights(domain: string, metrics: Record<string, unknown>): Promise<AIDashboardResponse> {
    return callSEOAnalyze<AIDashboardResponse>("dashboard-insights", { domain, metrics });
  },

  async getAgentRecommendations(agentType: string, domain: string, issues: Record<string, unknown>[]): Promise<AIAgentResponse> {
    return callSEOAnalyze<AIAgentResponse>("agent-recommendations", { agentType, domain, issues });
  },
};

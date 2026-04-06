import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildPrompt(type: string, payload: Record<string, unknown>): { system: string; user: string } | null {
  switch (type) {
    case "seo-audit": {
      const { url, html, markdown, links } = payload;
      return {
        system: `You are a world-class SEO consultant with 15+ years of experience. Analyze REAL website HTML and content to provide expert-level, actionable SEO insights. Every insight must be derived from the actual page content provided. Return valid JSON only.`,
        user: `Analyze this REAL website data for ${url}.

ACTUAL HTML (first 15000 chars):
${(html as string || "").substring(0, 15000)}

ACTUAL PAGE CONTENT (markdown, first 5000 chars):
${(markdown as string || "").substring(0, 5000)}

LINKS FOUND ON PAGE: ${JSON.stringify((links as string[] || []).slice(0, 50))}

Analyze the REAL HTML for title tag, meta description, H1-H3 structure, schema markup, image alt text, internal/external links, mobile viewport, canonical tags, OG tags, content quality, and performance indicators.

Return JSON:
{
  "scores": { "overall": number, "technical": number, "content": number, "authority": number, "ux": number, "speed": number, "schema": number },
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string", "impact": "High|Medium|Low", "action": "string" }],
  "recommendations": [{ "priority": "High|Medium|Low", "title": "string", "description": "string", "completed": false }],
  "summary": "2-3 sentence executive summary",
  "metaAnalysis": { "title": "string|null", "description": "string|null", "h1Count": number, "hasSchema": boolean, "hasCanonical": boolean, "hasViewport": boolean, "imagesMissingAlt": number, "internalLinks": number, "externalLinks": number }
}

Generate 6-8 insights and 6-8 recommendations.`,
      };
    }

    case "keyword-analysis": {
      const { keyword, html, markdown } = payload;
      return {
        system: `You are an expert SEO keyword strategist. Provide realistic, data-driven keyword analysis. Return valid JSON only.`,
        user: `Analyze keyword: "${keyword}"

${html ? `PAGE CONTENT (first 5000 chars): ${(html as string).substring(0, 5000)}` : ""}
${markdown ? `PAGE TEXT (first 3000 chars): ${(markdown as string).substring(0, 3000)}` : ""}

Return JSON:
{
  "volume": number, "difficulty": number (0-100), "cpc": number,
  "intent": "Informational|Commercial|Transactional|Navigational",
  "analysis": "string", "strategy": "string", "contentAngle": "string", "competitiveInsight": "string",
  "relatedKeywords": [{ "keyword": "string", "volume": number, "difficulty": number, "cpc": number, "intent": "string", "trend": "up|down|stable" }],
  "trendData": [{ "month": "string", "volume": number }],
  "estimatedTimeToRank": "string",
  "relatedOpportunities": ["string"]
}

Generate 12 related keywords and 12 months of trend data.`,
      };
    }

    case "content-analysis": {
      const { url, html, markdown, links } = payload;
      return {
        system: `You are an expert content strategist and NLP analyst specializing in SEO content optimization. Analyze REAL page content. Return valid JSON only.`,
        user: `Analyze content for: ${url}

HTML (first 10000 chars): ${(html as string || "").substring(0, 10000)}
TEXT (first 5000 chars): ${(markdown as string || "").substring(0, 5000)}
LINKS: ${JSON.stringify((links as string[] || []).slice(0, 30))}

Return JSON:
{
  "nlpScore": number, "readability": number, "keywordRelevance": number, "semanticCoverage": number,
  "contentDepth": number, "wordCount": number, "avgSentenceLength": number, "fleschScore": number,
  "topicAuthority": number, "eeatSignals": number,
  "metrics": [{ "label": "string", "value": number, "maxValue": 100 }],
  "keywordCloud": [{ "word": "string", "relevance": number }],
  "missingClusters": [{ "cluster": "string", "gap": number }],
  "competitorComparison": [{ "metric": "string", "yours": number, "competitor": number }],
  "analysis": "string", "strengths": ["string"], "weaknesses": ["string"],
  "optimizations": [{ "action": "string", "impact": "string", "description": "string" }],
  "topicGaps": ["string"], "competitorInsight": "string",
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string", "impact": "string", "action": "string" }]
}`,
      };
    }

    case "backlink-analysis": {
      const { url, html, markdown, links } = payload;
      return {
        system: `You are a backlink analysis expert. Analyze real website data and observable signals. Return valid JSON only.`,
        user: `Analyze backlink profile for: ${url}

HTML (first 8000 chars): ${(html as string || "").substring(0, 8000)}
LINKS: ${JSON.stringify((links as string[] || []).slice(0, 100))}
CONTENT (first 3000 chars): ${(markdown as string || "").substring(0, 3000)}

Return JSON:
{
  "domainAuthority": number, "totalBacklinks": number, "referringDomains": number,
  "followPercent": number, "nofollowPercent": number, "spamScore": number, "trustScore": number,
  "growth": [{ "month": "string", "backlinks": number, "domains": number }],
  "topReferrers": [{ "domain": "string", "authority": number, "links": number, "type": "string" }],
  "linkTypes": [{ "name": "string", "value": number }],
  "anchorTexts": [{ "label": "string", "value": number, "maxValue": 100 }],
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string", "impact": "string", "action": "string" }]
}

Generate 6 months growth, 6 top referrers, 5 link types, 5 anchor categories, 4-5 insights.`,
      };
    }

    case "market-analysis": {
      const { niche, searchResults } = payload;
      return {
        system: `You are a competitive SEO market analyst. Return valid JSON only.`,
        user: `Analyze competitive landscape for: "${niche}"

${searchResults ? `SEARCH RESULTS: ${JSON.stringify(searchResults)}` : ""}

Return JSON:
{
  "marketDifficulty": number, "opportunityScore": number, "serpVolatility": number, "competitorDensity": number,
  "scatter": [{ "keyword": "string", "difficulty": number, "opportunity": number, "volume": number }],
  "marketShare": [{ "name": "string", "value": number }],
  "volatility": [{ "week": "string", "score": number }],
  "topCompetitors": [{ "name": "string", "authority": number, "traffic": "string", "keywords": number }],
  "keywordGrowth": [{ "month": "string", "volume": number }],
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string", "impact": "string", "action": "string" }]
}

Generate 8-10 scatter keywords, 4 market segments, 12 weeks volatility, 5 real competitors, 12 months growth, 4-5 insights.`,
      };
    }

    case "dashboard-insights": {
      const { domain, metrics } = payload;
      return {
        system: `You are an elite SEO intelligence system. Generate strategic insights. Return valid JSON only.`,
        user: `Generate SEO insights for ${domain}. Metrics: ${JSON.stringify(metrics)}

Return JSON:
{
  "strategicInsights": [{ "title": "string", "description": "string", "category": "string", "urgency": "immediate|short-term|long-term", "estimatedImpact": "string" }],
  "weeklyFocus": "string",
  "competitiveAlert": "string",
  "growthOpportunity": "string"
}

Generate 5 strategic insights.`,
      };
    }

    case "agent-recommendations": {
      const { agentType, domain, issues } = payload;
      return {
        system: `You are an autonomous AI SEO agent specializing in ${agentType} optimization. Return valid JSON only.`,
        user: `As a ${agentType} agent for ${domain}, generate recommendations. Issues: ${JSON.stringify(issues)}

Return JSON:
{
  "recommendations": [{ "title": "string", "description": "string", "impact": "string", "autoFixable": boolean, "code": "string|null", "estimatedEffect": "string" }],
  "activityLog": [{ "action": "string", "impact": "string" }],
  "prioritySummary": "string"
}

Generate 4-5 recommendations and 3-4 activity entries.`,
      };
    }

    case "dashboard-full": {
      const { domain, html, markdown, links, pages } = payload;
      return {
        system: `You are an elite SEO analyst. Given REAL scraped website data, generate a comprehensive dashboard analysis with realistic metrics. Every metric must be derived from actual observable signals in the HTML, content quality, link structure, and site architecture. Do NOT invent data — estimate based on real signals. Return valid JSON only.`,
        user: `Generate a full SEO dashboard analysis for: ${domain}

HOMEPAGE HTML (first 12000 chars):
${(html as string || "").substring(0, 12000)}

HOMEPAGE CONTENT (first 4000 chars):
${(markdown as string || "").substring(0, 4000)}

LINKS FOUND: ${JSON.stringify((links as string[] || []).slice(0, 80))}

SITE PAGES DISCOVERED: ${JSON.stringify((pages as string[] || []).slice(0, 30))}

Analyze the REAL site data and return a comprehensive dashboard. Estimate all metrics based on observable signals (content quality, technical implementation, link structure, schema presence, mobile-readiness, page speed indicators).

Return JSON with this EXACT structure:
{
  "project": {
    "healthScore": number (0-100, based on technical analysis),
    "domainAuthority": number (0-100, estimated from content quality and link signals),
    "organicTraffic": number (estimated monthly sessions based on content breadth and quality),
    "keywordsRanked": number (estimated based on content topics found),
    "totalBacklinks": number (estimated from domain maturity signals),
    "activeIssues": number (actual issues found in HTML)
  },
  "trafficData": [
    { "date": "Mon DD", "organic": number, "paid": number, "direct": number, "referral": number, "social": number }
  ],
  "keywords": [
    { "keyword": "real topic from content", "position": number, "previousPosition": number, "change": number, "volume": number, "url": "/path", "difficulty": number, "cpc": number, "intent": "Informational|Commercial|Transactional|Navigational", "trend": [number, number, number, number, number, number, number] }
  ],
  "backlinks": {
    "totalBacklinks": number, "referringDomains": number, "dofollow": number, "nofollow": number,
    "trustScore": number, "spamScore": number,
    "anchorDistribution": [{ "anchor": "text", "count": number, "percentage": number }],
    "growthData": [{ "month": "Mon", "links": number, "domains": number }],
    "topReferrers": [{ "domain": "domain.com", "authority": number, "links": number, "type": "dofollow|nofollow" }]
  },
  "auditIssues": [
    { "id": "issue-N", "severity": "critical|warning|notice", "category": "string", "title": "specific issue found in HTML", "description": "detailed explanation", "affectedPages": number, "fixPriority": number }
  ],
  "competitors": [
    { "domain": "real-competitor.com", "authority": number, "traffic": number, "keywords": number, "backlinks": number, "commonKeywords": number, "gapKeywords": number }
  ],
  "contentPages": [
    { "url": "/path", "title": "Page Title", "traffic": number, "keywords": number, "seoScore": number, "wordCount": number, "lastUpdated": "Nd ago", "bounceRate": number, "avgTimeOnPage": "M:SS" }
  ],
  "tasks": [
    { "id": "task-N", "priority": "high|medium|low", "title": "specific action", "description": "detailed description", "impact": "projected impact", "category": "Technical|Content|Schema|Links|Performance|Accessibility", "completed": false, "effort": "X-Y hours" }
  ],
  "geoTraffic": [
    { "country": "country name", "sessions": number, "percentage": number }
  ],
  "visibilityScore": number,
  "estimatedClicks": number,
  "estimatedImpressions": number,
  "crawledPages": number,
  "indexedPages": number,
  "avgPosition": number
}

IMPORTANT: Generate 24 traffic data points (weekly for 6 months), 12-20 keywords extracted from actual page content/topics, 6-10 audit issues found in the actual HTML, 5 real competitors in the same niche, content pages based on actual discovered URLs, 6-8 actionable tasks, and 8 geo regions. All keywords must be real topics found in or relevant to the actual content.`,
      };
    }

    case "predictive-full": {
      const { domain, html, markdown, links, healthScore, domainAuthority, organicTraffic } = payload;
      return {
        system: `You are a predictive SEO intelligence engine. Given REAL website data and current metrics, generate predictive analysis including TrueRank scoring, topical authority mapping, SERP dominance analysis, content depth scoring, traffic forecasts, AI agent recommendations, and SERP simulation. All predictions must be grounded in the actual site data provided. Return valid JSON only.`,
        user: `Generate predictive SEO intelligence for: ${domain}

Current metrics: healthScore=${healthScore}, domainAuthority=${domainAuthority}, organicTraffic=${organicTraffic}

HOMEPAGE HTML (first 8000 chars):
${(html as string || "").substring(0, 8000)}

CONTENT (first 3000 chars):
${(markdown as string || "").substring(0, 3000)}

LINKS: ${JSON.stringify((links as string[] || []).slice(0, 50))}

Return JSON with this EXACT structure:
{
  "trueRank": {
    "overall": number (0-100),
    "factors": [{ "name": "factor name", "score": number, "weight": number, "description": "string" }],
    "rankingProbability": number,
    "projectedPosition": number,
    "confidence": number
  },
  "topicalAuthority": {
    "overall": number,
    "clusters": [{ "id": "topic-N", "name": "topic from actual content", "authority": number, "keywords": number, "contentPieces": number, "coverage": number, "children": [{ "name": "subtopic", "authority": number }], "sentiment": "strong|moderate|weak|missing" }],
    "coveragePercentage": number,
    "missingTopics": ["topics not covered"],
    "authorityTrend": [{ "month": "Mon", "score": number }]
  },
  "serpDominance": {
    "overall": number,
    "featuredSnippetChance": number, "faqRichResultChance": number, "sitelinksChance": number,
    "imagePackChance": number, "videoChance": number,
    "serpFeatures": [{ "feature": "feature name", "current": boolean, "potential": number }],
    "estimatedCTR": number
  },
  "contentDepth": {
    "overall": number, "semanticCoverage": number, "entityDensity": number,
    "readabilityGrade": number, "uniquenessScore": number, "freshness": number,
    "eeatSignals": [{ "signal": "signal name", "score": number }]
  },
  "predictiveModel": {
    "trafficForecast": [{ "month": "Mon", "current": number, "optimized": number, "aggressive": number }],
    "rankingForecast": [{ "week": "WN", "position": number, "confidence": number }],
    "scenarios": [{ "id": "sN", "name": "string", "description": "string", "actions": ["string"], "predictedTrafficChange": number, "predictedRankChange": number, "timeToResult": "string", "confidence": number, "effort": "low|medium|high", "roi": number }],
    "growthTrajectory": number
  },
  "aiAgents": [
    { "id": "agent-type", "name": "Agent Name", "type": "technical|content|linking|schema", "status": "active|idle|analyzing", "lastRun": "Xm ago", "issuesFound": number, "issuesFixed": number, "recommendations": [{ "title": "string", "description": "string", "impact": "high|medium|low", "autoFixable": boolean, "code": "string|null" }], "activity": [{ "time": "string", "action": "string", "impact": "string" }] }
  ],
  "serpSimulation": {
    "query": "primary keyword for domain",
    "results": [{ "position": number, "title": "string", "url": "string", "description": "string", "isYou": boolean, "features": ["string"] }],
    "yourPosition": number,
    "featuredSnippet": { "shown": boolean, "owner": "string", "content": "string" },
    "faqResults": [{ "question": "string", "answer": "string" }],
    "relatedSearches": ["string"]
  }
}

Generate 8 TrueRank factors, 8-10 topical clusters based on actual content topics, 7 SERP features, 5 E-E-A-T signals, 12 months traffic forecast, 12 weeks ranking forecast, 4 what-if scenarios, 4 AI agents with 3 recommendations each, and 10 SERP simulation results. All topics/keywords must come from the actual page content.`,
      };
    }

    default:
      return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, payload } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const prompt = buildPrompt(type, payload);
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Unknown analysis type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds at Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : content.trim());
    } catch {
      console.error("Failed to parse AI response:", content.substring(0, 500));
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content.substring(0, 200) }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: parsed }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("seo-analyze error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

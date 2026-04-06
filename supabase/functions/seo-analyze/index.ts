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
        system: `You are a world-class SEO consultant with 15+ years of experience. You analyze REAL website HTML and content to provide expert-level, actionable SEO insights. Analyze the actual HTML structure, meta tags, headings, content quality, schema markup, links, and technical elements. Your tone is professional, confident, and data-driven. Every insight must be derived from the actual page content provided. Format your response as valid JSON.`,
        user: `Analyze this REAL website data for ${url} and generate expert SEO insights.

ACTUAL HTML (first 15000 chars):
${(html as string || "").substring(0, 15000)}

ACTUAL PAGE CONTENT (markdown, first 5000 chars):
${(markdown as string || "").substring(0, 5000)}

LINKS FOUND ON PAGE: ${JSON.stringify((links as string[] || []).slice(0, 50))}

Analyze the REAL HTML for:
1. Title tag, meta description presence and quality
2. H1/H2/H3 heading structure
3. Schema/structured data markup
4. Image alt text presence
5. Internal/external link quality
6. Mobile viewport meta tag
7. Canonical tags
8. Open Graph / Twitter card tags
9. Content quality and keyword usage
10. Page load indicators (inline CSS/JS bloat, render-blocking resources)

Generate REAL scores based on your analysis (0-100):
- overall, technical, content, authority, ux, speed, schema

Return a JSON object with this exact structure:
{
  "scores": { "overall": number, "technical": number, "content": number, "authority": number, "ux": number, "speed": number, "schema": number },
  "insights": [
    { "type": "critical|warning|opportunity|info", "title": "specific insight title with data points", "description": "detailed 2-3 sentence explanation", "impact": "High|Medium|Low", "action": "short action label" }
  ],
  "recommendations": [
    { "priority": "High|Medium|Low", "title": "specific recommendation", "description": "detailed implementation guidance", "completed": false }
  ],
  "summary": "2-3 sentence executive summary",
  "metaAnalysis": { "title": "actual title tag or null", "description": "actual meta description or null", "h1Count": number, "hasSchema": boolean, "hasCanonical": boolean, "hasViewport": boolean, "imagesMissingAlt": number, "internalLinks": number, "externalLinks": number }
}

Generate exactly 6-8 insights and 6-8 recommendations based on REAL issues found.`,
      };
    }

    case "keyword-analysis": {
      const { keyword, html, markdown } = payload;
      return {
        system: `You are an expert SEO keyword strategist with access to real search data knowledge. Provide realistic, data-driven keyword analysis. When given actual page content, analyze how well it targets the keyword. Return valid JSON only.`,
        user: `Analyze this keyword: "${keyword}"

${html ? `ACTUAL PAGE CONTENT targeting this keyword (first 5000 chars):
${(html as string).substring(0, 5000)}` : ""}

${markdown ? `PAGE TEXT (first 3000 chars):
${(markdown as string).substring(0, 3000)}` : ""}

Based on your knowledge of real search data, provide realistic estimates. Return JSON:
{
  "volume": number (estimated monthly search volume),
  "difficulty": number (0-100 keyword difficulty),
  "cpc": number (estimated cost per click in USD),
  "intent": "Informational|Commercial|Transactional|Navigational",
  "analysis": "3-4 sentence expert analysis of this keyword's potential",
  "strategy": "recommended content strategy for ranking",
  "contentAngle": "specific content angle to target",
  "competitiveInsight": "insight about the competitive landscape",
  "relatedKeywords": [
    { "keyword": "related term", "volume": number, "difficulty": number, "cpc": number, "intent": "type", "trend": "up|down|stable" }
  ],
  "trendData": [
    { "month": "Jan", "volume": number }
  ],
  "estimatedTimeToRank": "realistic time estimate with explanation",
  "relatedOpportunities": ["5 related keyword opportunities"]
}

Generate exactly 12 related keywords with realistic data and 12 months of trend data.`,
      };
    }

    case "content-analysis": {
      const { url, html, markdown, links } = payload;
      return {
        system: `You are an expert content strategist and NLP analyst specializing in SEO content optimization. You analyze REAL page content for quality, readability, semantic depth, and competitive positioning. Return valid JSON only.`,
        user: `Analyze this REAL page content for SEO optimization.

URL: ${url}

ACTUAL HTML (first 10000 chars):
${(html as string || "").substring(0, 10000)}

PAGE TEXT (first 5000 chars):
${(markdown as string || "").substring(0, 5000)}

LINKS: ${JSON.stringify((links as string[] || []).slice(0, 30))}

Analyze the REAL content for readability, keyword usage, semantic coverage, heading structure, word count, and content depth. Compare against what top-ranking pages typically have.

Return JSON:
{
  "nlpScore": number (0-100 overall content quality),
  "readability": number (0-100),
  "keywordRelevance": number (0-100),
  "semanticCoverage": number (0-100),
  "contentDepth": number (0-100),
  "wordCount": number (actual word count from content),
  "avgSentenceLength": number,
  "fleschScore": number (Flesch readability score),
  "topicAuthority": number (0-100),
  "eeatSignals": number (0-100),
  "metrics": [
    { "label": "metric name", "value": number, "maxValue": 100 }
  ],
  "keywordCloud": [
    { "word": "keyword", "relevance": number (0-100) }
  ],
  "missingClusters": [
    { "cluster": "topic name", "gap": number (0-100) }
  ],
  "competitorComparison": [
    { "metric": "name", "yours": number, "competitor": number }
  ],
  "analysis": "detailed 3-4 sentence content analysis",
  "strengths": ["3 specific content strengths from the actual page"],
  "weaknesses": ["3 specific content weaknesses from the actual page"],
  "optimizations": [
    { "action": "specific optimization", "impact": "High|Medium|Low", "description": "why this matters" }
  ],
  "topicGaps": ["5 missing topic areas to cover"],
  "competitorInsight": "what top-ranking content does differently",
  "insights": [
    { "type": "critical|warning|opportunity|info", "title": "insight title", "description": "detailed explanation", "impact": "High|Medium|Low", "action": "action label" }
  ]
}

Generate 12-15 keywords in the cloud, 5-7 missing clusters, 5 competitor comparison metrics, and 4-5 insights. All data must be derived from the ACTUAL content provided.`,
      };
    }

    case "backlink-analysis": {
      const { url, html, markdown, links } = payload;
      return {
        system: `You are a backlink analysis expert. Given real website HTML and links, analyze the site's link profile, estimate domain authority based on observable signals, and provide actionable link building intelligence. Use the actual links found on the page and observable trust signals to make your assessment. Return valid JSON only.`,
        user: `Analyze the backlink profile and link signals for: ${url}

ACTUAL HTML (first 8000 chars):
${(html as string || "").substring(0, 8000)}

LINKS FOUND ON PAGE: ${JSON.stringify((links as string[] || []).slice(0, 100))}

PAGE CONTENT (first 3000 chars):
${(markdown as string || "").substring(0, 3000)}

Based on the actual page data, analyze:
1. External links and their quality
2. Internal linking structure
3. Trust signals (HTTPS, established domain patterns, content quality)
4. Link profile health indicators
5. Anchor text patterns

Return JSON:
{
  "domainAuthority": number (estimated 0-100 based on observable signals),
  "totalBacklinks": number (estimated based on domain maturity signals),
  "referringDomains": number (estimated),
  "followPercent": number (estimated dofollow percentage),
  "nofollowPercent": number,
  "spamScore": number (0-100 estimated risk),
  "trustScore": number (0-100),
  "growth": [
    { "month": "name", "backlinks": number, "domains": number }
  ],
  "topReferrers": [
    { "domain": "domain.com", "authority": number, "links": number, "type": "dofollow|nofollow" }
  ],
  "linkTypes": [
    { "name": "Editorial|Guest Post|Directory|Social|Other", "value": number (percentage) }
  ],
  "anchorTexts": [
    { "label": "anchor type", "value": number (percentage), "maxValue": 100 }
  ],
  "insights": [
    { "type": "critical|warning|opportunity|info", "title": "insight title", "description": "detailed explanation", "impact": "High|Medium|Low", "action": "action label" }
  ]
}

Generate 6 months of growth data, 6 top referrers, 5 link types, 5 anchor text categories, and 4-5 insights. Base estimates on the actual domain's observable characteristics.`,
      };
    }

    case "market-analysis": {
      const { niche, searchResults } = payload;
      return {
        system: `You are a competitive SEO market analyst. Given a niche and real search results data, analyze the competitive landscape with real market intelligence. Provide specific, data-driven analysis of the competitive environment. Return valid JSON only.`,
        user: `Analyze the competitive SEO landscape for niche: "${niche}"

${searchResults ? `REAL SEARCH RESULTS DATA:
${JSON.stringify(searchResults)}` : ""}

Provide comprehensive market analysis based on your knowledge of this niche's competitive landscape.

Return JSON:
{
  "marketDifficulty": number (0-100),
  "opportunityScore": number (0-100),
  "serpVolatility": number (0-100),
  "competitorDensity": number (0-100),
  "scatter": [
    { "keyword": "term", "difficulty": number, "opportunity": number, "volume": number }
  ],
  "marketShare": [
    { "name": "segment", "value": number (percentage) }
  ],
  "volatility": [
    { "week": "W1", "score": number }
  ],
  "topCompetitors": [
    { "name": "domain.com", "authority": number, "traffic": "XK", "keywords": number }
  ],
  "keywordGrowth": [
    { "month": "name", "volume": number }
  ],
  "insights": [
    { "type": "critical|warning|opportunity|info", "title": "insight title", "description": "detailed explanation", "impact": "High|Medium|Low", "action": "action label" }
  ]
}

Generate 8-10 scatter keywords, 4 market share segments, 12 weeks volatility, 5 real competitors (use actual known domains in this niche), 12 months keyword growth, and 4-5 insights.`,
      };
    }

    case "dashboard-insights": {
      const { domain, metrics } = payload;
      return {
        system: `You are an elite SEO intelligence system. Generate strategic, data-driven insights for SEO dashboards. Be specific, reference numbers, and provide actionable intelligence. Return valid JSON only.`,
        user: `Generate strategic SEO insights for ${domain}.

Current Metrics: ${JSON.stringify(metrics)}

Return JSON:
{
  "strategicInsights": [
    { "title": "insight with specific metrics", "description": "2-3 sentence actionable insight", "category": "traffic|keywords|technical|content|authority", "urgency": "immediate|short-term|long-term", "estimatedImpact": "specific projected impact" }
  ],
  "weeklyFocus": "the single most important SEO action this week",
  "competitiveAlert": "one competitive intelligence observation",
  "growthOpportunity": "highest-ROI growth opportunity identified"
}

Generate exactly 5 strategic insights.`,
      };
    }

    case "agent-recommendations": {
      const { agentType, domain, issues } = payload;
      return {
        system: `You are an autonomous AI SEO agent specializing in ${agentType} optimization. Generate specific, implementable recommendations. Return valid JSON only.`,
        user: `As a ${agentType} SEO agent analyzing ${domain}, generate recommendations.

Current issues: ${JSON.stringify(issues)}

Return JSON:
{
  "recommendations": [
    { "title": "specific actionable recommendation", "description": "detailed implementation steps", "impact": "high|medium|low", "autoFixable": true, "code": "code snippet if applicable, otherwise null", "estimatedEffect": "specific projected improvement" }
  ],
  "activityLog": [
    { "action": "specific action taken", "impact": "measurable result" }
  ],
  "prioritySummary": "one sentence summary of top priority"
}

Generate 4-5 recommendations and 3-4 activity entries.`,
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
        model: "google/gemini-3-flash-preview",
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
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
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

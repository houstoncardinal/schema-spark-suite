import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, payload } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";

    switch (type) {
      case "seo-audit": {
        const { url, scores, issues } = payload;
        systemPrompt = `You are a world-class SEO consultant with 15+ years of experience. You analyze websites and provide expert-level, actionable SEO insights. Your tone is professional, confident, and data-driven. Never be generic — every insight must be specific to the data provided. Format your response as valid JSON.`;
        userPrompt = `Analyze this SEO audit data for ${url} and generate expert insights.

Audit Scores:
- Overall: ${scores.overall}/100
- Technical: ${scores.technical}/100
- Content: ${scores.content}/100
- Authority: ${scores.authority}/100
- UX: ${scores.ux}/100
- Speed: ${scores.speed}/100
- Schema: ${scores.schema}/100

Issues Found: ${JSON.stringify(issues)}

Return a JSON object with this exact structure:
{
  "insights": [
    {
      "type": "critical|warning|opportunity|info",
      "title": "specific insight title with data points",
      "description": "detailed 2-3 sentence explanation with specific numbers and actionable advice",
      "impact": "High|Medium|Low",
      "action": "short action label"
    }
  ],
  "recommendations": [
    {
      "priority": "High|Medium|Low",
      "title": "specific recommendation",
      "description": "detailed implementation guidance",
      "completed": false
    }
  ],
  "summary": "2-3 sentence executive summary of the site's SEO health"
}

Generate exactly 6-8 insights and 6-8 recommendations. Be specific — reference the actual scores and issues. Prioritize by impact.`;
        break;
      }

      case "keyword-analysis": {
        const { keyword, data } = payload;
        systemPrompt = `You are an expert SEO keyword strategist. Analyze keyword data and provide actionable intelligence. Return valid JSON only.`;
        userPrompt = `Analyze this keyword: "${keyword}"

Data: ${JSON.stringify(data)}

Return JSON:
{
  "analysis": "3-4 sentence expert analysis of this keyword's potential",
  "strategy": "recommended content strategy for ranking",
  "contentAngle": "specific content angle to target",
  "competitiveInsight": "insight about the competitive landscape",
  "relatedOpportunities": ["list of 5 related keyword opportunities"],
  "estimatedTimeToRank": "realistic time estimate with explanation"
}`;
        break;
      }

      case "content-analysis": {
        const { input, scores } = payload;
        systemPrompt = `You are an expert content strategist and NLP analyst specializing in SEO content optimization. Return valid JSON only.`;
        userPrompt = `Analyze this content/URL for SEO optimization: "${input}"

Content Scores: ${JSON.stringify(scores)}

Return JSON:
{
  "analysis": "detailed 3-4 sentence content analysis",
  "strengths": ["3 specific content strengths"],
  "weaknesses": ["3 specific content weaknesses"],
  "optimizations": [
    {"action": "specific optimization", "impact": "High|Medium|Low", "description": "why this matters"}
  ],
  "topicGaps": ["5 missing topic areas to cover"],
  "competitorInsight": "what top-ranking content does differently"
}`;
        break;
      }

      case "dashboard-insights": {
        const { domain, metrics } = payload;
        systemPrompt = `You are an elite SEO intelligence system. Generate strategic, data-driven insights for SEO dashboards. Be specific, reference numbers, and provide actionable intelligence. Return valid JSON only.`;
        userPrompt = `Generate strategic SEO insights for ${domain}.

Current Metrics: ${JSON.stringify(metrics)}

Return JSON:
{
  "strategicInsights": [
    {
      "title": "insight with specific metrics",
      "description": "2-3 sentence actionable insight",
      "category": "traffic|keywords|technical|content|authority",
      "urgency": "immediate|short-term|long-term",
      "estimatedImpact": "specific projected impact"
    }
  ],
  "weeklyFocus": "the single most important SEO action this week",
  "competitiveAlert": "one competitive intelligence observation",
  "growthOpportunity": "highest-ROI growth opportunity identified"
}

Generate exactly 5 strategic insights.`;
        break;
      }

      case "agent-recommendations": {
        const { agentType, domain, issues } = payload;
        systemPrompt = `You are an autonomous AI SEO agent specializing in ${agentType} optimization. Generate specific, implementable recommendations. Return valid JSON only.`;
        userPrompt = `As a ${agentType} SEO agent analyzing ${domain}, generate recommendations.

Current issues: ${JSON.stringify(issues)}

Return JSON:
{
  "recommendations": [
    {
      "title": "specific actionable recommendation",
      "description": "detailed implementation steps",
      "impact": "high|medium|low",
      "autoFixable": true/false,
      "code": "code snippet if applicable, otherwise null",
      "estimatedEffect": "specific projected improvement"
    }
  ],
  "activityLog": [
    {"action": "specific action taken", "impact": "measurable result"}
  ],
  "prioritySummary": "one sentence summary of top priority"
}

Generate 4-5 recommendations and 3-4 activity entries.`;
        break;
      }

      default:
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited — please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Add funds at Settings → Workspace → Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from response (handle markdown code blocks)
    let parsed;
    try {
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      parsed = JSON.parse(jsonMatch ? jsonMatch[1].trim() : content.trim());
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response", raw: content }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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

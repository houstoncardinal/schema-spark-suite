import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ---------------------------------------------------------------------------
// Deterministic HTML signal extraction — gives every analysis REAL measurements
// instead of relying purely on an LLM's guess about the page.
// ---------------------------------------------------------------------------
interface SEOSignals {
  title: string | null;
  titleLength: number;
  description: string | null;
  descriptionLength: number;
  canonical: string | null;
  robots: string | null;
  viewport: string | null;
  lang: string | null;
  charset: string | null;
  h1: string[];
  h2: string[];
  h3: string[];
  headingOutline: { tag: string; text: string }[];
  imagesTotal: number;
  imagesMissingAlt: number;
  imagesLazy: number;
  internalLinks: number;
  externalLinks: number;
  nofollowLinks: number;
  anchorTexts: string[];
  ogTags: Record<string, string>;
  twitterTags: Record<string, string>;
  schemaTypes: string[];
  schemaCount: number;
  hreflang: string[];
  hasFavicon: boolean;
  hasManifest: boolean;
  hasServiceWorker: boolean;
  hasGtag: boolean;
  hasGTM: boolean;
  inlineScripts: number;
  externalScripts: number;
  stylesheets: number;
  wordCount: number;
  textHtmlRatio: number;
  hasH1: boolean;
  multipleH1: boolean;
  httpsLinks: number;
  httpLinks: number;
}

function getAttr(tag: string, attr: string): string | null {
  const re = new RegExp(`${attr}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i");
  const m = tag.match(re);
  return m ? (m[2] ?? m[3] ?? m[4] ?? null) : null;
}

function extractSEOSignals(html: string, markdown: string, baseUrl: string): SEOSignals {
  const safe = html || "";
  const lower = safe.toLowerCase();

  const baseHost = (() => {
    try { return new URL(baseUrl.startsWith("http") ? baseUrl : `https://${baseUrl}`).hostname.replace(/^www\./, ""); }
    catch { return ""; }
  })();

  const titleMatch = safe.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, " ") : null;

  const metaTags = [...safe.matchAll(/<meta\b[^>]*>/gi)].map(m => m[0]);
  const findMeta = (key: string, attr: "name" | "property" = "name") =>
    metaTags.find(t => (getAttr(t, attr) || "").toLowerCase() === key.toLowerCase());

  const descTag = findMeta("description");
  const description = descTag ? getAttr(descTag, "content") : null;
  const robotsTag = findMeta("robots");
  const viewportTag = findMeta("viewport");
  const charsetTag = metaTags.find(t => /charset\s*=/i.test(t));

  const ogTags: Record<string, string> = {};
  const twitterTags: Record<string, string> = {};
  for (const t of metaTags) {
    const prop = (getAttr(t, "property") || "").toLowerCase();
    const name = (getAttr(t, "name") || "").toLowerCase();
    const content = getAttr(t, "content") || "";
    if (prop.startsWith("og:")) ogTags[prop] = content;
    if (name.startsWith("twitter:")) twitterTags[name] = content;
  }

  const linkTags = [...safe.matchAll(/<link\b[^>]*>/gi)].map(m => m[0]);
  const canonicalTag = linkTags.find(t => (getAttr(t, "rel") || "").toLowerCase() === "canonical");
  const canonical = canonicalTag ? getAttr(canonicalTag, "href") : null;
  const hreflang = linkTags
    .filter(t => (getAttr(t, "rel") || "").toLowerCase() === "alternate")
    .map(t => getAttr(t, "hreflang") || "")
    .filter(Boolean);
  const hasFavicon = linkTags.some(t => /icon/i.test(getAttr(t, "rel") || ""));
  const hasManifest = linkTags.some(t => (getAttr(t, "rel") || "").toLowerCase() === "manifest");

  const langMatch = safe.match(/<html\b[^>]*\blang\s*=\s*["']([^"']+)/i);

  const collectHeadings = (level: number) =>
    [...safe.matchAll(new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi"))]
      .map(m => m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim())
      .filter(Boolean);

  const h1 = collectHeadings(1);
  const h2 = collectHeadings(2);
  const h3 = collectHeadings(3);
  const headingOutline = [
    ...h1.map(t => ({ tag: "H1", text: t })),
    ...h2.slice(0, 15).map(t => ({ tag: "H2", text: t })),
    ...h3.slice(0, 20).map(t => ({ tag: "H3", text: t })),
  ];

  const imgTags = [...safe.matchAll(/<img\b[^>]*>/gi)].map(m => m[0]);
  const imagesTotal = imgTags.length;
  const imagesMissingAlt = imgTags.filter(t => !/\balt\s*=/i.test(t) || /\balt\s*=\s*["']\s*["']/i.test(t)).length;
  const imagesLazy = imgTags.filter(t => /loading\s*=\s*["']?lazy/i.test(t)).length;

  const aTags = [...safe.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)];
  let internalLinks = 0, externalLinks = 0, nofollowLinks = 0, httpsLinks = 0, httpLinks = 0;
  const anchorTexts: string[] = [];
  for (const m of aTags) {
    const attrs = m[1];
    const href = getAttr(`<a ${attrs}>`, "href") || "";
    const rel = (getAttr(`<a ${attrs}>`, "rel") || "").toLowerCase();
    const text = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (text) anchorTexts.push(text.slice(0, 80));
    if (rel.includes("nofollow")) nofollowLinks++;
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    if (href.startsWith("https://")) httpsLinks++;
    else if (href.startsWith("http://")) httpLinks++;
    if (href.startsWith("/") || (baseHost && href.includes(baseHost))) internalLinks++;
    else if (href.startsWith("http")) externalLinks++;
  }

  const schemaBlocks = [...safe.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const schemaTypes: string[] = [];
  for (const m of schemaBlocks) {
    try {
      const parsed = JSON.parse(m[1].trim());
      const collect = (n: unknown) => {
        if (!n || typeof n !== "object") return;
        const obj = n as Record<string, unknown>;
        if (typeof obj["@type"] === "string") schemaTypes.push(obj["@type"]);
        else if (Array.isArray(obj["@type"])) (obj["@type"] as string[]).forEach(t => schemaTypes.push(t));
        if (Array.isArray(obj["@graph"])) (obj["@graph"] as unknown[]).forEach(collect);
      };
      if (Array.isArray(parsed)) parsed.forEach(collect); else collect(parsed);
    } catch { /* malformed schema */ }
  }

  const inlineScripts = [...safe.matchAll(/<script(?![^>]*\bsrc=)/gi)].length;
  const externalScripts = [...safe.matchAll(/<script[^>]*\bsrc=/gi)].length;
  const stylesheets = linkTags.filter(t => (getAttr(t, "rel") || "").toLowerCase() === "stylesheet").length;

  const text = (markdown || safe.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  const textHtmlRatio = safe.length ? +(text.length / safe.length).toFixed(3) : 0;

  return {
    title, titleLength: title?.length || 0,
    description, descriptionLength: description?.length || 0,
    canonical, robots: robotsTag ? getAttr(robotsTag, "content") : null,
    viewport: viewportTag ? getAttr(viewportTag, "content") : null,
    lang: langMatch ? langMatch[1] : null,
    charset: charsetTag ? (getAttr(charsetTag, "charset") || getAttr(charsetTag, "content")) : null,
    h1, h2, h3, headingOutline,
    imagesTotal, imagesMissingAlt, imagesLazy,
    internalLinks, externalLinks, nofollowLinks, anchorTexts: anchorTexts.slice(0, 60),
    ogTags, twitterTags, schemaTypes, schemaCount: schemaBlocks.length,
    hreflang, hasFavicon, hasManifest,
    hasServiceWorker: /serviceWorker\s*\.\s*register/i.test(safe),
    hasGtag: /gtag\(|googletagmanager\.com\/gtag/i.test(safe),
    hasGTM: /googletagmanager\.com\/gtm/i.test(safe),
    inlineScripts, externalScripts, stylesheets,
    wordCount, textHtmlRatio,
    hasH1: h1.length > 0, multipleH1: h1.length > 1,
    httpsLinks, httpLinks,
  };
}

// ---------------------------------------------------------------------------
// Proprietary scoring algorithms (deterministic — derived from real signals)
// ---------------------------------------------------------------------------
function computeAuditScores(s: SEOSignals) {
  const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

  // Technical: viewport, canonical, hreflang, https, charset, lang
  let technical = 40;
  if (s.viewport) technical += 12;
  if (s.canonical) technical += 10;
  if (s.lang) technical += 6;
  if (s.charset) technical += 4;
  if (s.httpLinks === 0) technical += 8;
  if (s.hasManifest) technical += 4;
  if (s.hreflang.length) technical += 6;
  if (s.hasFavicon) technical += 3;
  if (!s.robots || !/noindex/i.test(s.robots)) technical += 7;

  // Content: H1, word count, headings depth, alt coverage, text/html ratio
  let content = 30;
  if (s.hasH1 && !s.multipleH1) content += 14; else if (s.hasH1) content += 6;
  if (s.h2.length >= 3) content += 10;
  if (s.h3.length >= 3) content += 6;
  if (s.wordCount >= 300) content += 10;
  if (s.wordCount >= 800) content += 10;
  if (s.wordCount >= 1500) content += 8;
  const altCoverage = s.imagesTotal ? 1 - s.imagesMissingAlt / s.imagesTotal : 1;
  content += Math.round(altCoverage * 10);
  if (s.textHtmlRatio >= 0.1) content += 5;

  // Schema
  let schema = 25;
  schema += Math.min(45, s.schemaCount * 18);
  if (s.schemaTypes.some(t => /Organization|WebSite/i.test(t))) schema += 15;
  if (s.schemaTypes.some(t => /Article|BlogPosting|Product|FAQ|HowTo|BreadcrumbList/i.test(t))) schema += 15;

  // UX: viewport + lazy images + manifest + low inline scripts
  let ux = 45;
  if (s.viewport && /width=device-width/i.test(s.viewport)) ux += 18;
  if (s.imagesTotal && s.imagesLazy / s.imagesTotal >= 0.5) ux += 12;
  if (s.hasManifest) ux += 8;
  if (s.inlineScripts <= 5) ux += 10;
  if (s.title && s.titleLength >= 30 && s.titleLength <= 65) ux += 7;

  // Speed proxy: fewer external scripts/stylesheets, smaller HTML, lazy images
  let speed = 60;
  speed -= Math.min(20, Math.max(0, s.externalScripts - 8) * 1.5);
  speed -= Math.min(15, Math.max(0, s.stylesheets - 5) * 2);
  if (s.imagesLazy > 0) speed += 8;
  if (s.textHtmlRatio >= 0.15) speed += 7;

  // Authority proxy: structured links, social signals, depth
  let authority = 35;
  if (Object.keys(s.ogTags).length >= 4) authority += 12;
  if (Object.keys(s.twitterTags).length >= 3) authority += 10;
  if (s.externalLinks >= 3) authority += 10;
  if (s.schemaTypes.some(t => /Organization|Person/i.test(t))) authority += 10;
  if (s.wordCount >= 1000) authority += 8;
  if (s.hreflang.length) authority += 5;

  technical = clamp(technical); content = clamp(content); schema = clamp(schema);
  ux = clamp(ux); speed = clamp(speed); authority = clamp(authority);

  const overall = clamp(technical * 0.22 + content * 0.22 + schema * 0.12 + ux * 0.14 + speed * 0.14 + authority * 0.16);
  return { overall, technical, content, authority, ux, speed, schema };
}

// ---------------------------------------------------------------------------
// Firecrawl helpers — SERP grounding + multi-page crawl
// ---------------------------------------------------------------------------
async function firecrawlSearch(query: string, limit = 10): Promise<{ url: string; title: string; description: string }[]> {
  const apiKey = Deno.env.get("FIRECRAWL_API_KEY");
  if (!apiKey) return [];
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/search", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const results = data?.data || data?.web || [];
    return (Array.isArray(results) ? results : []).map((r: Record<string, string>) => ({
      url: r.url || "", title: r.title || "", description: r.description || r.snippet || "",
    })).filter(r => r.url);
  } catch { return []; }
}

// ---------------------------------------------------------------------------
// AI gateway call with JSON-mode enforcement + automatic retry
// ---------------------------------------------------------------------------
async function callAI(system: string, user: string, model = "google/gemini-2.5-flash"): Promise<unknown> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system + "\n\nCRITICAL: Return ONLY valid JSON. No markdown, no commentary, no code fences." },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) throw Object.assign(new Error("Rate limited — please try again in a moment."), { status: 429 });
    if (response.status === 402) throw Object.assign(new Error("AI credits exhausted. Add funds at Settings → Workspace → Usage."), { status: 402 });
    const text = await response.text();
    console.error("AI gateway error:", response.status, text);
    throw new Error("AI analysis failed");
  }

  const aiData = await response.json();
  const content = aiData.choices?.[0]?.message?.content || "";
  try {
    const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    return JSON.parse(match ? match[1].trim() : content.trim());
  } catch {
    console.error("Failed to parse AI response:", content.substring(0, 500));
    throw new Error("Failed to parse AI response");
  }
}

// ---------------------------------------------------------------------------
// Prompt builders — now ground every prompt in REAL extracted signals
// ---------------------------------------------------------------------------
function buildPrompt(type: string, payload: Record<string, unknown>, signals: SEOSignals | null, serp: unknown[] = []): { system: string; user: string } | null {
  const signalBlock = signals ? `\n\nREAL EXTRACTED SIGNALS (use these exact measurements):\n${JSON.stringify(signals, null, 2)}` : "";

  switch (type) {
    case "seo-audit": {
      const { url, html, markdown } = payload;
      return {
        system: `You are a world-class SEO consultant. You receive REAL extracted signals from the page — every insight MUST reference these measurements. Return JSON only.`,
        user: `Analyze ${url}.${signalBlock}

PAGE CONTENT (first 4000 chars):
${(markdown as string || "").substring(0, 4000)}

HTML SAMPLE (first 6000 chars):
${(html as string || "").substring(0, 6000)}

Return JSON:
{
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string referencing real signals", "impact": "High|Medium|Low", "action": "string" }],
  "recommendations": [{ "priority": "High|Medium|Low", "title": "string", "description": "string", "completed": false }],
  "summary": "2-3 sentence executive summary citing real metrics",
  "competitiveAnalysis": "string"
}

Generate 8-10 insights and 8-10 recommendations grounded in the real signals.`,
      };
    }

    case "keyword-analysis": {
      const { keyword, html, markdown } = payload;
      const serpBlock = serp.length ? `\n\nREAL SERP RESULTS for "${keyword}":\n${JSON.stringify(serp, null, 2)}` : "";
      return {
        system: `You are an expert SEO keyword strategist. Ground every estimate in the REAL SERP results provided. Difficulty must reflect the actual competitors ranking. Return JSON only.`,
        user: `Deep keyword analysis for: "${keyword}"${serpBlock}

${html ? `PAGE HTML (first 4000 chars): ${(html as string).substring(0, 4000)}` : ""}
${markdown ? `PAGE TEXT (first 2500 chars): ${(markdown as string).substring(0, 2500)}` : ""}

Return JSON:
{
  "volume": number, "difficulty": number, "cpc": number,
  "intent": "Informational|Commercial|Transactional|Navigational",
  "analysis": "string", "strategy": "string", "contentAngle": "string", "competitiveInsight": "string referencing real SERP",
  "relatedKeywords": [{ "keyword": "string", "volume": number, "difficulty": number, "cpc": number, "intent": "string", "trend": "up|down|stable" }],
  "trendData": [{ "month": "string", "volume": number }],
  "estimatedTimeToRank": "string",
  "relatedOpportunities": ["string"],
  "serpFeatures": [{ "feature": "string", "present": boolean, "opportunity": number }],
  "clusters": [{ "name": "string", "keywords": ["string"], "avgDifficulty": number, "totalVolume": number, "intent": "string" }],
  "difficultyBreakdown": [{ "factor": "string", "score": number, "weight": number }],
  "seasonality": [{ "month": "string", "index": number }],
  "topRankingPages": [{ "url": "string (use real SERP URLs)", "title": "string", "authority": number, "wordCount": number, "backlinks": number }],
  "intentBreakdown": [{ "intent": "string", "percentage": number }],
  "longTailOpportunities": [{ "keyword": "string", "volume": number, "difficulty": number, "parentKeyword": "string" }]
}

Generate 15 related keywords, 12 months trend, 8 SERP features, 5 clusters, 8 difficulty factors, 12 seasonality months, ${serp.length || 5} top ranking pages (use REAL SERP URLs when provided), 4 intent segments, 8 long-tail.`,
      };
    }

    case "content-analysis": {
      const { url, html, markdown } = payload;
      return {
        system: `You are an expert content strategist and E-E-A-T specialist. Ground every score in the REAL extracted signals. Return JSON only.`,
        user: `Deep content analysis for: ${url}${signalBlock}

TEXT (first 6000 chars): ${(markdown as string || "").substring(0, 6000)}
HTML SAMPLE (first 5000 chars): ${(html as string || "").substring(0, 5000)}

Return JSON:
{
  "nlpScore": number, "readability": number, "keywordRelevance": number, "semanticCoverage": number,
  "contentDepth": number, "wordCount": number (use real wordCount from signals), "avgSentenceLength": number, "fleschScore": number,
  "topicAuthority": number, "eeatSignals": number,
  "metrics": [{ "label": "string", "value": number, "maxValue": 100 }],
  "keywordCloud": [{ "word": "string", "relevance": number }],
  "missingClusters": [{ "cluster": "string", "gap": number }],
  "competitorComparison": [{ "metric": "string", "yours": number, "competitor": number }],
  "analysis": "string", "strengths": ["string"], "weaknesses": ["string"],
  "optimizations": [{ "action": "string", "impact": "High|Medium|Low", "description": "string", "effort": "Quick Win|Moderate|Significant" }],
  "topicGaps": ["string"], "competitorInsight": "string",
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string", "impact": "string", "action": "string" }],
  "eeatAnalysis": [{ "signal": "string", "score": number, "description": "specific finding" }],
  "headingStructure": [{ "tag": "H1|H2|H3", "text": "actual heading from signals", "wordCount": number, "keywordPresent": boolean }],
  "sentimentAnalysis": { "positive": number, "neutral": number, "negative": number },
  "contentScoreHistory": [{ "metric": "string", "current": number, "optimal": number }],
  "internalLinkSuggestions": [{ "anchor": "string", "targetPage": "/path", "reason": "string" }],
  "schemaOpportunities": [{ "type": "string", "description": "string", "impact": "High|Medium|Low" }]
}

Use real heading outline from signals. Generate 8 metrics, 15 keyword cloud, 6 missing clusters, 6 comparisons, 4/4 strengths/weaknesses, 6 optimizations, 5 topic gaps, 6 insights, 8 E-E-A-T signals, real headings, sentiment, 6 score metrics, 4 link suggestions, 4 schema opportunities.`,
      };
    }

    case "backlink-analysis": {
      const { url, html, markdown, links } = payload;
      return {
        system: `You are a backlink analysis expert. Estimate the link profile from REAL signals provided. Return JSON only.`,
        user: `Backlink profile analysis for: ${url}${signalBlock}

LINKS DISCOVERED: ${JSON.stringify((links as string[] || []).slice(0, 100))}
CONTENT (first 3000 chars): ${(markdown as string || "").substring(0, 3000)}
HTML SAMPLE (first 5000 chars): ${(html as string || "").substring(0, 5000)}

Return JSON:
{
  "domainAuthority": number, "totalBacklinks": number, "referringDomains": number,
  "followPercent": number, "nofollowPercent": number, "spamScore": number, "trustScore": number,
  "growth": [{ "month": "string", "backlinks": number, "domains": number }],
  "topReferrers": [{ "domain": "string", "authority": number, "links": number, "type": "dofollow|nofollow" }],
  "linkTypes": [{ "name": "string", "value": number }],
  "anchorTexts": [{ "label": "string", "value": number, "maxValue": 100 }],
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string", "impact": "string", "action": "string" }],
  "toxicLinks": [{ "domain": "string", "reason": "string", "risk": "high|medium|low", "action": "Disavow|Monitor|Remove" }],
  "competitorComparison": [{ "domain": "string", "backlinks": number, "referringDomains": number, "commonLinks": number, "uniqueLinks": number }],
  "linkVelocity": [{ "month": "string", "gained": number, "lost": number, "net": number }],
  "tldDistribution": [{ "tld": "string", "count": number, "percentage": number }],
  "linkByPage": [{ "page": "/path", "backlinks": number, "referringDomains": number, "topAnchor": "string" }],
  "freshness": [{ "age": "string", "count": number, "percentage": number }]
}

Generate 12 months growth, 8 top referrers, 6 link types, 6 anchor categories, 6 insights, 4 toxic, 4 competitors, 12 months velocity, 7 TLDs, 5 pages, 5 freshness brackets.`,
      };
    }

    case "market-analysis": {
      const { niche } = payload;
      const serpBlock = serp.length ? `\n\nREAL SERP for "${niche}":\n${JSON.stringify(serp.slice(0, 10), null, 2)}` : "";
      return {
        system: `You are a competitive SEO market analyst. Use REAL SERP results for competitor identification. Return JSON only.`,
        user: `Competitive landscape for: "${niche}"${serpBlock}

Return JSON:
{
  "marketDifficulty": number, "opportunityScore": number, "serpVolatility": number, "competitorDensity": number,
  "scatter": [{ "keyword": "string", "difficulty": number, "opportunity": number, "volume": number }],
  "marketShare": [{ "name": "string (real competitors)", "value": number }],
  "volatility": [{ "week": "string", "score": number }],
  "topCompetitors": [{ "name": "string (real domain from SERP)", "authority": number, "traffic": "string", "keywords": number, "growth": "string", "weaknesses": "string" }],
  "keywordGrowth": [{ "month": "string", "volume": number }],
  "insights": [{ "type": "critical|warning|opportunity|info", "title": "string", "description": "string", "impact": "string", "action": "string" }],
  "swot": { "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"] },
  "competitorRadar": [{ "metric": "string", "you": number, "competitor1": number, "competitor2": number, "competitor3": number }],
  "trendForecast": [{ "month": "string", "actual": number, "predicted": number }],
  "contentGaps": [{ "topic": "string", "searchVolume": number, "competition": "Low|Medium|High", "yourCoverage": number }],
  "marketTrends": [{ "trend": "string", "direction": "rising|declining|stable", "impact": "string", "timeframe": "string" }],
  "entryBarriers": [{ "barrier": "string", "severity": number, "description": "string" }]
}

Use real competitor domains from SERP. Generate 10 scatter, 5 segments, 12 weeks, 6 competitors, 12 months growth, 6 insights, full SWOT, 6 radar, 12 months forecast, 6 gaps, 5 trends, 5 barriers.`,
      };
    }

    case "dashboard-insights": {
      const { domain, metrics } = payload;
      return {
        system: `Elite SEO intelligence system. Return JSON only.`,
        user: `Insights for ${domain}. Metrics: ${JSON.stringify(metrics)}

Return JSON:
{
  "strategicInsights": [{ "title": "string", "description": "string", "category": "string", "urgency": "immediate|short-term|long-term", "estimatedImpact": "string" }],
  "weeklyFocus": "string", "competitiveAlert": "string", "growthOpportunity": "string"
}

Generate 5 strategic insights.`,
      };
    }

    case "agent-recommendations": {
      const { agentType, domain, issues } = payload;
      return {
        system: `Autonomous AI SEO agent for ${agentType}. Return JSON only.`,
        user: `${agentType} agent for ${domain}. Issues: ${JSON.stringify(issues)}

Return JSON:
{
  "recommendations": [{ "title": "string", "description": "string", "impact": "string", "autoFixable": boolean, "code": "string|null", "estimatedEffect": "string" }],
  "activityLog": [{ "action": "string", "impact": "string" }],
  "prioritySummary": "string"
}

Generate 5 recommendations and 4 activity entries.`,
      };
    }

    case "dashboard-full": {
      const { domain, html, markdown, links, pages } = payload;
      return {
        system: `Elite SEO analyst. Ground every metric in REAL extracted signals. Return JSON only.`,
        user: `Full SEO dashboard for: ${domain}${signalBlock}

CONTENT (first 4000 chars): ${(markdown as string || "").substring(0, 4000)}
HTML SAMPLE (first 6000 chars): ${(html as string || "").substring(0, 6000)}
LINKS: ${JSON.stringify((links as string[] || []).slice(0, 60))}
PAGES DISCOVERED: ${JSON.stringify((pages as string[] || []).slice(0, 30))}

Return JSON:
{
  "project": { "healthScore": number, "domainAuthority": number, "organicTraffic": number, "keywordsRanked": number, "totalBacklinks": number, "activeIssues": number },
  "trafficData": [{ "date": "string", "organic": number, "paid": number, "direct": number, "referral": number, "social": number }],
  "keywords": [{ "keyword": "string", "position": number, "previousPosition": number, "change": number, "volume": number, "url": "/path", "difficulty": number, "cpc": number, "intent": "string", "trend": [number] }],
  "backlinks": { "totalBacklinks": number, "referringDomains": number, "dofollow": number, "nofollow": number, "trustScore": number, "spamScore": number, "anchorDistribution": [{ "anchor": "string", "count": number, "percentage": number }], "growthData": [{ "month": "string", "links": number, "domains": number }], "topReferrers": [{ "domain": "string", "authority": number, "links": number, "type": "string" }] },
  "auditIssues": [{ "id": "string", "severity": "critical|warning|notice", "category": "string", "title": "string", "description": "string", "affectedPages": number, "fixPriority": number }],
  "competitors": [{ "domain": "string", "authority": number, "traffic": number, "keywords": number, "backlinks": number, "commonKeywords": number, "gapKeywords": number }],
  "contentPages": [{ "url": "/path (use real discovered pages)", "title": "string", "traffic": number, "keywords": number, "seoScore": number, "wordCount": number, "lastUpdated": "string", "bounceRate": number, "avgTimeOnPage": "string" }],
  "tasks": [{ "id": "string", "priority": "high|medium|low", "title": "string", "description": "string", "impact": "string", "category": "string", "completed": false, "effort": "string" }],
  "geoTraffic": [{ "country": "string", "sessions": number, "percentage": number }],
  "visibilityScore": number, "estimatedClicks": number, "estimatedImpressions": number,
  "crawledPages": number, "indexedPages": number, "avgPosition": number
}

Use real discovered pages for contentPages. 24 traffic points, 15 keywords, 8 audit issues, 5 competitors, 6 content pages, 8 tasks, 8 geo regions.`,
      };
    }

    case "predictive-full": {
      const { domain, html, markdown, links, healthScore, domainAuthority, organicTraffic } = payload;
      return {
        system: `Predictive SEO intelligence engine. Return JSON only.`,
        user: `Predictive intelligence for: ${domain}${signalBlock}

Metrics: healthScore=${healthScore}, DA=${domainAuthority}, traffic=${organicTraffic}
CONTENT (first 3000 chars): ${(markdown as string || "").substring(0, 3000)}
HTML (first 5000 chars): ${(html as string || "").substring(0, 5000)}
LINKS: ${JSON.stringify((links as string[] || []).slice(0, 40))}

Return JSON:
{
  "trueRank": { "overall": number, "factors": [{ "name": "string", "score": number, "weight": number, "description": "string" }], "rankingProbability": number, "projectedPosition": number, "confidence": number },
  "topicalAuthority": { "overall": number, "clusters": [{ "id": "string", "name": "string", "authority": number, "keywords": number, "contentPieces": number, "coverage": number, "children": [{ "name": "string", "authority": number }], "sentiment": "string" }], "coveragePercentage": number, "missingTopics": ["string"], "authorityTrend": [{ "month": "string", "score": number }] },
  "serpDominance": { "overall": number, "featuredSnippetChance": number, "faqRichResultChance": number, "sitelinksChance": number, "imagePackChance": number, "videoChance": number, "serpFeatures": [{ "feature": "string", "current": boolean, "potential": number }], "estimatedCTR": number },
  "contentDepth": { "overall": number, "semanticCoverage": number, "entityDensity": number, "readabilityGrade": number, "uniquenessScore": number, "freshness": number, "eeatSignals": [{ "signal": "string", "score": number }] },
  "predictiveModel": { "trafficForecast": [{ "month": "string", "current": number, "optimized": number, "aggressive": number }], "rankingForecast": [{ "week": "string", "position": number, "confidence": number }], "scenarios": [{ "id": "string", "name": "string", "description": "string", "actions": ["string"], "predictedTrafficChange": number, "predictedRankChange": number, "timeToResult": "string", "confidence": number, "effort": "low|medium|high", "roi": number }], "growthTrajectory": number },
  "aiAgents": [{ "id": "string", "name": "string", "type": "string", "status": "string", "lastRun": "string", "issuesFound": number, "issuesFixed": number, "recommendations": [{ "title": "string", "description": "string", "impact": "string", "autoFixable": boolean, "code": "string|null" }], "activity": [{ "time": "string", "action": "string", "impact": "string" }] }],
  "serpSimulation": { "query": "string", "results": [{ "position": number, "title": "string", "url": "string", "description": "string", "isYou": boolean, "features": ["string"] }], "yourPosition": number, "featuredSnippet": { "shown": boolean, "owner": "string", "content": "string" }, "faqResults": [{ "question": "string", "answer": "string" }], "relatedSearches": ["string"] }
}

Comprehensive data for all sections.`,
      };
    }

    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { type, payload } = await req.json();

    // Extract real SEO signals if we have HTML — this powers every analysis
    let signals: SEOSignals | null = null;
    const html = (payload?.html as string) || "";
    const markdown = (payload?.markdown as string) || "";
    const urlForSignals = (payload?.url as string) || (payload?.domain as string) || "";
    if (html || markdown) {
      signals = extractSEOSignals(html, markdown, urlForSignals);
    }

    // SERP grounding for keyword & market analysis
    let serp: { url: string; title: string; description: string }[] = [];
    if (type === "keyword-analysis" && payload?.keyword) {
      serp = await firecrawlSearch(String(payload.keyword), 10);
    } else if (type === "market-analysis" && payload?.niche) {
      serp = await firecrawlSearch(String(payload.niche), 10);
    }

    const prompt = buildPrompt(type, payload, signals, serp);
    if (!prompt) {
      return new Response(JSON.stringify({ error: "Unknown analysis type" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = await callAI(prompt.system, prompt.user) as Record<string, unknown>;
    } catch (err) {
      const e = err as Error & { status?: number };
      return new Response(JSON.stringify({ error: e.message }), {
        status: e.status || 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Merge deterministic outputs over AI guesses where we have ground truth
    if (type === "seo-audit" && signals) {
      parsed.scores = computeAuditScores(signals);
      parsed.metaAnalysis = {
        title: signals.title,
        titleLength: signals.titleLength,
        description: signals.description,
        descriptionLength: signals.descriptionLength,
        h1Count: signals.h1.length,
        h2Count: signals.h2.length,
        h3Count: signals.h3.length,
        hasSchema: signals.schemaCount > 0,
        schemaTypes: signals.schemaTypes,
        hasCanonical: !!signals.canonical,
        canonical: signals.canonical,
        hasViewport: !!signals.viewport,
        imagesTotal: signals.imagesTotal,
        imagesMissingAlt: signals.imagesMissingAlt,
        internalLinks: signals.internalLinks,
        externalLinks: signals.externalLinks,
        wordCount: signals.wordCount,
        ogTagCount: Object.keys(signals.ogTags).length,
        twitterTagCount: Object.keys(signals.twitterTags).length,
        hasHreflang: signals.hreflang.length > 0,
        hasFavicon: signals.hasFavicon,
        hasAnalytics: signals.hasGtag || signals.hasGTM,
        httpLinksFound: signals.httpLinks,
      };
      parsed.signals = signals;
    }

    if (type === "content-analysis" && signals) {
      parsed.wordCount = signals.wordCount;
      if (signals.headingOutline.length) {
        parsed.headingStructure = signals.headingOutline.map(h => ({
          tag: h.tag,
          text: h.text,
          wordCount: h.text.split(/\s+/).length,
          keywordPresent: false,
        }));
      }
    }

    return new Response(JSON.stringify({ success: true, data: parsed, signals }), {
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

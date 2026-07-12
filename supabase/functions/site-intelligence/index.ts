import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Aggregates free/public site intelligence (no API keys required):
//   - RDAP whois (domain age, registrar, expiry)          rdap.org
//   - Mozilla Observatory (security headers grade)         observatory.mozilla.org
//   - robots.txt + sitemap.xml discovery & validation
//   - Live HTTP response headers (HSTS, CSP, X-Frame, cache)
//   - Wayback Machine first-seen snapshot                  archive.org
// All endpoints below are public and unauthenticated.

const TIMEOUT_MS = 8000;

async function fetchJson(url: string, init?: RequestInit) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { ...init, signal: ctrl.signal });
    if (!r.ok) return { ok: false as const, status: r.status, body: await r.text().catch(() => "") };
    const text = await r.text();
    try { return { ok: true as const, status: r.status, json: JSON.parse(text) }; }
    catch { return { ok: true as const, status: r.status, json: null, text }; }
  } catch (e) {
    return { ok: false as const, status: 0, error: e instanceof Error ? e.message : "fetch failed" };
  } finally { clearTimeout(t); }
}

async function fetchText(url: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    return { ok: r.ok, status: r.status, headers: Object.fromEntries(r.headers.entries()), text: await r.text().catch(() => "") };
  } catch (e) {
    return { ok: false, status: 0, headers: {}, text: "", error: e instanceof Error ? e.message : "fetch failed" };
  } finally { clearTimeout(t); }
}

async function fetchHeaders(url: string) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    // Drain body to close connection cleanly
    await r.body?.cancel().catch(() => {});
    return {
      ok: r.ok,
      status: r.status,
      finalUrl: r.url,
      headers: Object.fromEntries(r.headers.entries()),
    };
  } catch (e) {
    return { ok: false, status: 0, finalUrl: url, headers: {} as Record<string, string>, error: e instanceof Error ? e.message : "fetch failed" };
  } finally { clearTimeout(t); }
}

function extractRootDomain(input: string): { host: string; root: string; url: string } {
  let u = input.trim();
  if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
  try {
    const parsed = new URL(u);
    const host = parsed.hostname.replace(/^www\./, "");
    const parts = host.split(".");
    const root = parts.length > 2 ? parts.slice(-2).join(".") : host;
    return { host, root, url: `${parsed.protocol}//${parsed.hostname}` };
  } catch {
    return { host: input, root: input, url: `https://${input}` };
  }
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

// ---------- RDAP whois (free) ----------
async function getWhois(root: string) {
  const r = await fetchJson(`https://rdap.org/domain/${encodeURIComponent(root)}`);
  if (!r.ok || !r.json) return { available: false as const };
  const j = r.json as { events?: { eventAction: string; eventDate: string }[]; entities?: { roles: string[]; vcardArray?: unknown[] }[]; status?: string[]; nameservers?: { ldhName: string }[] };
  const events = j.events ?? [];
  const reg = events.find(e => e.eventAction === "registration");
  const exp = events.find(e => e.eventAction === "expiration");
  const upd = events.find(e => e.eventAction === "last changed");
  const registrar = j.entities?.find(e => e.roles?.includes("registrar"));
  const registrarName = (() => {
    const vc = registrar?.vcardArray as unknown[] | undefined;
    if (!Array.isArray(vc) || vc.length < 2) return null;
    const entries = vc[1] as unknown[];
    if (!Array.isArray(entries)) return null;
    const fn = entries.find((row) => Array.isArray(row) && (row as unknown[])[0] === "fn") as unknown[] | undefined;
    return fn ? (fn[3] as string) : null;
  })();
  const now = new Date();
  const created = reg ? new Date(reg.eventDate) : null;
  const expires = exp ? new Date(exp.eventDate) : null;
  return {
    available: true as const,
    createdAt: created?.toISOString() ?? null,
    expiresAt: expires?.toISOString() ?? null,
    lastUpdatedAt: upd?.eventDate ?? null,
    ageDays: created ? daysBetween(created, now) : null,
    ageYears: created ? +(daysBetween(created, now) / 365.25).toFixed(2) : null,
    daysUntilExpiry: expires ? daysBetween(now, expires) : null,
    registrar: registrarName,
    status: j.status ?? [],
    nameservers: (j.nameservers ?? []).map(n => n.ldhName),
  };
}

// ---------- Mozilla Observatory (free) ----------
async function getObservatory(host: string) {
  const trigger = await fetchJson(`https://http-observatory.security.mozilla.org/api/v1/analyze?host=${encodeURIComponent(host)}`, { method: "POST", body: "hidden=true" });
  if (!trigger.ok || !trigger.json) return { available: false as const };
  const j = trigger.json as { grade?: string; score?: number; tests_passed?: number; tests_failed?: number; tests_quantity?: number; state?: string };
  return {
    available: true as const,
    grade: j.grade ?? null,
    score: typeof j.score === "number" ? j.score : null,
    testsPassed: j.tests_passed ?? null,
    testsFailed: j.tests_failed ?? null,
    testsTotal: j.tests_quantity ?? null,
    state: j.state ?? null,
  };
}

// ---------- robots.txt + sitemap.xml ----------
async function getRobotsAndSitemap(base: string) {
  const robotsRes = await fetchText(`${base}/robots.txt`);
  const robotsFound = robotsRes.ok && robotsRes.text.length > 0 && !/<html/i.test(robotsRes.text);
  const sitemapUrls = robotsFound
    ? [...robotsRes.text.matchAll(/^\s*sitemap:\s*(\S+)/gim)].map(m => m[1].trim())
    : [];
  const hasDisallowAll = robotsFound && /^\s*user-agent:\s*\*[\s\S]*?disallow:\s*\/\s*$/im.test(robotsRes.text);
  const crawlDelayMatch = robotsFound ? robotsRes.text.match(/crawl-delay:\s*(\d+)/i) : null;

  // Try /sitemap.xml if not declared
  let firstSitemap = sitemapUrls[0] ?? `${base}/sitemap.xml`;
  const sitemapRes = await fetchText(firstSitemap);
  const sitemapOk = sitemapRes.ok && /<(urlset|sitemapindex)/i.test(sitemapRes.text);
  const urlCount = sitemapOk ? (sitemapRes.text.match(/<loc>/gi)?.length ?? 0) : 0;
  const isIndex = sitemapOk && /<sitemapindex/i.test(sitemapRes.text);

  return {
    robots: {
      found: robotsFound,
      size: robotsRes.text.length,
      disallowAll: hasDisallowAll,
      declaresSitemap: sitemapUrls.length > 0,
      crawlDelay: crawlDelayMatch ? Number(crawlDelayMatch[1]) : null,
    },
    sitemap: {
      url: firstSitemap,
      found: sitemapOk,
      urlCount,
      isIndex,
      declaredInRobots: sitemapUrls.length > 0,
    },
  };
}

// ---------- HTTP response headers ----------
async function getSecurityHeaders(url: string) {
  const r = await fetchHeaders(url);
  if (!r.ok) return { available: false as const };
  const h = r.headers;
  const has = (k: string) => k.toLowerCase() in Object.fromEntries(Object.entries(h).map(([k, v]) => [k.toLowerCase(), v]));
  const get = (k: string) => Object.entries(h).find(([kk]) => kk.toLowerCase() === k.toLowerCase())?.[1] ?? null;
  const isHttps = r.finalUrl.startsWith("https://");
  const checks = [
    { key: "Strict-Transport-Security", present: has("strict-transport-security"), value: get("strict-transport-security") },
    { key: "Content-Security-Policy", present: has("content-security-policy"), value: get("content-security-policy") },
    { key: "X-Content-Type-Options", present: has("x-content-type-options"), value: get("x-content-type-options") },
    { key: "X-Frame-Options", present: has("x-frame-options"), value: get("x-frame-options") },
    { key: "Referrer-Policy", present: has("referrer-policy"), value: get("referrer-policy") },
    { key: "Permissions-Policy", present: has("permissions-policy"), value: get("permissions-policy") },
  ];
  const passed = checks.filter(c => c.present).length;
  return {
    available: true as const,
    isHttps,
    finalUrl: r.finalUrl,
    server: get("server"),
    poweredBy: get("x-powered-by"),
    contentType: get("content-type"),
    cacheControl: get("cache-control"),
    checks,
    score: Math.round((passed / checks.length) * 100),
  };
}

// ---------- Wayback Machine first snapshot ----------
async function getArchiveHistory(root: string) {
  const r = await fetchJson(
    `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(root)}&limit=1&output=json&from=19960101&fl=timestamp,original`,
  );
  if (!r.ok || !Array.isArray(r.json) || r.json.length < 2) return { available: false as const };
  const [, [ts]] = r.json as [string[], [string, string]];
  const yyyy = ts.slice(0, 4);
  const mm = ts.slice(4, 6);
  const dd = ts.slice(6, 8);
  const firstSeen = new Date(`${yyyy}-${mm}-${dd}T00:00:00Z`);
  return {
    available: true as const,
    firstSeen: firstSeen.toISOString(),
    ageDays: daysBetween(firstSeen, new Date()),
    snapshotUrl: `https://web.archive.org/web/${ts}/${root}`,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ success: false, error: "url is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { host, root, url: base } = extractRootDomain(url);

    const [whois, observatory, robotsSitemap, headers, archive] = await Promise.all([
      getWhois(root).catch(() => ({ available: false as const })),
      getObservatory(host).catch(() => ({ available: false as const })),
      getRobotsAndSitemap(base).catch(() => ({ robots: { found: false }, sitemap: { found: false } })),
      getSecurityHeaders(base).catch(() => ({ available: false as const })),
      getArchiveHistory(root).catch(() => ({ available: false as const })),
    ]);

    return new Response(JSON.stringify({
      success: true,
      data: {
        target: { url: base, host, root },
        whois,
        observatory,
        robots: robotsSitemap.robots,
        sitemap: robotsSitemap.sitemap,
        headers,
        archive,
        fetchedAt: new Date().toISOString(),
      },
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("site-intelligence error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Free keyword expansion via Google Autocomplete (public JSON endpoint, no key).
// Also pulls "related" via Google Suggest with modifier prefixes for long-tail intent.

const TIMEOUT_MS = 6000;
const PREFIXES = ["", "how to ", "best ", "why ", "what is ", "when ", "vs ", "for "];
const SUFFIXES = ["", " tool", " software", " guide", " tutorial", " near me", " services", " pricing"];

async function suggest(q: string, hl = "en", gl = "us"): Promise<string[]> {
  if (!q.trim()) return [];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=${hl}&gl=${gl}&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j?.[1]) ? j[1] as string[] : [];
  } catch { return []; }
  finally { clearTimeout(timer); }
}

function classifyIntent(kw: string): "Informational" | "Commercial" | "Transactional" | "Navigational" {
  const s = kw.toLowerCase();
  if (/\b(buy|price|pricing|cost|order|discount|coupon|deal|cheap|shop)\b/.test(s)) return "Transactional";
  if (/\b(best|top|review|compare|vs|alternative|tool|service|software|agency)\b/.test(s)) return "Commercial";
  if (/\b(login|sign in|dashboard|official|website|app)\b/.test(s)) return "Navigational";
  return "Informational";
}

function estimateDifficulty(kw: string): number {
  const words = kw.split(/\s+/).length;
  const commercial = /\b(best|top|tool|service|software|agency|buy|price|review)\b/i.test(kw);
  let base = 55 - (words - 1) * 8 + (commercial ? 12 : 0);
  base = Math.max(8, Math.min(92, base));
  return Math.round(base);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const { seed, hl = "en", gl = "us", depth = 2 } = await req.json();
    if (!seed || typeof seed !== "string") {
      return new Response(JSON.stringify({ success: false, error: "seed is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const clean = seed.trim().toLowerCase();
    const level1 = await suggest(clean, hl, gl);
    let expanded = new Set<string>([clean, ...level1]);

    // Alphabet expansion: "<seed> a", "<seed> b" ... — Google's classic longtail trick
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const alphaResults = await Promise.all(alphabet.map(l => suggest(`${clean} ${l}`, hl, gl)));
    alphaResults.forEach(list => list.forEach(k => expanded.add(k)));

    // Modifier expansion
    if (depth >= 2) {
      const mods = [
        ...PREFIXES.map(p => `${p}${clean}`.trim()),
        ...SUFFIXES.map(s => `${clean}${s}`.trim()),
      ];
      const modResults = await Promise.all(mods.slice(0, 12).map(m => suggest(m, hl, gl)));
      modResults.forEach(list => list.forEach(k => expanded.add(k)));
    }

    const keywords = [...expanded]
      .filter(k => k.length > 2 && k.length < 100)
      .slice(0, 120)
      .map(keyword => ({
        keyword,
        intent: classifyIntent(keyword),
        difficulty: estimateDifficulty(keyword),
        wordCount: keyword.split(/\s+/).length,
        isQuestion: /^(how|what|why|when|where|who|which|can|does|is|are|will|should)\b/i.test(keyword),
        isLongTail: keyword.split(/\s+/).length >= 4,
      }));

    const questions = keywords.filter(k => k.isQuestion).map(k => k.keyword);
    const longTail = keywords.filter(k => k.isLongTail).map(k => k.keyword);

    return new Response(JSON.stringify({
      success: true,
      data: {
        seed: clean,
        total: keywords.length,
        keywords,
        questions,
        longTail,
        source: "google-autocomplete",
        fetchedAt: new Date().toISOString(),
      },
    }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("keyword-expand error:", msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

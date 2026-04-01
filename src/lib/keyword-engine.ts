/**
 * Deterministic Keyword Research Engine
 * Generates realistic keyword data based on input string analysis.
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

// Keyword intent classification based on word patterns
function classifyIntent(kw: string): "Informational" | "Commercial" | "Transactional" | "Navigational" {
  const lower = kw.toLowerCase();
  if (/buy|price|cost|cheap|deal|discount|order|purchase|shop/.test(lower)) return "Transactional";
  if (/best|top|review|compare|vs|alternative|tool|service|software|agency/.test(lower)) return "Commercial";
  if (/login|sign in|website|official|app/.test(lower)) return "Navigational";
  return "Informational";
}

// Estimate search volume range based on keyword characteristics
function estimateVolume(kw: string, rand: () => number): number {
  const words = kw.split(/\s+/).length;
  // Shorter keywords = higher volume (generally)
  const baseVolume = words === 1 ? 15000 + rand() * 35000
    : words === 2 ? 5000 + rand() * 20000
    : words === 3 ? 1500 + rand() * 8000
    : 300 + rand() * 4000;
  return clamp(Math.round(baseVolume / 100) * 100, 100, 50000);
}

// Difficulty based on keyword competitiveness signals
function estimateDifficulty(kw: string, volume: number, rand: () => number): number {
  const words = kw.split(/\s+/).length;
  const hasCommercial = /tool|service|agency|software|platform|best|top/.test(kw.toLowerCase());
  const base = 20 + (volume / 1000) * 1.2 + (hasCommercial ? 15 : 0) - (words > 3 ? 15 : 0);
  return clamp(base + rand() * 15 - 7, 8, 95);
}

export interface KeywordResult {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  intent: string;
  trend: "up" | "down" | "stable";
  trendData: { month: string; volume: number }[];
}

export interface KeywordResearchResult {
  main: KeywordResult;
  suggestions: KeywordResult[];
  trendData: { month: string; volume: number }[];
  totalOpportunityVolume: number;
  avgDifficulty: number;
  lowCompetitionCount: number;
}

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Keyword modifiers for generating related keywords
const modifiers = [
  { prefix: "", suffix: " tool" },
  { prefix: "best ", suffix: "" },
  { prefix: "", suffix: " strategy" },
  { prefix: "", suffix: " tips" },
  { prefix: "", suffix: " for beginners" },
  { prefix: "", suffix: " services" },
  { prefix: "", suffix: " agency" },
  { prefix: "free ", suffix: "" },
  { prefix: "", suffix: " guide" },
  { prefix: "how to ", suffix: "" },
  { prefix: "", suffix: " examples" },
  { prefix: "", suffix: " checklist" },
  { prefix: "", suffix: " near me" },
  { prefix: "", suffix: " 2024" },
  { prefix: "affordable ", suffix: "" },
];

export function researchKeyword(input: string): KeywordResearchResult {
  const keyword = input.trim().toLowerCase();
  const seed = hashString(keyword);
  const rand = seededRandom(seed);

  const mainVolume = estimateVolume(keyword, rand);
  const mainDifficulty = estimateDifficulty(keyword, mainVolume, rand);
  const mainCpc = +((mainDifficulty / 20) + rand() * 3 + 0.5).toFixed(2);
  const mainIntent = classifyIntent(keyword);

  // Generate trend data — seasonal variation
  const now = new Date();
  const currentMonth = now.getMonth();
  const trendData = Array.from({ length: 12 }, (_, i) => {
    const monthIdx = (currentMonth - 11 + i + 12) % 12;
    const seasonalFactor = 0.85 + Math.sin((monthIdx / 12) * Math.PI * 2 + rand() * 2) * 0.2;
    const trendGrowth = 1 + (i / 12) * (rand() * 0.3 - 0.05);
    return {
      month: months[monthIdx],
      volume: clamp(Math.round(mainVolume * seasonalFactor * trendGrowth / 100) * 100, 100, 80000),
    };
  });

  const mainTrend: "up" | "down" | "stable" = trendData[11].volume > trendData[8].volume * 1.05 ? "up" : trendData[11].volume < trendData[8].volume * 0.95 ? "down" : "stable";

  const main: KeywordResult = {
    keyword,
    volume: mainVolume,
    difficulty: mainDifficulty,
    cpc: mainCpc,
    intent: mainIntent,
    trend: mainTrend,
    trendData,
  };

  // Generate related keywords
  const suggestions: KeywordResult[] = modifiers
    .slice(0, 10 + Math.round(rand() * 5))
    .map(mod => {
      const relKw = `${mod.prefix}${keyword}${mod.suffix}`.trim();
      const relSeed = hashString(relKw);
      const relRand = seededRandom(relSeed);
      const vol = estimateVolume(relKw, relRand);
      const diff = estimateDifficulty(relKw, vol, relRand);
      const cpc = +((diff / 20) + relRand() * 2 + 0.3).toFixed(2);
      const relTrend: "up" | "down" | "stable" = relRand() > 0.6 ? "up" : relRand() > 0.3 ? "stable" : "down";
      return {
        keyword: relKw,
        volume: vol,
        difficulty: diff,
        cpc,
        intent: classifyIntent(relKw),
        trend: relTrend,
        trendData: [],
      };
    })
    .sort((a, b) => b.volume - a.volume);

  const totalOpportunityVolume = suggestions.reduce((sum, s) => sum + s.volume, 0);
  const avgDifficulty = Math.round(suggestions.reduce((sum, s) => sum + s.difficulty, 0) / suggestions.length);
  const lowCompetitionCount = suggestions.filter(s => s.difficulty < 40).length;

  return { main, suggestions, trendData, totalOpportunityVolume, avgDifficulty, lowCompetitionCount };
}

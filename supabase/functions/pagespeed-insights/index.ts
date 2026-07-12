import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Google PageSpeed Insights v5 — public endpoint; API key optional (raises quota).
// Docs: https://developers.google.com/speed/docs/insights/v5/get-started
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url, strategy = 'mobile' } = await req.json();

    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ success: false, error: 'url is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let target = url.trim();
    if (!/^https?:\/\//i.test(target)) target = `https://${target}`;

    const apiKey = Deno.env.get('GOOGLE_PAGESPEED_API_KEY');
    const params = new URLSearchParams({
      url: target,
      strategy: strategy === 'desktop' ? 'desktop' : 'mobile',
    });
    ['performance', 'accessibility', 'best-practices', 'seo'].forEach(c => params.append('category', c));
    if (apiKey) params.set('key', apiKey);

    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`;
    const psiRes = await fetch(psiUrl);
    const psiJson = await psiRes.json();

    if (!psiRes.ok) {
      const errMsg = psiJson?.error?.message || `PageSpeed API failed (${psiRes.status})`;
      const quotaExceeded = psiRes.status === 429 || /quota/i.test(errMsg);
      // Return 200 with success:false so callers can gracefully degrade
      // instead of blank-screening on a 429/5xx from Google.
      return new Response(JSON.stringify({
        success: false,
        quotaExceeded,
        needsApiKey: quotaExceeded && !apiKey,
        error: quotaExceeded
          ? 'Google PageSpeed daily quota exceeded. Add a GOOGLE_PAGESPEED_API_KEY secret to raise limits (25,000/day free).'
          : errMsg,
        upstreamStatus: psiRes.status,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const lr = psiJson.lighthouseResult ?? {};
    const audits = lr.audits ?? {};
    const cats = lr.categories ?? {};

    const num = (a: any) => (typeof a?.numericValue === 'number' ? a.numericValue : null);
    const disp = (a: any) => a?.displayValue ?? null;

    const lcpMs = num(audits['largest-contentful-paint']);
    const fcpMs = num(audits['first-contentful-paint']);
    const ttfbMs = num(audits['server-response-time']);
    const tbtMs = num(audits['total-blocking-time']);
    const cls = num(audits['cumulative-layout-shift']);
    const si = num(audits['speed-index']);
    const inpMs = num(audits['interaction-to-next-paint']) ?? num(audits['experimental-interaction-to-next-paint']);

    const status = (val: number | null, good: number, poor: number, higherIsBetter = false) => {
      if (val === null) return 'unknown';
      if (higherIsBetter) return val >= good ? 'pass' : val >= poor ? 'warning' : 'fail';
      return val <= good ? 'pass' : val <= poor ? 'warning' : 'fail';
    };

    const fmtMs = (v: number | null) => v === null ? '—' : v >= 1000 ? `${(v / 1000).toFixed(2)}s` : `${Math.round(v)}ms`;

    const coreWebVitals = [
      { label: 'Largest Contentful Paint (LCP)', value: disp(audits['largest-contentful-paint']) ?? fmtMs(lcpMs), target: '< 2.5s', status: status(lcpMs, 2500, 4000), numeric: lcpMs },
      { label: 'First Contentful Paint (FCP)', value: disp(audits['first-contentful-paint']) ?? fmtMs(fcpMs), target: '< 1.8s', status: status(fcpMs, 1800, 3000), numeric: fcpMs },
      { label: 'Cumulative Layout Shift (CLS)', value: disp(audits['cumulative-layout-shift']) ?? (cls === null ? '—' : cls.toFixed(3)), target: '< 0.1', status: status(cls, 0.1, 0.25), numeric: cls },
      { label: 'Total Blocking Time (TBT)', value: disp(audits['total-blocking-time']) ?? fmtMs(tbtMs), target: '< 200ms', status: status(tbtMs, 200, 600), numeric: tbtMs },
      { label: 'Time to First Byte (TTFB)', value: disp(audits['server-response-time']) ?? fmtMs(ttfbMs), target: '< 800ms', status: status(ttfbMs, 800, 1800), numeric: ttfbMs },
      { label: 'Speed Index', value: disp(audits['speed-index']) ?? fmtMs(si), target: '< 3.4s', status: status(si, 3400, 5800), numeric: si },
    ];
    if (inpMs !== null) {
      coreWebVitals.push({ label: 'Interaction to Next Paint (INP)', value: fmtMs(inpMs), target: '< 200ms', status: status(inpMs, 200, 500), numeric: inpMs });
    }

    const score = (k: string) => cats[k]?.score != null ? Math.round(cats[k].score * 100) : null;

    return new Response(JSON.stringify({
      success: true,
      data: {
        url: target,
        strategy,
        fetchedAt: new Date().toISOString(),
        scores: {
          performance: score('performance'),
          accessibility: score('accessibility'),
          bestPractices: score('best-practices'),
          seo: score('seo'),
        },
        coreWebVitals,
        loadingExperience: psiJson.loadingExperience ?? null,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('pagespeed-insights error:', msg);
    return new Response(JSON.stringify({ success: false, error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

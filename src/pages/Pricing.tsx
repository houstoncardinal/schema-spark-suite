import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { useAuth, TIERS, type TierKey } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  CheckCircle, ArrowRight, Zap, BarChart3, Shield, Crown,
  Users, Globe, Bot, FileSearch, TrendingUp, Loader2, ExternalLink,
} from "lucide-react";

const tierFeatures: Record<TierKey, { icon: typeof Zap; features: string[]; highlight?: string }> = {
  starter: {
    icon: BarChart3,
    highlight: undefined,
    features: [
      "2 projects",
      "AI SEO audits (50/mo)",
      "Keyword tracking (500 keywords)",
      "Backlink monitoring",
      "Content analyzer",
      "Schema generator",
      "Weekly email reports",
      "Community support",
    ],
  },
  pro: {
    icon: Zap,
    highlight: "Most Popular",
    features: [
      "10 projects",
      "Unlimited AI audits",
      "Keyword tracking (5,000 keywords)",
      "Competitor analysis (10 domains)",
      "Predictive modeling",
      "AI content agents",
      "SERP simulator",
      "Topical authority mapping",
      "Daily email reports",
      "Priority support",
    ],
  },
  enterprise: {
    icon: Crown,
    highlight: "Best Value",
    features: [
      "Unlimited projects",
      "Unlimited everything",
      "White-label reports",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "Custom AI model training",
      "SSO & team management",
      "SLA guarantee",
      "24/7 phone support",
    ],
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "SEOPulse Pricing",
  description: "Choose your SEOPulse plan. AI-powered SEO tools starting at $150/month.",
  url: "https://seopulse.io/pricing",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: 3,
    itemListElement: Object.entries(TIERS).map(([key, tier], i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: `${tier.name} Plan`,
        offers: {
          "@type": "Offer",
          price: tier.price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  },
};

const Pricing = () => {
  const { user, subscription, checkSubscription } = useAuth();
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Subscription activated!", { description: "Welcome aboard! Your plan is now active." });
      checkSubscription();
    } else if (searchParams.get("canceled") === "true") {
      toast.info("Checkout canceled", { description: "No changes were made to your account." });
    }
  }, [searchParams, checkSubscription]);

  const handleCheckout = async (tierKey: TierKey) => {
    if (!user) {
      toast.error("Please sign in first", { description: "You need an account to subscribe." });
      return;
    }

    setLoadingTier(tierKey);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId: TIERS[tierKey].price_id },
      });
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (err: any) {
      toast.error("Checkout failed", { description: err.message });
    } finally {
      setLoadingTier(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch (err: any) {
      toast.error("Portal error", { description: err.message });
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Pricing — AI-Powered SEO Plans | SEOPulse</title>
        <meta name="description" content="Choose your SEOPulse plan. AI-powered SEO tools starting at $150/month. Starter, Pro, and Enterprise plans available." />
        <link rel="canonical" href="https://seopulse.io/pricing" />
        <meta property="og:title" content="Pricing — SEOPulse" />
        <meta property="og:description" content="AI-powered SEO tools starting at $150/month." />
        <meta property="og:url" content="https://seopulse.io/pricing" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(pricingJsonLd)}</script>
      </Helmet>

      <section className="section-padding">
        <div className="container-wide">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <p className="label-overline mb-3">Pricing</p>
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Simple, transparent{" "}
              <span className="font-serif italic gradient-text">pricing</span>
            </h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Start free, upgrade when you're ready. No hidden fees, cancel anytime.
            </p>
          </motion.div>

          {/* Active subscription banner */}
          {subscription.subscribed && subscription.tier && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto mb-10 rounded-2xl border border-accent/20 bg-accent/5 p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">
                  You're on the <span className="text-accent font-semibold">{TIERS[subscription.tier].name}</span> plan
                </p>
                {subscription.subscriptionEnd && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Renews {new Date(subscription.subscriptionEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
              <button onClick={handlePortal} disabled={portalLoading}
                className="btn-secondary text-xs gap-1.5 px-4 py-2">
                {portalLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ExternalLink className="h-3 w-3" />}
                Manage Subscription
              </button>
            </motion.div>
          )}

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-20">
            {(Object.entries(TIERS) as [TierKey, typeof TIERS[TierKey]][]).map(([key, tier], i) => {
              const meta = tierFeatures[key];
              const Icon = meta.icon;
              const isCurrent = subscription.tier === key;
              const isPopular = key === "pro";

              return (
                <motion.div key={key} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`relative surface-card p-6 flex flex-col ${isPopular ? "ring-2 ring-accent/30 shadow-lg" : ""} ${isCurrent ? "ring-2 ring-accent" : ""}`}>
                  
                  {meta.highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent text-accent-foreground px-4 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                      {meta.highlight}
                    </span>
                  )}

                  {isCurrent && (
                    <span className="absolute -top-3 right-4 rounded-full bg-foreground text-background px-3 py-0.5 text-[10px] font-semibold">
                      Your Plan
                    </span>
                  )}

                  <div className="mb-4">
                    <Icon className="h-5 w-5 text-muted-foreground mb-3" />
                    <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
                    <div className="mt-2 flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">${tier.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 mb-6 flex-1">
                    {meta.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {isCurrent ? (
                    <button onClick={handlePortal} disabled={portalLoading}
                      className="btn-secondary w-full gap-2">
                      {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Manage Plan"}
                    </button>
                  ) : (
                    <button onClick={() => handleCheckout(key)} disabled={!!loadingTier}
                      className={`w-full gap-2 ${isPopular ? "btn-primary-gradient" : "btn-primary"}`}>
                      {loadingTier === key ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>Get {tier.name} <ArrowRight className="h-4 w-4" /></>
                      )}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* FAQ / Trust */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-foreground text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { q: "Can I cancel anytime?", a: "Yes. Cancel in one click from your billing portal. No lock-in contracts." },
                { q: "Is there a free trial?", a: "Every account gets free access to basic tools. Upgrade when you need more." },
                { q: "What payment methods?", a: "We accept all major credit cards, Apple Pay, and Google Pay via Stripe." },
                { q: "Can I switch plans?", a: "Upgrade or downgrade anytime. Changes take effect on your next billing cycle." },
                { q: "Do you offer refunds?", a: "Full refund within 14 days if you're not satisfied, no questions asked." },
                { q: "Enterprise custom pricing?", a: "Contact us for custom quotes, volume discounts, and tailored solutions." },
              ].map(({ q, a }) => (
                <div key={q} className="surface-card p-4">
                  <h3 className="text-sm font-semibold text-foreground mb-1">{q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          {!user && (
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-center mt-16">
              <p className="text-muted-foreground mb-4">Ready to get started?</p>
              <Link to="/auth" className="btn-primary-gradient gap-2 text-base px-8 py-4">
                Create Free Account <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;

import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ToolsPreview } from "@/components/home/ToolsPreview";
import { SocialProof } from "@/components/home/SocialProof";
import { CTASection } from "@/components/home/CTASection";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "SEO Cloud Lab",
  url: "https://seocloudlab.io",
  logo: "https://seocloudlab.io/favicon.ico",
  description: "AI-powered SEO intelligence platform with advanced audit tools, keyword research, backlink analysis, and schema markup generation.",
  foundingDate: "2026",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://seocloudlab.io/contact",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "SEO Cloud Lab",
  url: "https://seocloudlab.io",
  description: "AI-Powered SEO Intelligence Platform",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://seocloudlab.io/tools/ai-audit?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SEO Cloud Lab",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://seocloudlab.io",
  description: "Advanced AI-powered SEO audit, keyword research, backlink analysis, and schema markup tools for professionals.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free SEO tools with premium features",
  },
  featureList: "AI SEO Audit, Keyword Research, Backlink Analysis, Schema Generator, Content Analyzer, Market Analysis",
};

const Index = () => {
  return (
    <Layout>
      <Helmet>
        <title>SEO Cloud Lab — AI-Powered SEO Tools, Audit & Strategy</title>
        <meta name="description" content="Analyze, audit, and optimize your website with 200+ ranking factors. Free AI-powered SEO tools including site audits, keyword research, backlink analysis, and schema markup generation." />
        <link rel="canonical" href="https://seocloudlab.io/" />
        <meta property="og:title" content="SEO Cloud Lab — AI-Powered SEO Intelligence Platform" />
        <meta property="og:description" content="Analyze, audit, and optimize your website with 200+ ranking factors. Free AI SEO tools for professionals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://seocloudlab.io/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SEO Cloud Lab — AI-Powered SEO Intelligence Platform" />
        <meta name="twitter:description" content="Free AI-powered SEO audit, keyword research, and optimization tools." />
        <script type="application/ld+json">{JSON.stringify(organizationJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(softwareJsonLd)}</script>
      </Helmet>
      <HeroSection />
      <ToolsPreview />
      <SocialProof />
      <CTASection />
    </Layout>
  );
};

export default Index;

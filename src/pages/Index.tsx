import { Layout } from "@/components/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ToolsPreview } from "@/components/home/ToolsPreview";
import { SocialProof } from "@/components/home/SocialProof";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ToolsPreview />
      <SocialProof />
      <CTASection />
    </Layout>
  );
};

export default Index;

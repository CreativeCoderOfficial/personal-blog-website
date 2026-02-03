// app/page.tsx
import ResourceShowcase from "@/components/homepage/ResourceShowcase";
import AboutSection from "@/components/homepage/AboutSection";
import HeroSection from "@/components/homepage/HeroSection";
import FeatureSection from "@/components/homepage/FeatureSection";
import ConnectSection from "@/components/homepage/ConnectSection";

export default function HomePage() {
  return (
    <>
    <HeroSection/>
    <ResourceShowcase />
    <AboutSection />
    <FeatureSection />
    <ConnectSection />

    </>
  );
}

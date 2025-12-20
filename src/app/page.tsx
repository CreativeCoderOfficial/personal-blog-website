// app/page.tsx
import HeroSection from "@/components/homepage/FeatureSection";
import FeaturesSection from "@/components/homepage/HeroSection";
import ContactSection from "@/components/homepage/ContactSection";
import Hero from "@/components/homepage/HeroSection";
import Features from "@/components/homepage/FeatureSection";
import ResourceShowcase from "@/components/homepage/ResourceShowcase";

export default function HomePage() {
  return (
    <>
    <Hero />
    <ResourceShowcase />
    <Features />

    </>
  );
}

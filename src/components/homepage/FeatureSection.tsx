// src/app/components/Features.tsx
import { BookOpen, Link as LinkIcon, Lightbulb } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      title: "Articles & Blogs",
      description: "Thoughtfully written articles covering topics I'm passionate about.",
      icon: <BookOpen className="w-6 h-6 text-accent-pink" />, // Using pink accent
    },
    {
      title: "Resources",
      description: "Curated collection of tools, links, and materials for learning.",
      icon: <LinkIcon className="w-6 h-6 text-accent-purple" />, // Using purple accent
    },
    {
      title: "Knowledge Sharing",
      description: "Insights and lessons learned from my professional journey.",
      icon: <Lightbulb className="w-6 h-6 text-accent-orange" />, // Using orange accent
    },
  ];

  return (
    <section className="bg-main py-20">
      <div className="container mx-auto px-8">
        
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
          What You'll Find Here
        </h2>

        {/* Grid Layout: 1 column on mobile, 3 on desktop */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="
                p-8 rounded-xl
                bg-card border border-border-subtle
                hover:border-accent-purple/50 transition-colors
                group
              "
            >
              {/* Icon Container */}
              <div className="mb-4 inline-block p-3 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold text-text-primary mb-2">
                {feature.title}
              </h3>
              
              <p className="text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

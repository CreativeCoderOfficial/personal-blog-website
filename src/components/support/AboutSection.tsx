import { Youtube, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutSection() {
  return (
    <div className="h-full flex flex-col justify-center">
      
      {/* 1. Header */}
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
          Fueling the <span className="text-accent-orange">Mission</span>
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed">
          Creating high-quality tutorials and resources takes time, coffee, and server costs. Your support helps me continue.
        </p>
      </div>

      {/* 2. My Mission / Journey */}
      <div className="space-y-6 mb-10 p-6 rounded-2xl bg-card/30 border border-border-subtle">
        <h3 className="text-xl font-bold text-text-primary">My Journey</h3>
        <p className="text-text-secondary leading-relaxed">
          I started this channel with a simple goal: give people the same system that helped me build an elevated mindset.
          It all started when I managed to graduate early from high school completing 2 different exams systems at the same time.
          I realised I had built a consistent framework, set of habits & empowering mindset that made me productive as hell while still enjoying life.
        </p>
        <p className="text-text-secondary leading-relaxed">
          I want you to feel the same & reach your full potential too!
        </p>
      </div>

      {/* 3. Social Links */}
      <div>
        <h3 className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">
          Follow the Journey
        </h3>
        <div className="flex flex-wrap gap-4">
          <SocialLink href="#" icon={<Youtube className="w-5 h-5" />} label="YouTube" />
          <SocialLink href="#" icon={<Twitter className="w-5 h-5" />} label="Twitter" />
          <SocialLink href="#" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
          <SocialLink href="#" icon={<Instagram className="w-5 h-5" />} label="Instagram" />
        </div>
      </div>

    </div>
  );
}

// Helper Component for Social Buttons
function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link 
      href={href}
      className="
        flex items-center gap-2 px-4 py-3 rounded-xl
        bg-main border border-border-subtle text-text-secondary
        hover:text-white hover:border-accent-purple hover:bg-accent-purple/10
        transition-all duration-300
      "
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
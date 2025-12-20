// src/app/components/Hero.tsx
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-main pt-20 pb-32">
      {/* THE GLOW EFFECT 
        - This is an absolute positioned div behind the content.
        - We use your 'accent-purple' and 'accent-pink' tokens.
        - 'blur-[100px]' creates that soft, dispersed look.
      */}
      <div 
        className="
          absolute top-10 -right-20 
          w-[500px] h-[500px] 
          bg-gradient-to-b from-accent-purple/30 to-accent-pink/30 
          rounded-full 
          blur-[100px] 
          pointer-events-none 
          opacity-50
        " 
      />

      <div className="container mx-auto px-8 relative z-10">
        <div className="max-w-2xl">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
            Welcome to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink">
              My Portfolio
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg text-text-secondary max-w-lg">
            Sharing knowledge, resources, and insights through compelling content. 
            Join me on my journey of continuous learning.
          </p>

          {/* Buttons Area */}
          <div className="mt-10 flex flex-wrap gap-4">
            
            {/* Primary Button: Gradient Background */}
            <Link 
              href="/blogs"
              className="
                px-8 py-3 rounded-md font-semibold text-white
                bg-gradient-to-r from-accent-orange to-accent-pink
                hover:opacity-90 transition-opacity
              "
            >
              Read My Blogs
            </Link>

            {/* Secondary Button: Subtle Border */}
            <Link 
              href="/resources"
              className="
                px-8 py-3 rounded-md font-semibold text-text-primary
                border border-border-subtle
                hover:bg-white/5 transition-colors
              "
            >
              Explore Resources
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
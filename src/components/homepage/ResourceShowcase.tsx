import { CheckCircle, ArrowRight, Book } from "lucide-react";

export default function ResourceShowcase() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration: A subtle glow on the left side */}
      <div 
        className="
          absolute -left-20 top-1/2 -translate-y-1/2 
          w-96 h-96 
          bg-accent-purple/10 
          rounded-full blur-[100px] 
          pointer-events-none
        " 
      />

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT SIDE: The "Pop-out" Cover Image */}
          <div className="relative group">
            {/* 1. Decorative border/glow behind the book */}
            <div className="
              absolute inset-0 
              bg-gradient-to-tr from-accent-purple to-accent-pink 
              rounded-xl blur-lg opacity-40 
              group-hover:opacity-60 transition-opacity duration-500
              transform rotate-[-2deg] scale-95
            " />

            {/* 2. The Book Cover Itself */}
            <div className="
              relative 
              aspect-[3/4] w-full max-w-[400px] mx-auto 
              bg-secondary rounded-xl 
              border border-border-subtle
              shadow-2xl shadow-black/50
              flex items-center justify-center
              transform transition-transform duration-500 group-hover:-translate-y-2
            ">
              {/* Placeholder Content */}
              <div className="text-center p-8">
                <Book className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
                <span className="text-text-secondary font-medium tracking-widest uppercase text-sm">
                  Book Cover Art
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Information & Email Capture */}
          <div>
            <span className="text-accent-orange font-bold tracking-wider uppercase text-sm">
              Free Download
            </span>
            
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Mastering Modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink">
                Web Development
              </span>
            </h2>

            <p className="text-text-secondary text-lg mb-8 leading-relaxed">
              Stop wasting time on outdated tutorials. This comprehensive guide covers the essential patterns, tools, and best practices you need to build professional web applications today.
            </p>

            {/* Benefit Bullets */}
            <ul className="space-y-4 mb-10">
              {[
                "Architect scalable React applications",
                "Master Tailwind CSS for rapid styling",
                "Best practices for performance optimization",
                "Includes 5 real-world project examples"
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-accent-purple shrink-0" />
                  <span className="text-text-primary">{item}</span>
                </li>
              ))}
            </ul>

            {/* Email Capture Box */}
            <div className="
              p-6 rounded-xl
              bg-card border border-border-subtle
              backdrop-blur-sm
            ">
              <p className="text-sm text-text-secondary mb-4 font-medium">
                Get your free copy delivered to your inbox:
              </p>
              
              <form className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="
                    flex-1
                    bg-main/50 
                    border border-border-subtle 
                    rounded-lg px-4 py-3
                    text-text-primary placeholder:text-text-secondary/50
                    focus:outline-none focus:border-accent-purple focus:ring-1 focus:ring-accent-purple
                    transition-all
                  "
                />
                <button 
                  type="button" // Change to 'submit' when you add logic
                  className="
                    px-6 py-3 rounded-lg font-bold text-white
                    bg-gradient-to-r from-accent-orange to-accent-pink
                    hover:opacity-90 transition-opacity
                    flex items-center justify-center gap-2 whitespace-nowrap
                  "
                >
                  Get Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
              <p className="text-xs text-text-secondary mt-3 opacity-60">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
import { ArrowRight, Mail, Terminal } from "lucide-react";
import LineMarker from "../ui/LineMarker";

export default function ConnectSection() {
  return (
    <section className="relative bg-main pt-20 pb-32">
      <LineMarker width="short" className="mb-20" />

      <div className="container mx-auto px-8">
        <div className="
          grid md:grid-cols-2 gap-12 lg:gap-20 items-center
          max-w-6xl mx-auto
        ">
          
          {/* LEFT: "What I'm Working On" Card */}
          <div className="order-2 md:order-1 relative group">
            {/* Background Glow */}
            <div className="
              absolute inset-0 
              bg-gradient-to-r from-accent-purple/20 to-accent-orange/20 
              rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
            " />

            <div className="
              relative 
              bg-card border border-border-subtle 
              p-8 rounded-2xl
              backdrop-blur-sm
              hover:border-accent-purple/30 transition-colors
            ">
              {/* Header: Badge & Title */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-accent-purple" />
                  <span className="font-semibold text-text-primary">Current Project</span>
                </div>
                {/* Pulsing "In Progress" Badge */}
                <span className="
                  inline-flex items-center gap-1.5 
                  px-3 py-1 rounded-full 
                  text-xs font-medium text-accent-orange 
                  bg-accent-orange/10 border border-accent-orange/20
                ">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-orange"></span>
                  </span>
                  In Progress
                </span>
              </div>

              {/* Project Details */}
              <h3 className="text-xl font-bold text-text-primary mb-2">
                SaaS Analytics Dashboard
              </h3>
              <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                Building a privacy-first analytics tool for developer blogs. 
                Currently working on the real-time data ingestion pipeline using Next.js and Supabase.
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2">
                {["Next.js", "TypeScript", "Supabase", "Tailwind"].map((tech) => (
                  <span 
                    key={tech} 
                    className="px-2 py-1 text-xs rounded-md bg-white/5 text-text-secondary border border-border-subtle"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>


          {/* RIGHT: The "Work Together" CTA */}
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
              Let's build something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-accent-pink">
                amazing together.
              </span>
            </h2>
            
            <p className="text-text-secondary text-lg mb-8 leading-relaxed max-w-lg">
              Have a question about the ebook? Want to collaborate on a project? 
              Or just want to say hi? My inbox is always open.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Primary Action */}
              <Link 
                href="/contact"
                className="
                  inline-flex items-center justify-center gap-2
                  px-8 py-3 rounded-md font-semibold text-white
                  bg-gradient-to-r from-accent-orange to-accent-pink
                  hover:opacity-90 transition-opacity
                "
              >
                <Mail className="w-4 h-4" />
                Get in Touch
              </Link>

              {/* Secondary Action */}
              <Link 
                href="/projects"
                className="
                  inline-flex items-center justify-center gap-2
                  px-8 py-3 rounded-md font-semibold text-text-primary
                  border border-border-subtle hover:bg-white/5
                  transition-colors
                "
              >
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
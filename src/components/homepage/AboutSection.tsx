import Link from "next/link";
import { Github, Twitter, Linkedin, ArrowRight, Youtube } from "lucide-react";
import LineMarker from "../ui/LineMarker";

export default function AboutSection() {
  return (
    <section id="about" className="relative bg-main">
      {/* 1. The Line Marker (Top Boundary) */}
      <LineMarker />

      <div className="container mx-auto px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* AVATAR WRAPPER */}
          <div className="relative inline-block mb-8">
            {/* The Glow Effect behind avatar */}
            <div className="
              absolute -inset-1 
              bg-gradient-to-br from-accent-orange to-accent-pink 
              rounded-full blur-md opacity-60
            " />
            
            {/* Actual Avatar Image (Use a placeholder for now) */}
            <div className="
              relative 
              w-24 h-24 md:w-32 md:h-32 
              rounded-full 
              bg-secondary border-2 border-main 
              overflow-hidden
            ">
              {/* Replace src with your actual image path later */}
              <img 
                src="/static-media/home-photos/professional-photo-resized.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* TEXT CONTENT */}
          <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Hi, I'm Max. <br className="hidden md:block" />
            <span className="text-text-secondary font-normal">I build things for the web.</span>
          </h3>

          <p className="text-text-secondary text-lg leading-relaxed mb-10">
            I'm a Full Stack Developer passionate about bridging the gap between design and engineering. 
            When I'm not coding, I learn about neuroscience, producitivity & business.
            I then try to write about my journey and share resources to help others level up in life.
          </p>

          {/* SOCIALS & CTA */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">

            <div className="flex gap-4">
              <SocialLink href="https://github.com/CreativeCoderOfficial" icon={<Github className="w-5 h-5" />} label="GitHub" />
              <SocialLink href="https://www.youtube.com/@max_fromthemountain" icon={<Youtube className="w-5 h-5" />} label="YouTube" />
              <SocialLink href="https://www.linkedin.com/in/max-thomas-van-den-berg" icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
            </div>

          </div>
        </div>
      </div>
      
       {/* Optional: Bottom Line Marker if you want to sandwich this section */}
       {/* <LineMarker /> */}
    </section>
  );
}

// Helper component for Social Icons to keep code clean
function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      aria-label={label}
      className="
        p-3 rounded-full 
        text-text-secondary hover:text-white
        hover:bg-white/5 
        transition-colors
      "
    >
      {icon}
    </a>
  );
}
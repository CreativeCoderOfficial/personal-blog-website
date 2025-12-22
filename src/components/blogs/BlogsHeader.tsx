import { ReactNode } from "react";

interface BlogsHeaderProps {
  title: ReactNode; // ReactNode allows us to pass spans/colors in title
  subtitle: string;
}

export default function BlogsHeader({ title, subtitle }: BlogsHeaderProps) {
  return (
    <div className="pt-32 pb-12 relative overflow-hidden">
      {/* Background Glow - Reusable Token Styling */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-orange/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {title}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
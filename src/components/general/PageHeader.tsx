import { ReactNode } from "react";

interface PageHeaderProps {
  // We use ReactNode so you can pass: <>My <span className="text-orange-500">Title</span></>
  title: ReactNode; 
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="pt-32 pb-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-orange/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24 relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
          {title}
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
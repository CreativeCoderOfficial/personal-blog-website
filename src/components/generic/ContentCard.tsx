import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { ReactNode } from "react";

interface ContentCardProps {
  title: string;
  summary: string;
  category: string;
  thumbnailUrl: string;
  date: string;
  href: string;
  buttonText?: string;
  // Generic slot for the top-right badge (e.g., "5 min read" or "PDF")
  metaItem?: ReactNode; 
}

export default function ContentCard({
  title,
  summary,
  category,
  thumbnailUrl,
  date,
  href,
  buttonText = "Read More",
  metaItem,
}: ContentCardProps) {
  
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric"
  });

  return (
    <div className="
      group flex flex-col h-full
      bg-card border border-border-subtle rounded-2xl overflow-hidden
      hover:border-accent-purple/50 hover:shadow-2xl hover:shadow-accent-purple/10
      transition-all duration-300
    ">
      {/* THUMBNAIL */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4">
          <span className="
            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            bg-main/90 backdrop-blur-md border border-accent-purple/30 text-accent-purple
          ">
            {category}
          </span>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 p-6 flex flex-col">
        
        {/* Meta Row: Custom Item + Date */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
          <div className="flex items-center gap-1.5">
            {metaItem}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent-pink" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <Link href={href}>
          <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-accent-purple transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
          {summary}
        </p>

        <div className="pt-4 border-t border-border-subtle mt-auto">
          <Link 
            href={href}
            className="flex items-center gap-2 text-sm font-semibold text-text-primary group-hover:translate-x-1 transition-transform"
          >
            {buttonText}
            <ArrowRight className="w-4 h-4 text-accent-orange" />
          </Link>
        </div>
      </div>
    </div>
  );
}
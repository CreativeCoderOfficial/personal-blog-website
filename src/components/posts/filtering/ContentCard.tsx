import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { ReactNode } from "react";
// Import the shared type!
import { Category } from "@/types/post"; 

interface ContentCardProps {
  title: string;
  summary: string;
  // Use the shared type here
  categories: Category[]; 
  thumbnailUrl: string;
  date: string;
  href: string; 
  buttonText?: string; 
  metaItem?: ReactNode; 
  customFooter?: ReactNode;
}

export default function ContentCard({
  title,
  summary,
  categories = [], 
  thumbnailUrl,
  date,
  href,
  buttonText = "Read More",
  metaItem,
  customFooter, 
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
      {/* THUMBNAIL AREA */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* OVERLAY CATEGORIES */}
        {/* We use flex-wrap so multiple tags sit nicely together */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2 max-w-[90%]">
          {categories.slice(0, 3).map((cat, index) => (
            <span 
              key={index}
              className="
                px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                backdrop-blur-md border shadow-sm
              "
              style={{ 
                // 1. Text is the full color
                color: cat.color,
                // 2. Border is the color with ~30% opacity (4D)
                borderColor: `${cat.color}4D`, 
                // 3. Background is the color with ~10% opacity (1A)
                backgroundColor: `${cat.color}1A` 
              }}
            >
              {cat.name}
            </span>
          ))}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 p-6 flex flex-col">
        
        {/* Meta Row */}
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

        {/* Footer Area */}
        <div className="pt-4 border-t border-border-subtle mt-auto">
          {customFooter ? (
            customFooter
          ) : (
            <Link 
              href={href}
              className="flex items-center gap-2 text-sm font-semibold text-text-primary group-hover:translate-x-1 transition-transform"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4 text-accent-orange" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
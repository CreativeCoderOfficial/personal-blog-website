import Link from "next/link";
import { ExternalLink, Download, Star, Layers } from "lucide-react";

interface ResourceActionBoxProps {
  resourceLink: string | null;
  resourceType: string | null;
  resourceCost: number | null;
  resourceRating: number | null;
}

export default function ResourceActionBox({ 
  resourceLink, 
  resourceType, 
  resourceCost, 
  resourceRating 
}: ResourceActionBoxProps) {
  
  // If there is no link, we don't render anything (or you could render a "Coming Soon" state)
  if (!resourceLink) return null;

  // Format Price: If 0 or null -> "Free", otherwise "$15"
  const priceLabel = !resourceCost ? "Free" : `$${resourceCost}`;

  return (
    <div className="bg-card border border-border-subtle rounded-2xl p-6 shadow-xl flex flex-col gap-4">
      
      {/* 1. Header: Type & Price */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle/50">
        
        {/* Resource Type Badge */}
        {resourceType && (
          <div className="flex items-center gap-1.5 text-accent-orange bg-accent-purple/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>{resourceType}</span>
          </div>
        )}

        {/* Price - Slightly smaller as requested */}
        <div>
            <span>Price: </span>
            <span className="text-md font-bold text-accent-green">
          {priceLabel}
            </span>
        </div>

      </div>

      {/* 2. Rating (Optional) */}
      {resourceRating && (
        <div className="flex items-center gap-1 text-accent-orange text-sm">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < Math.round(resourceRating) ? "fill-current" : "opacity-30"}`} 
              />
            ))}
          </div>
          <span className="text-text-secondary ml-1">({resourceRating})</span>
        </div>
      )}

      {/* 3. Action Button */}
      <Link 
        href={resourceLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
          w-full flex items-center justify-center gap-2 
          bg-accent-purple hover:bg-accent-purple/90 
          text-white font-bold py-3 px-6 rounded-xl 
          transition-all transform hover:scale-[1.02] active:scale-[0.98]
          mt-2
        "
      >
        <Download className="w-5 h-5" />
        <span>Get Resource</span>
        <ExternalLink className="w-4 h-4 opacity-70" />
      </Link>
      
    </div>
  );
}
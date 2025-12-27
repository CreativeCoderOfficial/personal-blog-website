import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";

interface BlogPostHeaderProps {
  title: string;
  categories: string[];
  createdAt: string;
  thumbnailUrl: string;
}

export default function BlogPostHeader({
  title,
  categories,
  createdAt,
  thumbnailUrl,
}: BlogPostHeaderProps) {
  
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div className="mb-10">
      {/* Link back to blogs */}
      <Link 
        href="/blogs"
        className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-orange mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Articles
      </Link>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
        {title}
      </h1>

      {/* Row Div: Date (Left) & Categories (Right) --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        
        {/* Date Section */}
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <Calendar className="w-4 h-4 text-accent-pink" />
          <span>Published on {formattedDate}</span>
        </div>

        {/* Categories Section (Pushed to the right on desktop) (Under date section on mobile) */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span 
              key={cat}
              className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-purple/10 text-accent-purple border border-accent-purple/20"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Main Hero Image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-border-subtle shadow-2xl">
        <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
      </div>
    </div>
  );
}
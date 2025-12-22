import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// This interface matches your Data Model
export interface BlogPostProps {
  id: number;
  slug: string;
  title: string;
  category: string; // Simplification: showing primary category for the card
  summary: string;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
  readingTime: string; // Calculated field
}

export default function BlogCard({ post }: { post: BlogPostProps }) {
  // Helper to format dates nicely
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="
      group flex flex-col h-full
      bg-card border border-border-subtle rounded-2xl overflow-hidden
      hover:border-accent-purple/50 hover:shadow-2xl hover:shadow-accent-purple/10
      transition-all duration-300
    ">
      {/* 1. THUMBNAIL AREA */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.thumbnailUrl} 
          alt={post.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category Badge (Floating top left) */}
        <div className="absolute top-4 left-4">
          <span className="
            px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            bg-main/90 backdrop-blur-md border border-accent-purple/30 text-accent-purple
          ">
            {post.category}
          </span>
        </div>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="flex-1 p-6 flex flex-col">
        
        {/* Meta Row: Reading Time & Created Date */}
        <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-accent-orange" />
            <span>{post.readingTime} read</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent-pink" />
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/blogs/${post.slug}`}>
          <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-2 group-hover:text-accent-purple transition-colors">
            {post.title}
          </h3>
        </Link>

        {/* Summary */}
        <p className="text-text-secondary text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
          {post.summary}
        </p>

        {/* Footer: Updated Date & Action Button */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between mt-auto">
          <div className="text-xs text-text-secondary/60">
            Updated: {formatDate(post.updatedAt)}
          </div>
          
          <Link 
            href={`/blogs/${post.slug}`}
            className="
              flex items-center gap-2 text-sm font-semibold text-text-primary 
              group-hover:translate-x-1 transition-transform
            "
          >
            Read Article
            <ArrowRight className="w-4 h-4 text-accent-orange" />
          </Link>
        </div>

      </div>
    </div>
  );
}
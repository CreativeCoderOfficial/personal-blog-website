"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Clock } from "lucide-react";
// Adjust these imports to match your project structure
import FilterPanel from "@/components/posts/filtering/FilterPanel"; 
import ContentGrid from "@/components/generic/ContentGrid";
import ContentCard from "@/components/generic/ContentCard";
import { BlogPost } from "@/types/post";
import { usePostFetcher } from "@/hooks/usePostFetcher";

interface BlogListProps {
  initialPosts: BlogPost[];
}

// You might want to fetch these from the DB later, but hardcoded is fine for now
const CATEGORIES = [
  "tech", 
  "planning", 
  "productivity", 
  "health", 
  "superpowered-learning", 
  "elevating the mind"
]; 

export default function BlogsContainer({ initialPosts }: BlogListProps) {
  // 1. USE THE HOOK
  // We plug in the "Engine" and get all the tools we need back.
  // Note: We cast initialPosts because our hook uses the generic 'PostItem'
  const { 
    posts, 
    isLoading, 
    hasMore, 
    sentinelRef, 
    filters, 
    setFilters 
  } = usePostFetcher({ 
    initialPosts, 
    type: "BLOG" // <--- The only difference between Blogs and Resources page!
  });

  return (
    <>
      {/* We pass the setters to FilterPanel so it can update our state.
         Note: We removed date filtering for simplicity in this step.
      */}
      <FilterPanel 
        searchPlaceholder="Search articles..."
        filterLabel="Filter by Category"
        filterOptions={CATEGORIES}
        filters={filters}
        setFilters={setFilters}
      />

      <ContentGrid isEmpty={posts.length === 0}>
        {posts.map((post) => (
          <ContentCard 
            key={post.id}
            title={post.title}
            summary={post.summary}
            categories={post.categories} 
            thumbnailUrl={post.thumbnailUrl || ""} // Handle nullable
            date={post.createdAt} // This is already a string
            href={`/blogs/${post.slug}`}
            buttonText="Read Article"
            metaItem={
              <div className="flex items-center gap-1.5 text-accent-orange">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readingTime} min read</span>
              </div>
            }
          />
        ))}
      </ContentGrid>

      {/* The Sentinel: A detailed loading state or invisible spacer */}
      {hasMore && (
        <div ref={sentinelRef} className="mt-16 flex justify-center items-center h-20">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-accent-purple">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Loading more articles...</span>
            </div>
          ) : (
            <div className="h-4 w-full" /> 
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="mt-16 text-center text-text-secondary opacity-60">
          You've reached the end of the list.
        </div>
      )}
    </>
  );
}
"use client";

import { Loader2, Clock } from "lucide-react";
import FilterPanel from "@/components/posts/filtering/FilterPanel"; 
import ContentGrid from "@/components/posts/filtering/ContentGrid";
import ContentCard from "@/components/posts/filtering/ContentCard";
import { BlogPost } from "@/types/post";
import { usePostFetcher } from "@/hooks/usePostFetcher";
import LoadMoreSentinel from "@/components/general/LoadMoreSentinel";

interface BlogListProps {
  initialPosts: BlogPost[];
  categories: string[];
}

export default function BlogsContainer({ initialPosts, categories }: BlogListProps) {
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
      <FilterPanel 
        searchPlaceholder="Search articles..."
        filterLabel="Filter by Category"
        filterOptions={categories}
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

     <LoadMoreSentinel
        hasMore={hasMore}
        isLoading={isLoading}
        sentinelRef={sentinelRef}
      />
    </>
  );
}
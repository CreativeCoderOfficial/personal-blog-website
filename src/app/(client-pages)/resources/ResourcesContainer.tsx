"use client";

import { usePostFetcher } from "@/hooks/usePostFetcher";
import { ResourcePost } from "@/types/post"; // Import the specific type
import FilterPanel from "@/components/posts/filtering/FilterPanel"; 
import ContentGrid from "@/components/posts/filtering/ContentGrid";
import ContentCard from "@/components/posts/filtering/ContentCard";
import { Loader2, Download, Layers } from "lucide-react";


interface ResourcesContainerProps {
  initialPosts: ResourcePost[];
  categories: string[]; 
  resourceTypes: string[];      
}

export default function ResourcesContainer({ initialPosts, categories,resourceTypes }: ResourcesContainerProps) {
  
  // 1. PLUG IN THE ENGINE
  const { 
    posts, isLoading, hasMore, sentinelRef, 
    filters, setFilters 
  } = usePostFetcher({ 
    initialPosts, 
    type: "RESOURCE" 
  });

  return (
    <div className="w-full">
      
      {/* 2. CONFIGURE FILTER PANEL */}
      <FilterPanel 
        // Search & Layout
        searchPlaceholder="Search tools & templates..."
        
        // Category Config
        filterLabel="Filter by Topic"
        filterOptions={categories}
        
        // Resource Type Config 
        resourceTypeLabel="Filter by File Type"
        resourceTypeOptions={resourceTypes} // ["Video", "E-Book", etc.]

        filters={filters}
        setFilters={setFilters}
      />

      {/* 3. RENDER GRID */}
      <ContentGrid isEmpty={posts.length === 0}>
        {posts.map((post) => {
          // We cast to ResourcePost to access resource-specific fields safely
          const resource = post as ResourcePost;
          
          return (
            <ContentCard 
              key={resource.id}
              title={resource.title}
              summary={resource.summary}
              categories={resource.categories} 
              thumbnailUrl={resource.thumbnailUrl || ""}
              date={resource.createdAt}
              href={`/resources/${resource.slug}`} // Different URL for resources
              
              buttonText="View Resource"
              
              // Custom Meta: Show the Resource Type Name (e.g. "Video")
              metaItem={
                <div className="flex items-center gap-1.5 text-accent-orange">
                  {/* Using Layers icon or similar for type */}
                  <Layers className="w-3.5 h-3.5" /> 
                  <span className="capitalize">
                    {resource.resourceType?.name || "Resource"}
                  </span>
                </div>
              }
            />
          );
        })}
      </ContentGrid>

      {/* The Sentinel: A detailed loading state or invisible spacer */}
      {hasMore && (
        <div ref={sentinelRef} className="mt-16 flex justify-center items-center h-20">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2 text-accent-purple">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Loading more resources...</span>
            </div>
          ) : (
            <div className="h-4 w-full" /> 
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <div className="mt-16 text-center text-text-secondary opacity-60">
          End of results.
        </div>
      )}
    </div>
  );
}
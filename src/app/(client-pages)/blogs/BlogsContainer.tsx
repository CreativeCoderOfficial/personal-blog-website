"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Clock } from "lucide-react";
// Adjust these imports to match your project structure
import FilterPanel from "@/components/generic/FilterPanel"; 
import ContentGrid from "@/components/generic/ContentGrid";
import ContentCard from "@/components/generic/ContentCard";
import { BlogPost } from "@/types/post";

interface BlogListProps {
  initialPosts: BlogPost[];
}

// You might want to fetch these from the DB later, but hardcoded is fine for now
const CATEGORIES = ["Technology", "Productivity", "Planning", "Health", "Superpowered-Learning"];

export default function BlogList({ initialPosts }: BlogListProps) {
  // --- STATE ---
  // We initialize the list with the data passed from the Server Component
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  
  // Pagination & Loading State
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Ref for the "Infinite Scroll" element at the bottom
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- HELPER FUNCTION: Fetch Data ---
  // We use useCallback so this function doesn't change on every render
  const fetchPosts = useCallback(async (pageParam: number, isNewSearch: boolean) => {
    setIsLoading(true);
    try {
      // 1. Build the URL with all current filters
      const params = new URLSearchParams();
      params.set("type", "BLOG"); // Hardcoded for this page
      params.set("page", pageParam.toString());
      params.set("limit", "6");
      
      if (searchTerm) params.set("search", searchTerm);
      if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));

      // 2. Make the request to our new Universal API Endpoint
      const response = await fetch(`/api/posts?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch");
      
      const newPosts: BlogPost[] = await response.json();

      // 3. Update State
      if (isNewSearch) {
        // If searching/filtering, we REPLACE the whole list
        setPosts(newPosts);
        // If we got fewer than 6 posts, we know we are at the end
        setHasMore(newPosts.length >= 6); 
      } else {
        // If loading more, we APPEND to the existing list
        setPosts((prev) => [...prev, ...newPosts]);
        if (newPosts.length < 6) setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategories]); // Re-create this function if filters change

  // --- EFFECT 1: Handle Filter Changes ---
  // Triggers when user types or selects a category
  useEffect(() => {
    // Avoid double-fetching on initial load (since initialPosts are already there)
    const isInitialLoad = page === 1 && searchTerm === "" && selectedCategories.length === 0;     // this is a boolean that checks this
    if (isInitialLoad) return;

    setPage(1); // Reset page count
    setHasMore(true); // Assume there might be results
    fetchPosts(1, true); // Fetch page 1, isNewSearch = true
  }, [searchTerm, selectedCategories, fetchPosts]);


  // --- EFFECT 2: Handle "Load More" (Infinite Scroll) ---
  // Triggers when `page` increments (via the IntersectionObserver below)
  useEffect(() => {
    if (page === 1) return; // Page 1 is handled by initial load or Filter Effect
    fetchPosts(page, false); // Fetch next page, isNewSearch = false
  }, [page, fetchPosts]);


  // --- EFFECT 3: The Intersection Observer ---
  // Watches the bottom of the screen to trigger "Load More"
  useEffect(() => {
    // this safeguards make sure we don't increment the page if we're already loading / fetching the next posts
    // or if we already ran out of posts (!hasMore)
    if (isLoading || !hasMore) return; 

    // This is a standard Browser API that aks the browser to "notify use" when an event happens
    const observer = new IntersectionObserver((entries) => {
      // Since we are only watching one item (the sentinel div), we grab the first (and only) entry in the list.
      
      // If the "sentinel" div comes into view (aka the element is now intersecting the screen):
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1); // ...increment page number  ==> this will trigger the FetchData
      }
    }, { threshold: 0.1 }); // only triggers when the div is at least 10% in view

    if (sentinelRef.current) observer.observe(sentinelRef.current); //  connect the observer to our Sentinel Div
    return () => observer.disconnect(); // closes the observer for when we for instance switch pages
  }, [isLoading, hasMore]);


  return (
    <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24">
      {/* We pass the setters to FilterPanel so it can update our state.
         Note: We removed date filtering for simplicity in this step.
      */}
      <FilterPanel 
        searchPlaceholder="Search articles..."
        filterLabel="Filter by Category"
        filterOptions={CATEGORIES}
        selectedOptions={selectedCategories}
        setSelectedOptions={setSelectedCategories}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ContentGrid isEmpty={posts.length === 0}>
        {posts.map((post) => (
          <ContentCard 
            key={post.id}
            title={post.title}
            summary={post.summary}
            category={post.categories[0]?.name || "Uncategorized"} 
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
    </div>
  );
}
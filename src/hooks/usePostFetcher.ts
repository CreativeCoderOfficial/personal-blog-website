import { useState, useEffect, useRef, useCallback } from "react";
import { PostItem } from "@/types/post";
import { PostType } from "@prisma/client"; 
import { PostFilters } from "@/types/filters";

// 1. Define the Input Arguments
interface UsePostFetcherProps {
  initialPosts: PostItem[];
  // "ALL" fetches both blogs and resources — used by the admin dashboard.
  // When "ALL" is passed, no type param is sent to the API.
  type: PostType | "ALL";
  // "PUBLISHED" is the default for public pages.
  // "ALL" fetches drafts too — requires admin session on the API side.
  status?: "PUBLISHED" | "ALL";
  // How many posts to fetch per page. Public pages use 6, admin uses 12.
  limit?: number
}

// 2. Define the Hooks Function
export function usePostFetcher({ 
  initialPosts, 
  type,   
  // default values for optional args
  status = "PUBLISHED",
  limit = 6,
}: UsePostFetcherProps) {
  
    // Loading State & page index
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Unified Filters State
  // Instead of 5 separate useStates, we group them in one object.
  const [filters, setFilters] = useState<PostFilters>({
    search: "",
    categories: [],
    dateFrom: "",
    dateTo: "",
    resourceType: [], 
  });

  
  // Ref for the "Infinite Scroll" element at the bottom
  const sentinelRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // --- Fetch Function ---
  const fetchPosts = useCallback(async (pageParam: number, isNewSearch: boolean) => {
    setIsLoading(true);
    try {
      // 1. Build the URL Query 
      const params = new URLSearchParams();


      params.set("type", type); 
      params.set("page", pageParam.toString());
      params.set("limit", limit.toString());
      params.set("status", status);
      
      // Append filters if they exist
      if (filters.search) params.set("search", filters.search);
      if (filters.categories.length > 0) params.set("categories", filters.categories.join(","));
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);
      // Handle Resource Type
      if (filters.resourceType.length > 0) params.set("resourceType", filters.resourceType.join(","));

      // 2. Make the request to the API Endpoint
      const response = await fetch(`/api/posts?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch");
      
      const newPosts: PostItem[] = await response.json();

      // 3. Update State
      if (isNewSearch) {
        // If searching/filtering, we REPLACE the whole list
        setPosts(newPosts);
        // If we got fewer than 6 posts, we know we are at the end
        setHasMore(newPosts.length >= limit); 
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
  }, [type, status, limit, filters]); // Re-create this function only if any of these components change

  // --- EFFECT 1: Handle Filter Changes ---
  // Triggers when user types or selects a category
  useEffect(() => {
    // Avoid double-fetching on initial load (since initialPosts are already there)
    if (isFirstRender.current) {
      isFirstRender.current = false; // Mark the first render as done
      return; // avoid refetching
    }

    setPage(1); 
    setHasMore(true);
    fetchPosts(1, true); // Fetch Page 1, Replace List
  }, [filters, fetchPosts]);

  // --- EFFECT 2: Handle "Load More" ---
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


  // 3. Return the "Controls"
  // We return everything the UI needs to display and control the logic.
  return {
    posts,
    isLoading,
    hasMore,
    sentinelRef,
    filters,
    setFilters,
    setPosts,
  };
}
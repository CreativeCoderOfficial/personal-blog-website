"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react"; // Import a spinner icon
import PageHeader from "@/components/blogs/BlogsHeader";
import BlogFilterBar from "@/components/blogs/BlogFilterBar";
import BlogGrid from "@/components/blogs/BlogGrid";
import { BlogPostProps } from "@/components/blogs/BlogCard";

// --- 1. MOCK DATA GENERATOR ---
// We generate 50 posts to simulate a database.
const generateMockPosts = (): BlogPostProps[] => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    slug: `post-${i}`,
    title: `Mock Post Title ${i + 1}: The Future of Tech`,
    category: i % 2 === 0 ? "Technology" : "Productivity", // Alternate categories
    summary: "This is a simulated summary to test the infinite scroll functionality. It represents the content that would usually come from a CMS.",
    thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=80`, // Random-ish images
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime: `${5 + (i % 5)} min`
  }));
};

// Initialize the data once (outside component to avoid regeneration on render)
const ALL_MOCK_POSTS = generateMockPosts();
const CATEGORIES = ["Technology", "Artificial Intelligence", "Content Creation", "Productivity"];
const POSTS_PER_PAGE = 6; // How many posts to load at a time

export default function BlogsPage() {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // We keep the date states for UI consistency, though logic comes later
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // --- INFINITE SCROLL STATE ---
  const [page, setPage] = useState(1); // Track which "chunk" of data we are on
  const [isLoading, setIsLoading] = useState(false); // Visual loading state

  // --- REF FOR THE SENTINEL ---
  // This ref is attached to the invisible element at the bottom of the page
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- FILTERING LOGIC (Simulated Backend Query) ---
  // In a real app, this filtering would happen on the server.
  // Here, we filter the FULL dataset first.
  const filteredTotalPosts = ALL_MOCK_POSTS.filter((post) => {
    // 1. Search Logic
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Category Logic
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.category);
    
    // 3. Date Range Logic 
    const postDate = new Date(post.createdAt).getTime();
    // Check "From" Date
    const matchesFrom = dateFrom ? postDate >= new Date(dateFrom).getTime() : true; 
    // Check "Until" Date
    const matchesTo = dateTo ? postDate <= new Date(dateTo).getTime() : true;

    return matchesSearch && matchesCategory && matchesFrom && matchesTo;
  });

  // --- PAGINATION LOGIC (The "Slice") ---
  // We only display a slice of the filtered posts based on the current page.
  // e.g., Page 1 = posts 0-6. Page 2 = posts 0-12.
  const visiblePosts = filteredTotalPosts.slice(0, page * POSTS_PER_PAGE);

  // Check if there are more posts to load (to decide if we show the loader)
  const hasMoreData = visiblePosts.length < filteredTotalPosts.length;

  // --- EFFECT: HANDLE SCROLL INTERSECTION ---
  useEffect(() => {
    // If we are already loading or there is no more data, do nothing.
    if (isLoading || !hasMoreData) return;

    // Create the observer
    const observer = new IntersectionObserver((entries) => {
      // entries[0] is our sentinel div
      if (entries[0].isIntersecting) {
        
        // 1. Set loading state to true
        setIsLoading(true);

        // 2. Simulate Network Delay (e.g., 1 second)
        setTimeout(() => {
          // 3. Increment the page number
          // This causes a re-render, increasing the slice index in 'visiblePosts'
          setPage((prevPage) => prevPage + 1);
          
          // 4. Stop loading
          setIsLoading(false);
        }, 1000); 
      }
    }, {
      root: null, // Watch the viewport
      rootMargin: "100px", // Trigger the load 100px BEFORE the user hits the bottom
      threshold: 0.1 // Trigger when 10% of the sentinel is visible
    });

    // Attach observer to the sentinel
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    // Cleanup: Disconnect observer when component unmounts or dependencies change
    return () => {
      if (sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [isLoading, hasMoreData]); // Re-run effect if loading state or data availability changes

  return (
    <main className="min-h-screen bg-main">
      <PageHeader 
        title={<>Blog <span className="text-accent-orange">Posts</span></>}
        subtitle="Insights, tutorials, and thoughts on technology."
      />

      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24 pb-24">
         <BlogFilterBar 
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            setSelectedCategories={(cats) => {
              // Reset page to 1 when filters change! Important UX detail.
              setSelectedCategories(cats);
              setPage(1); 
            }}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            searchTerm={searchTerm}
            setSearchTerm={(term) => {
              // Reset page to 1 when search changes!
              setSearchTerm(term);
              setPage(1);
            }}
         />

         {/* Render the Grid with only the VISIBLE slice of data */}
         <BlogGrid posts={visiblePosts} />

         {/* --- SENTINEL & LOADING INDICATOR --- */}
         {/* We only show this section if we actually have more data to load */}
         {hasMoreData && (
           <div 
             ref={sentinelRef} 
             className="mt-16 flex justify-center items-center h-20"
           >
             {isLoading ? (
               <div className="flex flex-col items-center gap-2 text-accent-purple">
                 <Loader2 className="w-8 h-8 animate-spin" />
                 <span className="text-sm font-medium">Loading more articles...</span>
               </div>
             ) : (
               /* Invisible spacer to trigger the observer */
               <div className="h-4 w-full" />
             )}
           </div>
         )}
         
         {/* Optional: "End of Results" message */}
         {!hasMoreData && visiblePosts.length > 0 && (
           <div className="mt-16 text-center text-text-secondary opacity-60">
             You've reached the end of the list.
           </div>
         )}
      </div>

    </main>
  );
}
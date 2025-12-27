"use client";

import { useState, useEffect, useRef } from "react";
import { Loader2, Clock } from "lucide-react";
import PageHeader from "@/components/general/PageHeader";
// FIX 1: Import it simply as FilterPanel so the names match
import FilterPanel from "@/components/generic/FilterPanel"; 
import ContentGrid from "@/components/generic/ContentGrid";
// FIX 2: Double check this path. Based on your screenshot, it was in 'ui', not 'generic'
import ContentCard from "@/components/generic/ContentCard";        

interface MockPost {
  id: number;
  slug: string;
  title: string;
  category: string;
  summary: string;
  thumbnailUrl: string;
  createdAt: string;
  readingTime: string;
}

const generateMockPosts = (): MockPost[] => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    slug: `post-${i}`,
    title: `Mock Post Title ${i + 1}: The Future of Tech`,
    category: i % 2 === 0 ? "Technology" : "Productivity",
    summary: "This is a simulated summary to test the infinite scroll functionality.",
    thumbnailUrl: `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&w=800&q=80`,
    createdAt: new Date().toISOString(),
    readingTime: `${5 + (i % 5)} min read`
  }));
};

const ALL_MOCK_POSTS = generateMockPosts();
const CATEGORIES = ["Technology", "Artificial Intelligence", "Content Creation", "Productivity"];
const POSTS_PER_PAGE = 6;

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Infinite Scroll State
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredTotalPosts = ALL_MOCK_POSTS.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          post.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(post.category);
    const postDate = new Date(post.createdAt).getTime();
    const matchesFrom = dateFrom ? postDate >= new Date(dateFrom).getTime() : true; 
    const matchesTo = dateTo ? postDate <= new Date(dateTo).getTime() : true;

    return matchesSearch && matchesCategory && matchesFrom && matchesTo;
  });

  const visiblePosts = filteredTotalPosts.slice(0, page * POSTS_PER_PAGE);
  const hasMoreData = visiblePosts.length < filteredTotalPosts.length;

  useEffect(() => {
    if (isLoading || !hasMoreData) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsLoading(true);
        setTimeout(() => {
          setPage((prevPage) => prevPage + 1);
          setIsLoading(false);
        }, 1000); 
      }
    }, { root: null, rootMargin: "100px", threshold: 0.1 });

    if (sentinelRef.current) observer.observe(sentinelRef.current);
    return () => { if (sentinelRef.current) observer.unobserve(sentinelRef.current); };
  }, [isLoading, hasMoreData]);

  return (
    <main className="min-h-screen bg-main">
      <PageHeader 
        title={<>Blog <span className="text-accent-orange">Posts</span></>}
        subtitle="Insights, tutorials, and thoughts on technology."
      />

      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24">
        <FilterPanel 
          searchPlaceholder="Search articles..."
          filterLabel="Filter by Category"
          filterOptions={CATEGORIES}
          selectedOptions={selectedCategories}
          setSelectedOptions={(opts) => { setSelectedCategories(opts); setPage(1); }}
          searchTerm={searchTerm}
          setSearchTerm={(term) => { setSearchTerm(term); setPage(1); }}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

         <ContentGrid isEmpty={visiblePosts.length === 0}>
            {visiblePosts.map((post) => (
              <ContentCard 
                key={post.id}
                title={post.title}
                summary={post.summary}
                category={post.category}
                thumbnailUrl={post.thumbnailUrl}
                date={post.createdAt}
                href={`/blogs/${post.slug}`}
                buttonText="Read Article"
                metaItem={
                  <div className="flex items-center gap-1.5 text-accent-orange">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readingTime}</span>
                  </div>
                }
              />
            ))}
         </ContentGrid>

         {/* Loading more resources dynamically */}
         {hasMoreData && (
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
         
         {!hasMoreData && visiblePosts.length > 0 && (
           <div className="mt-16 text-center text-text-secondary opacity-60">
             You've reached the end of the list.
           </div>
         )}
      </div>
    </main>
  );
}
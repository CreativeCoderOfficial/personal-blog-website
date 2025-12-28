"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Loader2 } from "lucide-react"; 
import PageHeader from "@/components/general/PageHeader";
import FilterPanel from "@/components/generic/FilterPanel";
import ContentGrid from "@/components/generic/ContentGrid";
import ContentCard from "@/components/generic/ContentCard"; 

// --- 1. MOCK DATA GENERATOR ---
const generateMockResources = () => {
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    slug: `resource-${i}`,
    title: `Ultimate Resource Pack ${i + 1}`,
    category: i % 2 === 0 ? "Templates" : "Tools",
    summary: "Download this comprehensive pack including setup files, config templates, and best practice guides.",
    thumbnailUrl: `https://images.unsplash.com/photo-${1550000000000 + i}?auto=format&fit=crop&w=800&q=80`,
    createdAt: new Date().toISOString(),
    fileSize: "24 MB",
    fileType: "ZIP"
  }));
};

const ALL_RESOURCES = generateMockResources();
const RESOURCE_TYPES = ["Templates", "Tools", "Cheatsheets", "Config"];
const POSTS_PER_PAGE = 6;

export default function ResourcesPage() {
  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // --- INFINITE SCROLL STATE ---
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // --- FILTER LOGIC ---
  const filteredTotalResources = ALL_RESOURCES.filter((res) => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(res.category);
    
    // Optional: Date logic for resources
    const postDate = new Date(res.createdAt).getTime();
    const matchesFrom = dateFrom ? postDate >= new Date(dateFrom).getTime() : true; 
    const matchesTo = dateTo ? postDate <= new Date(dateTo).getTime() : true;

    return matchesSearch && matchesCategory && matchesFrom && matchesTo;
  });

  // --- PAGINATION LOGIC ---
  const visibleResources = filteredTotalResources.slice(0, page * POSTS_PER_PAGE);
  const hasMoreData = visibleResources.length < filteredTotalResources.length;

  // --- EFFECT: SCROLL OBSERVER ---
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
        title={<>Explore <span className="text-accent-orange">Resources</span></>}
        subtitle="Curated tools and templates."
      />

      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24">
         
         <FilterPanel 
            searchPlaceholder="Search resources..."
            filterLabel="Filter by File Type"
            filterOptions={RESOURCE_TYPES}
            selectedOptions={selectedCategories}
            setSelectedOptions={(opts) => { setSelectedCategories(opts); setPage(1); }}
            searchTerm={searchTerm}
            setSearchTerm={(term) => { setSearchTerm(term); setPage(1); }}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
         />

         <ContentGrid isEmpty={visibleResources.length === 0}>
            {visibleResources.map((res) => (
              <ContentCard 
                key={res.id}
                title={res.title}
                summary={res.summary}
                category={res.category}
                thumbnailUrl={res.thumbnailUrl}
                date={res.createdAt}
                href={`/resources/${res.slug}`}
                buttonText="View Resource"
                metaItem={
                  <div className="flex items-center gap-1.5 text-accent-orange">
                    <Download className="w-3.5 h-3.5" />
                    <span>{res.fileSize}</span>
                  </div>
                }
              />
            ))}
         </ContentGrid>

         {/* Sentinel */}
         {hasMoreData && (
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
         
         {!hasMoreData && visibleResources.length > 0 && (
           <div className="mt-16 text-center text-text-secondary opacity-60">
             End of results.
           </div>
         )}
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { FileText, Download, Edit3, Trash2, Clock } from "lucide-react";
import Link from "next/link";

// Components
import AdminHeader from "@/components/admin/AdminHeader";
import FilterPanel from "@/components/generic/FilterPanel";
import ContentGrid from "@/components/generic/ContentGrid";
import ContentCard from "@/components/generic/ContentCard";

// --- MOCK MIXED DATA ---
const MOCK_CONTENT = Array.from({ length: 12 }).map((_, i) => {
  const isBlog = i % 2 === 0;
  return {
    id: i,
    type: isBlog ? "blog" : "resource", // Discriminator
    slug: isBlog ? `blog-post-${i}` : `resource-${i}`,
    title: isBlog ? `The Future of Next.js ${i}` : `Ultimate VS Code Setup ${i}`,
    category: isBlog ? "Technology" : "Tools",
    summary: "Managing content has never been easier with this custom dashboard setup.",
    thumbnailUrl: `https://images.unsplash.com/photo-${1600000000000 + i}?auto=format&fit=crop&w=800&q=80`,
    createdAt: new Date().toISOString(),
    // Specifics
    readingTime: isBlog ? "5 min read" : undefined,
    fileSize: !isBlog ? "12 MB" : undefined,
  };
});

const ALL_CATEGORIES = ["Technology", "Tools", "Productivity", "Templates"];

export default function AdminDashboard() {
  // --- STATE ---
  const [contentType, setContentType] = useState<"all" | "blog" | "resource">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // keeping dates for interface compliance
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // --- FILTER LOGIC ---
  const filteredContent = MOCK_CONTENT.filter((item) => {
    // 1. Type Filter (Blog vs Resource)
    const matchesType = contentType === "all" || item.type === contentType;

    // 2. Search Filter
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());

    // 3. Category Filter
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);

    return matchesType && matchesSearch && matchesCategory;
  });

  // --- HANDLERS ---
  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      console.log("Deleting item", id);
      // In real app: call API, then re-fetch data
    }
  };

  return (
    <main className="min-h-screen bg-main text-text-primary p-6 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. Header with Create Button */}
        <AdminHeader />

        {/* 2. Content Type Toggles (Segmented Control) */}
        <div className="mb-8 flex gap-4">
           {/* You could extract this into a component, but it's small enough to live here */}
           <TypeButton 
             active={contentType === "all"} 
             onClick={() => setContentType("all")} 
             label="All Content" 
             count={MOCK_CONTENT.length}
           />
           <TypeButton 
             active={contentType === "blog"} 
             onClick={() => setContentType("blog")} 
             label="Blogs" 
             icon={<FileText className="w-4 h-4" />} 
           />
           <TypeButton 
             active={contentType === "resource"} 
             onClick={() => setContentType("resource")} 
             label="Resources" 
             icon={<Download className="w-4 h-4" />} 
           />
        </div>

        {/* 3. Filter Panel (Reused) */}
        <FilterPanel 
          searchPlaceholder="Search title..."
          filterLabel="Filter by Category"
          filterOptions={ALL_CATEGORIES}
          selectedOptions={selectedCategories}
          setSelectedOptions={setSelectedCategories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
        />

        {/* 4. Grid Display */}
        <ContentGrid isEmpty={filteredContent.length === 0}>
          {filteredContent.map((item) => (
            <ContentCard 
              key={item.id}
              title={item.title}
              summary={item.summary}
              category={item.category}
              thumbnailUrl={item.thumbnailUrl}
              date={item.createdAt}
              href={`/admin/edit/${item.id}`} // Clicking title goes to Edit
              
              // META ICON: Switches based on type
              metaItem={
                item.type === "blog" ? (
                   <div className="flex items-center gap-1.5 text-accent-orange">
                     <Clock className="w-3.5 h-3.5" />
                     <span>{item.readingTime}</span>
                   </div>
                ) : (
                   <div className="flex items-center gap-1.5 text-accent-purple">
                     <Download className="w-3.5 h-3.5" />
                     <span>{item.fileSize}</span>
                   </div>
                )
              }

              // CUSTOM ADMIN ACTIONS FOOTER
              customFooter={
                <div className="flex items-center justify-between gap-3">
                   {/* Edit Button */}
                   <Link 
                     href={`/admin/edit/${item.id}`}
                     className="flex-1 py-2 rounded-lg bg-main border border-border-subtle hover:bg-white/5 hover:border-text-secondary transition-all flex items-center justify-center gap-2 text-sm font-bold text-text-secondary hover:text-white"
                   >
                     <Edit3 className="w-4 h-4" />
                     Edit
                   </Link>

                   {/* Delete Button */}
                   <button 
                     onClick={() => handleDelete(item.id)}
                     className="px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 text-red-400 transition-all"
                     aria-label="Delete"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                </div>
              }
            />
          ))}
        </ContentGrid>

      </div>
    </main>
  );
}

// --- Helper Component for the Type Toggles ---
function TypeButton({ active, onClick, label, icon, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all
        ${active 
          ? "bg-text-primary text-main shadow-lg" 
          : "bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-secondary"
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && <span className="opacity-60 text-xs ml-1">({count})</span>}
    </button>
  );
}
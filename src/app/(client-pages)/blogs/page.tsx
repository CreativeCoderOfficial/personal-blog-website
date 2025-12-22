"use client";

import { useState } from "react";
import PageHeader from "@/components/blogs/BlogsHeader";
import BlogFilterBar from "@/components/blogs/BlogFilterBar";
import BlogGrid from "@/components/blogs/BlogGrid";
import { BlogPostProps } from "@/components/blogs/BlogCard";

// ... (Keep your MOCK DATA and CONSTANTS the same as before) ...
const CATEGORIES = ["Technology", "Artificial Intelligence", "Content Creation", "Productivity"];
const ALL_POSTS: BlogPostProps[] = [{
    id: 1,
    slug: "getting-started-web-dev",
    title: "Getting Started with Web Development",
    category: "Technology",
    summary: "A comprehensive guide to starting your journey in web development, covering HTML, CSS, and modern JavaScript frameworks.",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-20T14:30:00Z",
    readingTime: "8 min"
  },
  {
    id: 2,
    slug: "future-of-ai",
    title: "The Future of AI in Software Engineering",
    category: "Artificial Intelligence",
    summary: "Exploring the latest trends in AI and how large language models are reshaping the way we write and maintain code.",
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-02-20T09:00:00Z",
    updatedAt: "2024-02-25T11:00:00Z",
    readingTime: "12 min"
  },
  {
    id: 3,
    slug: "mastering-video-production",
    title: "Mastering Video Production for Content Creators",
    category: "Content Creation",
    summary: "Professional tips for lighting, sound design, and editing to create engaging video content for YouTube and social media.",
    thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-03-10T15:00:00Z",
    updatedAt: "2024-03-12T09:15:00Z",
    readingTime: "10 min"
  },
  {
    id: 4,
    slug: "css-grid-vs-flexbox",
    title: "CSS Grid vs Flexbox: When to Use Which?",
    category: "Technology",
    summary: "Stop guessing which layout system to use. This guide breaks down the key differences and best use cases for modern CSS layout.",
    thumbnailUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&w=800&q=80",
    createdAt: "2024-03-25T08:00:00Z",
    updatedAt: "2024-03-25T08:00:00Z",
    readingTime: "6 min"
  },
];

export default function BlogsPage() {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState("");
  
  // New State for Multi-select (Array) & Dates
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // --- UI ONLY: We aren't implementing the complex date logic yet ---
  // We pass these purely for the UI to function visually
  
  return (
    <main className="min-h-screen bg-main">
      <PageHeader 
        title={<>Blog <span className="text-accent-orange">Posts</span></>}
        subtitle="Insights, tutorials, and thoughts on technology, content creation, and productivity."
      />

      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24">
         <BlogFilterBar 
            // Passing down all the new props
            categories={CATEGORIES}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
         />

         {/* Just passing all posts for now since we focused on UI */}
         <BlogGrid posts={ALL_POSTS} />
      </div>

    </main>
  );
}
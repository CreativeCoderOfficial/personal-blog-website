"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

// Import our new sub-components
import PostTypeSelector from "@/components/admin/PostTypeSelector";
import MetadataPanel from "@/components/admin/MetadataPanel";
import ContentEditor from "@/components/admin/ContentEditor";

export default function CreatePostPage() {
  const [postType, setPostType] = useState<"blog" | "resource">("blog");
  const [isLoading, setIsLoading] = useState(false);

  // Central Form State
  const [formData, setFormData] = useState({
    title: "", slug: "", summary: "", categories: "", thumbnailUrl: "",
    readingTime: "", fileSize: "", fileType: "ZIP",
  });
  const [takeaways, setTakeaways] = useState<string[]>([""]);
  const [paragraphs, setParagraphs] = useState([{ title: "", text: "", imageUrl: "" }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert("Post Created Successfully! (Mock)");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-main text-text-primary p-6 md:p-12 pb-32">
      
      {/* 1. NAVIGATION */}
      <div className="max-w-5xl mx-auto mb-10 flex items-center justify-between">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </Link>
        <h1 className="text-2xl font-bold hidden md:block">Content Creator Studio</h1>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- LEFT COLUMN: SETTINGS --- */}
        <div className="lg:col-span-4 space-y-6">
          <PostTypeSelector postType={postType} setPostType={setPostType} />
          
          <MetadataPanel 
            postType={postType} 
            formData={formData} 
            setFormData={setFormData} 
          />
        </div>

        {/* --- RIGHT COLUMN: CONTENT --- */}
        <div className="lg:col-span-8 space-y-6">
          
          <ContentEditor 
            formData={formData} setFormData={setFormData}
            takeaways={takeaways} setTakeaways={setTakeaways}
            paragraphs={paragraphs} setParagraphs={setParagraphs}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="
                px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3
                bg-gradient-to-r from-accent-purple to-purple-600 text-white
                shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-70 disabled:cursor-not-allowed
                transition-all duration-300
              "
            >
              {isLoading ? "Publishing..." : "Publish Post"}
              {!isLoading && <Save className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
// src/components/admin/ContentEditor.tsx
import { Plus, Trash2, Type, Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { PostFormData, SectionItem } from "@/types/admin";

// Markdown preview dependencies
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { markdownComponents, markdownProseClasses } from "@/lib/markdownConfig";
import AdminInput from "./admin-widgets/AdminInput";
import ImageUploader from "./admin-widgets/ImageUploader";

interface ContentEditorProps {
  formData: PostFormData;
  setFormData: (data: PostFormData) => void;
  takeaways: string[];
  setTakeaways: (data: string[]) => void;
  sections: SectionItem[];    
  setSections: (data: SectionItem[]) => void;
  postType: "blog" | "resource";
}

export default function ContentEditor({ 
  formData, setFormData, 
  takeaways, setTakeaways, 
  sections, setSections,
  postType,
}: ContentEditorProps) {

  // --- Helpers for Takeaways ---
  const handleAddTakeaway = () => setTakeaways([...takeaways, ""]);
  const handleRemoveTakeaway = (idx: number) =>
    setTakeaways(takeaways.filter((_, i) => i !== idx));
  const handleTakeawayChange = (idx: number, val: string) => {
    const updated = [...takeaways];
    updated[idx] = val;
    setTakeaways(updated);
  };

  // --- Helpers for Sections ---
  const handleAddSection = () =>
    setSections([...sections, { title: "", content: "", imageUrl: "" }]);
  const handleRemoveSection = (idx: number) =>
    setSections(sections.filter((_, i) => i !== idx));
  
  const handleSectionChange = (idx: number, field: string, val: string) => {
    const updated = [...sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setSections(updated);
  };

  // Tracks which section indices are in preview mode.
  // We use a Set because adding/removing by index is cleaner than
  // manipulating an array of booleans.
  const [previewSections, setPreviewSections] = useState<Set<number>>(new Set());

  // Toggles a section between write and preview mode.
  // We spread the Set into a new one because React needs a new reference
  // to detect state changes — mutating the existing Set won't trigger a re-render.
  const togglePreview = (idx: number) => {
    setPreviewSections((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  return (
    <div className="p-8 rounded-3xl bg-card border border-border-subtle shadow-2xl space-y-8">

      {/* 1. Title */}
      <div>
        <label className="text-sm font-bold text-text-secondary mb-2 block">Post Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-transparent text-3xl md:text-4xl font-bold text-text-primary placeholder:text-text-secondary/30 border-b border-border-subtle focus:border-accent-purple outline-none pb-2 transition-all"
          placeholder="Enter your title here..."
        />
      </div>

      {/* 2. Summary */}
      <div>
        <label className="text-sm font-bold text-text-secondary mb-2 block">Summary</label>
        <textarea
          value={formData.summary}
          onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
          rows={3}
          className="w-full bg-main/50 text-text-primary rounded-xl border border-border-subtle p-4 placeholder:text-text-secondary/50 focus:border-accent-purple outline-none resize-none"
          placeholder="Write a catchy summary..."
        />
      </div>

      {/* 3. Key Takeaways */}
      <div>
        <label className="text-sm font-bold text-text-secondary mb-3 flex items-center justify-between">
          <span>Key Takeaways</span>
          <button
            type="button"
            onClick={handleAddTakeaway}
            className="text-xs flex items-center gap-1 text-accent-purple hover:text-white"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </label>
        <div className="space-y-2">
          {takeaways.map((item, idx) => (
            <div key={idx} className="flex gap-2">
              <div className="w-6 h-6 rounded-full bg-accent-purple/10 text-accent-purple flex items-center justify-center text-xs font-bold mt-2 shrink-0">
                {idx + 1}
              </div>
              <AdminInput
                type="text"
                value={item}
                onChange={(e) => handleTakeawayChange(idx, e.target.value)}
                placeholder="Key point..."
                className="flex-1 bg-main/30"
              />
              <button
                type="button"
                onClick={() => handleRemoveTakeaway(idx)}
                className="text-text-secondary hover:text-red-400 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Content Sections */}
      <div>
        <label className="text-sm font-bold text-text-secondary mb-4 flex items-center justify-between">
          <span>Content Sections</span>
          <button
            type="button"
            onClick={handleAddSection}
            className="text-xs flex items-center gap-1 text-accent-orange hover:text-white"
          >
            <Plus className="w-3 h-3" /> Add Section
          </button>
        </label>

        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-main/30 border border-border-subtle relative group hover:border-text-secondary/30 transition-colors"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => handleRemoveSection(idx)}
                  className="text-text-secondary hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Section Title */}
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-text-secondary" />
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleSectionChange(idx, "title", e.target.value)}
                    placeholder="Section Title (Optional)"
                    className="bg-transparent font-bold text-text-primary placeholder:text-text-secondary/50 focus:outline-none w-full"
                  />
                </div>

                {/* Section Content - with write / preview mode*/}

                <div className="flex gap-1 mb-2">
                  {["Write", "Preview"].map((tab) => {
                    const isActive = tab === "Preview"
                      ? previewSections.has(idx)
                      : !previewSections.has(idx);
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => togglePreview(idx)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          isActive
                            ? "bg-accent-purple text-white"
                            : "text-text-secondary hover:text-white"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </div>

                {/* Content: textarea in write mode, ReactMarkdown in preview mode */}
                {previewSections.has(idx) ? (
                  // Preview mode — renders the markdown using the same prose classes
                  // as ContentRenderer.tsx so the preview matches the published post exactly
                  <div className={`min-h-[120px] px-4 py-3 rounded-xl border border-border-subtle bg-main/50 ${markdownProseClasses}`}>
                    {section.content
                      ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={markdownComponents}
                        >
                          {section.content}
                        </ReactMarkdown>
                      )
                      : <p className="text-text-secondary/40 italic text-sm">Nothing to preview yet...</p>
                    }
                  </div>
                ) : (
                  // Write mode — the existing textarea
                  <textarea
                    value={section.content}
                    onChange={(e) => handleSectionChange(idx, "content", e.target.value)}
                    rows={6}
                    className="w-full bg-main/50 text-text-primary rounded-xl border border-border-subtle p-4
                      placeholder:text-text-secondary/50 focus:border-accent-purple outline-none resize-none"
                    placeholder="Write your content in markdown..."
                  />
                )}

                {/* Optional Image URL */}
                <div className="flex gap-2 items-center">
                  <ImageIcon className="w-4 h-4 text-text-secondary shrink-0" />
                  <input
                    type="text"
                    value={section.imageUrl}
                    onChange={(e) => handleSectionChange(idx, "imageUrl", e.target.value)}
                    placeholder="Optional Image URL for this section..."
                    className="w-full bg-main/50 rounded-lg border border-border-subtle/50 px-3 py-2 text-xs text-text-secondary focus:border-accent-purple outline-none"
                  />

                  {/* Each section gets its own ImageUploader so with role section-0, section-1, etc...*/}
                  <ImageUploader
                    slug={formData.slug}
                    postType={postType}
                    role={`section-${idx}`}
                    onUpload={(url) => handleSectionChange(idx, "imageUrl", url)}
                  />

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
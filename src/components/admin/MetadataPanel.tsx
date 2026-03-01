// src/components/admin/MetadataPanel.tsx
import { Layout, Image as ImageIcon, DollarSign, Star, Link as LinkIcon } from "lucide-react";

interface MetadataPanelProps {
  postType: "blog" | "resource";
  formData: any;
  setFormData: (data: any) => void;
}

export default function MetadataPanel({ postType, formData, setFormData }: MetadataPanelProps) {

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="p-6 rounded-2xl bg-card/50 border border-border-subtle space-y-5">
      <h3 className="font-bold text-lg flex items-center gap-2">
        <Layout className="w-5 h-5 text-text-secondary" />
        Metadata
      </h3>

      {/* URL Slug */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">URL Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          placeholder="e.g. my-new-post"
          className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
        />
      </div>

      {/* Categories */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">
          Categories (comma separated)
        </label>
        <input
          type="text"
          value={formData.categories}
          onChange={(e) => handleChange("categories", e.target.value)}
          placeholder="Tech, Productivity..."
          className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
        />
      </div>

      {/* Thumbnail URL */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">Thumbnail URL</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.thumbnailUrl}
            onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
            placeholder="https://..."
            className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
          />
          <div className="p-2 bg-main border border-border-subtle rounded-lg">
            <ImageIcon className="w-5 h-5 text-text-secondary" />
          </div>
        </div>
      </div>

      {/* Reading Time */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">
          Reading Time (minutes)
        </label>
        <input
          type="number"
          value={formData.readingTime}
          onChange={(e) => handleChange("readingTime", e.target.value)}
          className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
        />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">Status</label>
        {/* A select gives the admin a clear choice between saving as draft
            or publishing immediately */}
        <select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {/* Resource-only fields — only rendered when postType is "resource" */}
      {postType === "resource" && (
        <div className="space-y-4 pt-4 border-t border-border-subtle">
          <label className="text-xs text-accent-orange font-bold uppercase">
            Resource Details
          </label>

          {/* Resource Type — maps to ResourceType model via connectOrCreate */}
          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold">Resource Type</label>
            <input
              type="text"
              value={formData.resourceType}
              onChange={(e) => handleChange("resourceType", e.target.value)}
              placeholder="e.g. Video, E-Book, Tool..."
              className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-orange outline-none"
            />
          </div>

          {/* Resource Link */}
          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold">Resource Link</label>
            <div className="flex gap-2 items-center">
              <LinkIcon className="w-4 h-4 text-text-secondary shrink-0" />
              <input
                type="text"
                value={formData.resourceLink}
                onChange={(e) => handleChange("resourceLink", e.target.value)}
                placeholder="https://..."
                className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-orange outline-none"
              />
            </div>
          </div>

          {/* Resource Cost */}
          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold">Cost (€)</label>
            <div className="flex gap-2 items-center">
              <DollarSign className="w-4 h-4 text-text-secondary shrink-0" />
              <input
                type="number"
                value={formData.resourceCost}
                onChange={(e) => handleChange("resourceCost", e.target.value)}
                placeholder="0 for free"
                className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-orange outline-none"
              />
            </div>
          </div>

          {/* Resource Rating */}
          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold">Rating (0–5)</label>
            <div className="flex gap-2 items-center">
              <Star className="w-4 h-4 text-text-secondary shrink-0" />
              <input
                type="number"
                value={formData.resourceRating}
                onChange={(e) => handleChange("resourceRating", e.target.value)}
                min="0"
                max="5"
                step="0.1"
                placeholder="e.g. 4.5"
                className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-orange outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
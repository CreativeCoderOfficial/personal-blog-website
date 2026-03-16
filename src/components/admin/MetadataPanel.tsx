// src/components/admin/MetadataPanel.tsx
//
// Receives categoryOptions and resourceTypeOptions from CreatePostForm,
// which got them from the Server Component page.tsx.
// Passes them into the two new selector components.

import { Layout, Image as ImageIcon, DollarSign, Star, Link as LinkIcon } from "lucide-react";
import CategorySelector from "@/components/admin/CategorySelector";
import ResourceTypeSelector from "@/components/admin/admin-widgets/ResourceTypeSelector";
import { CategoryOption, ResourceTypeOption, PostFormData } from "@/types/admin";
import AdminInput from "./admin-widgets/AdminInput";
import ImageUploader from "./admin-widgets/ImageUploader";

interface MetadataPanelProps {
  postType: "blog" | "resource";
  formData: PostFormData;
  setFormData: (data: PostFormData) => void;
  categoryOptions: CategoryOption[];
  resourceTypeOptions: ResourceTypeOption[];
}

export default function MetadataPanel({
  postType,
  formData,
  setFormData,
  categoryOptions,
  resourceTypeOptions,
}: MetadataPanelProps) {

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
        <AdminInput
          type="text"
          value={formData.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          placeholder="e.g. my-new-post"
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs text-text-secondary font-semibold">Categories</label>
        <CategorySelector
          options={categoryOptions}
          // formData.categories is now a string[] — CategorySelector
          // reads and writes it directly via selected / onChange
          selected={formData.categories}
          onChange={(value) =>
            setFormData({ ...formData, categories: value })
          }
        />
      </div>

      {/* Thumbnail URL */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">Thumbnail URL</label>
        <div className="flex gap-2">
          <AdminInput
            type="text"
            value={formData.thumbnailUrl}
            onChange={(e) => handleChange("thumbnailUrl", e.target.value)}
            placeholder="https://..."
          />
          {/* ImageUploader*/}
          <ImageUploader
            slug={formData.slug}
            postType={postType}
            role="thumbnail"
            onUpload={(url) => handleChange("thumbnailUrl", url)}
          />
        </div>
      </div>

      {/* Reading Time */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">
          Reading Time (minutes)
        </label>
       <AdminInput
          type="number"
          value={formData.readingTime}
          onChange={(e) => handleChange("readingTime", e.target.value)}
          placeholder="e.g. 5"
        />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">Status</label>
        <select
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      {/* Resource-only fields */}
      {postType === "resource" && (
        <div className="space-y-4 pt-4 border-t border-border-subtle">
          <label className="text-xs text-accent-orange font-bold uppercase">
            Resource Details
          </label>

          {/* Resource Type */}
          <div className="space-y-2">
            <label className="text-xs text-text-secondary font-semibold">
              Resource Type
            </label>
            <ResourceTypeSelector
              options={resourceTypeOptions}
              // formData.resourceType is a single string — one type per post
              selected={formData.resourceType}
              onChange={(value) =>
                setFormData({ ...formData, resourceType: value })
              }
            />
          </div>

          {/* Resource Link */}
          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold">
              Resource Link
            </label>
            <div className="flex gap-2 items-center">
              <LinkIcon className="w-4 h-4 text-text-secondary shrink-0" />
              <AdminInput
                type="text"
                value={formData.resourceLink}
                onChange={(e) => handleChange("resourceLink", e.target.value)}
                placeholder="https://..."
                className="focus:border-accent-orange"
              />
            </div>
          </div>

          {/* Resource Cost */}
          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold">Cost (€)</label>
            <div className="flex gap-2 items-center">
              <DollarSign className="w-4 h-4 text-text-secondary shrink-0" />
              <AdminInput
                type="number"
                value={formData.resourceCost}
                onChange={(e) => handleChange("resourceCost", e.target.value)}
                placeholder="0 for free"
                className="focus:border-accent-orange"
              />
            </div>
          </div>

          {/* Resource Rating */}
          <div className="space-y-1">
            <label className="text-xs text-text-secondary font-semibold">
              Rating (0–5)
            </label>
            <div className="flex gap-2 items-center">
              <Star className="w-4 h-4 text-text-secondary shrink-0" />
              <AdminInput
                type="number"
                value={formData.resourceRating}
                onChange={(e) => handleChange("resourceRating", e.target.value)}
                min="0"
                max="5"
                step="0.1"
                placeholder="e.g. 4.5"
                className="focus:border-accent-orange"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
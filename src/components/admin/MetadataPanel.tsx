import { Layout, Image as ImageIcon } from "lucide-react";

interface MetadataPanelProps {
  postType: "blog" | "resource";
  formData: any; // You can make this stricter with an interface if you prefer
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

      {/* Common Fields */}
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

      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">Categories (comma separated)</label>
        <input 
          type="text" 
          value={formData.categories}
          onChange={(e) => handleChange("categories", e.target.value)}
          placeholder="Tech, Productivity..."
          className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
        />
      </div>

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

      <div className="space-y-1">
        <label className="text-xs text-text-secondary font-semibold">Reading Time</label>
        <div className="mt-2">

            <input 
              type="number" 
              value={formData.readingTime}
              onChange={(e) => handleChange("readingTime", e.target.value)}
              className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none"
            />
        </div>
      </div>

      {/* Conditional Fields */}
      {postType === "blog" ? (
        <div></div>
      ) : (
        <div className="space-y-3 pt-4 border-t border-border-subtle">
          <label className="text-xs text-accent-orange font-bold uppercase">Resource Details</label>
          <div>
             <label className="text-xs text-text-secondary font-semibold">File Size</label>
             <input 
                type="text" 
                placeholder="e.g. 25 MB"
                value={formData.fileSize}
                onChange={(e) => handleChange("fileSize", e.target.value)}
                className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-orange outline-none"
             />
          </div>
          <div>
             <label className="text-xs text-text-secondary font-semibold">File Type</label>
             <select 
                value={formData.fileType}
                onChange={(e) => handleChange("fileType", e.target.value)}
                className="w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-orange outline-none"
             >
               <option>ZIP</option>
               <option>PDF</option>
               <option>JSON</option>
               <option>App</option>
               <option>Website</option>
               <option>Platform</option>
               <option>Product</option>
             </select>
          </div>
        </div>
      )}
    </div>
  );
}
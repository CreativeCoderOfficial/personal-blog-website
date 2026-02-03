import { FileText, Download } from "lucide-react";

interface PostTypeSelectorProps {
  postType: "blog" | "resource";
  setPostType: (type: "blog" | "resource") => void;
}

export default function PostTypeSelector({ postType, setPostType }: PostTypeSelectorProps) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border-subtle shadow-xl">
      <label className="text-xs font-bold uppercase tracking-wider text-text-secondary mb-4 block">
        Content Type
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPostType("blog")}
          className={`
            flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
            ${postType === "blog" 
              ? "bg-accent-purple/10 border-accent-purple text-accent-purple" 
              : "bg-main border-border-subtle text-text-secondary hover:bg-card"
            }
          `}
        >
          <FileText className="w-6 h-6" />
          <span className="font-semibold text-sm">Blog Post</span>
        </button>

        <button
          type="button"
          onClick={() => setPostType("resource")}
          className={`
            flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all
            ${postType === "resource" 
              ? "bg-accent-orange/10 border-accent-orange text-accent-orange" 
              : "bg-main border-border-subtle text-text-secondary hover:bg-card"
            }
          `}
        >
          <Download className="w-6 h-6" />
          <span className="font-semibold text-sm">Resource</span>
        </button>
      </div>
    </div>
  );
}
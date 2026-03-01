// src/components/admin/CreatePostForm.tsx
//
// Client Component — handles all form state and interactivity.
// Receives categories and resourceTypes as props from the Server Component
// parent (page.tsx) which fetched them from Prisma directly.
//
// We separate this from page.tsx so that page.tsx can remain a Server
// Component and do the Prisma fetch without any client-side overhead.

"use client";

import { createPost } from "@/lib/actions/posts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import PostTypeSelector from "@/components/admin/PostTypeSelector";
import MetadataPanel from "@/components/admin/MetadataPanel";
import ContentEditor from "@/components/admin/ContentEditor";

// The shape of one content section
interface SectionItem {
  title: string;
  content: string;
  imageUrl: string;
}

// The shape of a category coming from the DB —
// we need both name and color so CategorySelector can style the toggles
export interface CategoryOption {
  name: string;
  color: string;
}

// The shape of a resource type coming from the DB
export interface ResourceTypeOption {
  name: string;
}

interface CreatePostFormProps {
  // Pre-fetched from Prisma in page.tsx — passed down as props so this
  // Client Component doesn't need to do any data fetching of its own
  categories: CategoryOption[];
  resourceTypes: ResourceTypeOption[];
}

export default function CreatePostForm({
  categories,
  resourceTypes,
}: CreatePostFormProps) {
  const router = useRouter();
  const [postType, setPostType] = useState<"blog" | "resource">("blog");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    thumbnailUrl: "",
    readingTime: "",
    status: "DRAFT",
    // categories is now an array — CategorySelector will update this
    categories: [] as string[],
    resourceType: "",
    resourceLink: "",
    resourceCost: "",
    resourceRating: "",
  });

  const [takeaways, setTakeaways] = useState<string[]>([""]);
  const [sections, setSections] = useState<SectionItem[]>([
    { title: "", content: "", imageUrl: "" },
  ]);

  const handlePostTypeChange = (type: "blog" | "resource") => {
    setPostType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await createPost({
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      type: postType === "blog" ? "BLOG" : "RESOURCE",
      status: formData.status as "DRAFT" | "PUBLISHED",
      readingTime: formData.readingTime as unknown as number,
      thumbnailUrl: formData.thumbnailUrl,
      keyTakeaways: takeaways.filter((t) => t.trim() !== ""),
      sections: sections.filter(
        (s) => s.title.trim() || s.content.trim() || s.imageUrl.trim()
      ),
      // categories is already a string[] — the Server Action handles both
      // string and string[] formats via the z.union() in the Zod schema
      categories: formData.categories,
      resourceType: postType === "resource" ? formData.resourceType : undefined,
      resourceLink: postType === "resource" ? formData.resourceLink : undefined,
      resourceCost:
        postType === "resource"
          ? (formData.resourceCost as unknown as number)
          : undefined,
      resourceRating:
        postType === "resource"
          ? (formData.resourceRating as unknown as number)
          : undefined,
    });

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen bg-main text-text-primary p-6 md:p-12 pb-32">

      {/* Navigation */}
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

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-8 space-y-6">
              <PostTypeSelector
                postType={postType}
                setPostType={handlePostTypeChange}
              />
              <MetadataPanel
                postType={postType}
                formData={formData}
                setFormData={setFormData}
                // Pass the pre-fetched lists down to MetadataPanel,
                // which will forward them to CategorySelector and ResourceTypeSelector
                categoryOptions={categories}
                resourceTypeOptions={resourceTypes}
              />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <ContentEditor
              formData={formData}
              setFormData={setFormData}
              takeaways={takeaways}
              setTakeaways={setTakeaways}
              sections={sections}
              setSections={setSections}
            />

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="
                  px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3
                  bg-gradient-to-r from-accent-purple to-purple-600 text-white
                  shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]
                  disabled:opacity-70 disabled:cursor-not-allowed
                  transition-all duration-300
                "
              >
                {isLoading
                  ? "Saving..."
                  : formData.status === "PUBLISHED"
                  ? "Publish Post"
                  : "Save Draft"}
                {!isLoading && <Save className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>
      </form>
    </main>
  );
}
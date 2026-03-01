// src/app/admin/posts/new/page.tsx
"use client";

// We import `createPost` directly from the Server Actions file.
// Even though this is a Client Component, Next.js handles calling
// the server function automatically behind the scenes.
import { createPost } from "@/lib/actions/posts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import PostTypeSelector from "@/components/admin/PostTypeSelector";
import MetadataPanel from "@/components/admin/MetadataPanel";
import ContentEditor from "@/components/admin/ContentEditor";

// The shape of one content section — matches the Prisma Section model
// and the Zod sectionSchema
interface SectionItem {
  title: string;
  content: string;  // renamed from `text`
  imageUrl: string;
}

export default function CreatePostPage() {
  const router = useRouter();

  // postType drives the UI (which fields show in MetadataPanel),
  // but the actual value sent to the action is formData.type (uppercase)
  const [postType, setPostType] = useState<"blog" | "resource">("blog");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // --- Form State ---
  // All fields map directly to CreatePostData from the Zod schema.
  // We keep everything as strings here because form inputs return strings —
  // Zod's z.coerce.number() handles converting readingTime, resourceCost,
  // and resourceRating to numbers in the Server Action.
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    summary: "",
    thumbnailUrl: "",
    readingTime: "",
    status: "DRAFT",       // default to draft so we never accidentally publish
    categories: "",
    // Resource-only fields — empty string when not used
    resourceType: "",
    resourceLink: "",
    resourceCost: "",
    resourceRating: "",
  });

  // Takeaways: array of strings, one per bullet point
  const [takeaways, setTakeaways] = useState<string[]>([""]);

  // Sections: renamed from `paragraphs`, `content` renamed from `text`
  const [sections, setSections] = useState<SectionItem[]>([
    { title: "", content: "", imageUrl: "" },
  ]);

  // Called when postType toggle changes — also updates formData.type
  // so they stay in sync. The UI uses lowercase ("blog"/"resource"),
  // the DB uses uppercase ("BLOG"/"RESOURCE").
  const handlePostTypeChange = (type: "blog" | "resource") => {
    setPostType(type);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Assemble the full payload to send to the Server Action.
    // We match the shape expected by CreatePostData / createPostSchema.
    const result = await createPost({
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      // Convert the UI's lowercase type to the uppercase enum Prisma expects
      type: postType === "blog" ? "BLOG" : "RESOURCE",
      status: formData.status as "DRAFT" | "PUBLISHED",
      // readingTime is a string from the input — Zod coerces it to number
      readingTime: formData.readingTime as unknown as number,
      thumbnailUrl: formData.thumbnailUrl,
      // Filter out empty takeaway strings before sending
      keyTakeaways: takeaways.filter((t) => t.trim() !== ""),
      // Filter out completely empty sections before sending
      sections: sections.filter(
        (s) => s.title.trim() || s.content.trim() || s.imageUrl.trim()
      ),
      categories: formData.categories,
      // Resource-only fields — only included if postType is resource
      resourceType: postType === "resource" ? formData.resourceType : undefined,
      resourceLink: postType === "resource" ? formData.resourceLink : undefined,
      resourceCost: postType === "resource"
        ? (formData.resourceCost as unknown as number)
        : undefined,
      resourceRating: postType === "resource"
        ? (formData.resourceRating as unknown as number)
        : undefined,
    });

    if (!result.success) {
      // Surface the error from the Server Action in the UI
      setError(result.error);
      setIsLoading(false);
      return;
    }

    // Success — go back to the dashboard
    // The dashboard will show the new post immediately because
    // the Server Action called revalidatePath("/admin")
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

          {/* LEFT COLUMN: Settings */}
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
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Content */}
          <div className="lg:col-span-8 space-y-6">
            <ContentEditor
              formData={formData}
              setFormData={setFormData}
              takeaways={takeaways}
              setTakeaways={setTakeaways}
              sections={sections}
              setSections={setSections}
            />

            {/* Error message — shown if Server Action returns success: false */}
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
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
                {isLoading ? "Saving..." : formData.status === "PUBLISHED" ? "Publish Post" : "Save Draft"}
                {!isLoading && <Save className="w-5 h-5" />}
              </button>
            </div>
          </div>

        </div>
      </form>
    </main>
  );
}
// src/components/admin/PostForm.tsx
//
// Shared Client Component used by both the create and edit post pages.
//
// The `mode` prop controls:
//   - How state is initialized (empty vs. seeded from initialData for editing posts)
//   - Which server action is called on submit (createPost vs. updatePost)
//   - UI labels (page title, button text, success message)
//


"use client";

import { createPost, updatePost } from "@/lib/actions/posts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, CheckCircle } from "lucide-react";
import PostTypeSelector from "@/components/admin/admin-widgets/PostTypeSelector";
import MetadataPanel from "@/components/admin/MetadataPanel";
import ContentEditor from "@/components/admin/ContentEditor";
import type { PostFormData, SectionItem, InitialPostData, CategoryOption, ResourceTypeOption } from "@/types/admin";

interface PostFormProps {
  mode: "create" | "edit";
  // Only provided in edit mode — undefined in create mode
  initialData?: InitialPostData;
  // Pre-fetched from the parent page Server Component
  categories: CategoryOption[];
  resourceTypes: ResourceTypeOption[];
}

export default function PostForm({
  mode,
  initialData,
  categories,
  resourceTypes,
}: PostFormProps) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [postType, setPostType] = useState<"blog" | "resource">(
    // Prisma stores "BLOG"/"RESOURCE", the form uses lowercase "blog"/"resource"
    initialData?.type === "RESOURCE" ? "resource" : "blog"
  );

  // The ?? syntax means "if initialData.field is undefined or null, use the default value on the right".
  // This allows us to seed the form with existing data in edit mode, while still having clean defaults in create mode.
  const [formData, setFormData] = useState<PostFormData>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    summary: initialData?.summary ?? "",
    thumbnailUrl: initialData?.thumbnailUrl ?? "",
    readingTime: initialData?.readingTime?.toString() ?? "",
    status: initialData?.status ?? "DRAFT",
    categories: initialData?.categories.map((c) => c.name) ?? [] as string[],
    resourceType: initialData?.resourceType?.name ?? "",
    resourceLink: initialData?.resourceLink ?? "",
    resourceCost: initialData?.resourceCost?.toString() ?? "",
    resourceRating: initialData?.resourceRating?.toString() ?? "",
  });

  const [takeaways, setTakeaways] = useState<string[]>(
    // If editing and there are existing takeaways, use them.
    // Otherwise start with one empty string (same as create mode default).
    initialData?.keyTakeaways?.length
      ? initialData.keyTakeaways
      : [""]
  );

  const [sections, setSections] = useState<SectionItem[]>(
    // Map Prisma section shape to the form's SectionItem shape.
    // Prisma uses null for empty fields, the form uses empty strings.
    initialData?.sections?.length
      ? initialData.sections.map((s) => ({
          title: s.title ?? "",
          content: s.content ?? "",
          imageUrl: s.imageUrl ?? "",
        }))
      : [{ title: "", content: "", imageUrl: "" }]
  );


  // ------------------------------------------------------------
  // Submit handler
  // Branches on mode to call the correct Server Action.
  // Both actions return { success, slug? } or { success, error }.
  // ------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");


    const payload = {
      title: formData.title,
      slug: formData.slug,
      summary: formData.summary,
      type: postType === "blog" ? "BLOG" as const : "RESOURCE" as const,
      status: formData.status as "DRAFT" | "PUBLISHED",
      readingTime: formData.readingTime as unknown as number,
      thumbnailUrl: formData.thumbnailUrl,
      keyTakeaways: takeaways.filter((t) => t.trim() !== ""),
      sections: sections.filter(
        (s) => s.title.trim() || s.content.trim() || s.imageUrl.trim()
      ),
      categories: formData.categories,
      resourceType: postType === "resource" ? formData.resourceType : undefined,
      resourceLink: postType === "resource" ? formData.resourceLink : undefined,
      resourceCost: postType === "resource" ? formData.resourceCost as unknown as number : undefined,
      resourceRating: postType === "resource" ? formData.resourceRating as unknown as number : undefined,
    };

    
    // Call the appropriate Server Action based on mode
    const result = isEdit
      ? await updatePost({ ...payload, id: initialData!.id }) // the "!" tells TypeScript "I know initialData is defined here because we're in edit mode"
      : await createPost(payload);

    setIsLoading(false);

    if (!result.success) {
      setError(result.error);
      setIsLoading(false);
      return;
    }

    if (isEdit) {
      // Stay on the page — show a success banner instead of redirecting
      setSuccessMessage("Post updated successfully!");
    } else {
      // After creating, redirect to the admin dashboard
      router.push("/admin");
    }
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
        {/* Page title reflects the current mode */}
        <h1 className="text-2xl font-bold hidden md:block">
          {isEdit ? "Edit Post" : "Content Creator Studio"}
        </h1>
      </div>

      {/* Success banner — only visible after a successful update in edit mode */}
      {successMessage && (
        <div className="max-w-5xl mx-auto mb-6 flex items-center gap-3 px-5 py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* Error banner — shown if the server action returns an error */}
      {error && (
        <div className="max-w-5xl mx-auto mb-6 px-5 py-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* --- LEFT COLUMN: SETTINGS --- */}
          <div className="lg:col-span-4 space-y-6">
            <PostTypeSelector postType={postType} setPostType={setPostType} />
            <MetadataPanel
              postType={postType}
              formData={formData}
              setFormData={setFormData}
              categoryOptions={categories}
              resourceTypeOptions={resourceTypes}
            />
          </div>

          {/* --- RIGHT COLUMN: CONTENT --- */}
          <div className="lg:col-span-8 space-y-6">
            <ContentEditor
              formData={formData}
              setFormData={setFormData}
              takeaways={takeaways}
              setTakeaways={setTakeaways}
              sections={sections}
              setSections={setSections}
              postType={postType}
            />

            {/* Submit Button */}
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
                {/* Button label reflects mode and loading state */}
                {isLoading
                  ? isEdit ? "Saving..." : "Publishing..."
                  : isEdit ? "Save Changes" : "Publish Post"
                }
                {!isLoading && <Save className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </form>
    </main>
  );
}
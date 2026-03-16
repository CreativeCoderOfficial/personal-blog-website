// src/components/admin/ImageUploader.tsx
//
// A reusable client component that adds an upload button next to any image
// URL input in the admin dashboard.
//
// HOW IT WORKS:
//   1. The user clicks the upload button — a hidden <input type="file"> opens
//   2. We validate that slug is non-empty — if not, we show an error and stop
//   3. We POST the file + metadata to /api/upload as multipart/form-data
//   4. On success, we call onUpload(url) — the parent uses this to set the
//      adjacent URL field (thumbnailUrl, imageUrl, etc.)
//
// The API route uses postType + slug + role to build an organised path:
//   /uploads/blog-posts/my-cool-post/thumbnail.webp
//   /uploads/resource-posts/cool-tool/section-0.jpg

"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";

interface ImageUploaderProps {
  // The current slug value from the form — required before uploading.
  // If empty, the upload is blocked with a user-friendly error.
  slug: string;

  // "blog" or "resource" — determines the subfolder (blog-posts / resource-posts)
  postType: "blog" | "resource";

  // The role of this image within the post (e.g. thumbnail, section photo)
  role: string;

  // Called with the returned public URL when the upload succeeds.
  // The parent uses this to update its URL field state.
  onUpload: (url: string) => void;
}

export default function ImageUploader({ slug, postType, role, onUpload }: ImageUploaderProps) {

  // ── State ──────────────────────────────────────────────────────────────────
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError]             = useState<string | null>(null);

  // A ref to the hidden file input — triggered programmatically by the button
  const inputRef = useRef<HTMLInputElement>(null);


  // ── Handler: user picks a file ─────────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Guard: slug must be filled in before we can build an organised folder path.
    // We check here (in addition to the API) so the user gets instant feedback
    // without a round-trip to the server.
    if (!slug || slug.trim() === "") {
      setError("Please fill in the URL slug field before uploading.");
      // Reset the input so they can try again after filling in the slug
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // Build the multipart/form-data body.
      const body = new FormData();
      body.append("file",     file);      // the image binary
      body.append("postType", postType);  // "blog" or "resource"
      body.append("slug",     slug);      // e.g. "my-cool-post"
      body.append("role",     role);      // "thumbnail" or "section-0"

      const response = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await response.json();

      if (!response.ok) {
        // The API returned a validation or server error — show it inline
        setError(data.error ?? "Upload failed.");
        return;
      }

      // data.url is the organised public path e.g.
      // "/uploads/blog-posts/my-cool-post/thumbnail.webp"
      // We pass it up to the parent so it can populate the URL field
      onUpload(data.url);

    } catch {
      setError("Upload failed. Please check your connection.");
    } finally {
      setIsUploading(false);
      // reset possibility to reupload a new / different file
      if (inputRef.current) inputRef.current.value = "";
    }
  };


  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-1">

      {/* Hidden native file input — triggered by the button below */}
      <input
        ref={inputRef}
        type="file"
        // accept restricts the file picker to images only (mirrors API validation)
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload image"
      />

      {/* Visible upload button — clicking it opens the hidden file picker */}
      <button
        type="button" // Prevents this button from submitting the parent <form>
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        title={
          // Show a helpful tooltip if slug is missing
          !slug || slug.trim() === ""
            ? "Fill in the URL slug first"
            : "Upload image from your device"
        }
        className="
          p-2 rounded-lg border border-border-subtle bg-main
          hover:border-accent-purple hover:bg-accent-purple/10
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          flex items-center justify-center
        "
      >
        {isUploading
          ? <Loader2 className="w-5 h-5 text-accent-purple animate-spin" />
          : <Upload className="w-5 h-5 text-text-secondary" />
        }
      </button>

      {/* Inline error — only visible when something went wrong */}
      {error && (
        <div className="flex items-center gap-1 text-red-400 text-xs max-w-[10rem]">
          <AlertCircle className="w-3 h-3 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
// src/app/api/upload/route.ts
//
// API route for handling image uploads from the admin dashboard.
//
// FLOW:
//   1. Admin POSTs a multipart/form-data request containing a file + metadata
//   2. We verify the admin session — unauthenticated requests are rejected
//   3. We validate the file type (images only) and size (max 5MB)
//   4. We validate + sanitize the slug and postType fields
//   5. We write the file to an organised, predictable path:
//        {UPLOAD_DIR}/{postType}/{slug}/{role}.{ext}
//      e.g. public/uploads/resource-posts/cool-tool/thumbnail.webp
//   6. We return the public URL path (e.g. "/uploads/resource-posts/cool-tool/thumbnail.webp")
//
// OVERWRITE BEHAVIOUR:
//   Uploading a new thumbnail for the same slug overwrites the previous file —
//   writeFile() replaces existing files by default. This keeps the folder clean.
//
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

// ── Configuration ─────────────────────────────────────────────────────────────
// The root directory where uploads are written
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads");

// Maximum allowed file size: 10MB in bytes
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

// Allowed MIME types — images only
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

// Map from MIME type to file extension
const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png":  "png",
  "image/webp": "webp",
  "image/gif":  "gif",
};

// Maps the postType value sent from the frontend to its folder name.
// "blog"     → "blog-posts"
// "resource" → "resource-posts"
const POST_TYPE_TO_FOLDER: Record<string, string> = {
  blog:     "blog-posts",
  resource: "resource-posts",
};


// ── Helpers ───────────────────────────────────────────────────────────────────

// Sanitizes a string for safe use as a filesystem path segment.
// Strip everything that isn't a lowercase letter, digit, or hyphen.
// This prevents path traversal attacks (e.g. slug = "../../etc/passwd").
function sanitizePathSegment(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, ""); // keep only: a-z, 0-9, hyphen
}


// ── POST /api/upload ──────────────────────────────────────────────────────────
export async function POST(request: Request) {
  try {

    // ── Step 1: Verify admin session ──────────────────────────────────────────
    // auth() reads the JWT cookie set by NextAuth.
    // Returns null if the user is not logged in.
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ── Step 2: Parse the multipart form data ─────────────────────────────────
    const formData = await request.formData();

    const file     = formData.get("file");
    const postType = formData.get("postType");
    const slug     = formData.get("slug");
    const role     = formData.get("role");

    // ── Step 3: Validate the file field ───────────────────────────────────────
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      );
    }

    // ── Step 4: Validate required text fields ─────────────────────────────────
    if (!postType || typeof postType !== "string") {
      return NextResponse.json(
        { error: "Missing postType field." },
        { status: 400 }
      );
    }

    // The entire folder structure depends on the slug, so we need it before uploading a file
    if (!slug || typeof slug !== "string" || slug.trim() === "") {
      return NextResponse.json(
        { error: "Slug is required before uploading. Please fill in the URL slug field first." },
        { status: 400 }
      );
    }

    if (!role || typeof role !== "string") {
      return NextResponse.json(
        { error: "Missing role field." },
        { status: 400 }
      );
    }

    // ── Step 5: Validate postType value ───────────────────────────────────────
    // Must be one of the known keys in POST_TYPE_TO_FOLDER.
    const folderName = POST_TYPE_TO_FOLDER[postType];
    if (!folderName) {
      return NextResponse.json(
        { error: `Invalid postType: "${postType}". Must be "blog" or "resource".` },
        { status: 400 }
      );
    }

    // ── Step 6: Validate file type ────────────────────────────────────────────
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Only JPEG, PNG, WebP, and GIF are allowed.` },
        { status: 400 }
      );
    }

    // ── Step 7: Validate file size ────────────────────────────────────────────
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.` },
        { status: 400 }
      );
    }

    // ── Step 8: Sanitize path segments ────────────────────────────────────────
    // We sanitize slug and role before using them in the filesystem path.
    // postType is already validated against our known-good map above, no need to sanitize it.
    const safeSlug = sanitizePathSegment(slug);
    // role is "thumbnail" or "section-0" etc. — same rules apply.
    // Note: sanitizePathSegment keeps hyphens, so "section-0" → "section-0" ✓
    const safeRole = sanitizePathSegment(role);

    // Reject if sanitization produced an empty string
    // (e.g. slug was "!!!" — all special chars stripped to nothing)
    if (!safeSlug) {
      return NextResponse.json(
        { error: "Slug contains no valid characters. Use only letters, numbers, and hyphens." },
        { status: 400 }
      );
    }
    if (!safeRole) {
      return NextResponse.json(
        { error: "Role contains no valid characters after sanitization." },
        { status: 400 }
      );
    }

    // ── Step 9: Build the organised directory path ────────────────────────────
    // Final folder structure: {UPLOAD_DIR}/{folderName}/{safeSlug}/
    // Example:                public/uploads/blog-posts/my-cool-post/thumbnail.png
    const uploadSubDir = join(UPLOAD_DIR, folderName, safeSlug);

    // { recursive: true } — creates all parent folders if they don't exist,
    // and does NOT throw an error if the directory already exists.
    await mkdir(uploadSubDir, { recursive: true });

    // ── Step 10: Build the filename ───────────────────────────────────────────
    // Filename = safeRole + correct extension.
    // Examples: "thumbnail.webp", "section-0.jpg", "section-1.png"
    //
    // Because the filename is deterministic (same role = same name),
    // writeFile() automatically overwrites any existing file at this path.
    // Re-uploading a thumbnail simply replaces the old one — no duplicates.
    const ext      = MIME_TO_EXT[file.type];
    const filename = `${safeRole}.${ext}`;
    const filePath = join(uploadSubDir, filename);

    // ── Step 11: Write the file to disk ───────────────────────────────────────
    // file.arrayBuffer() reads the entire file into memory as a raw binary buffer.
    // Buffer.from() converts it to a Node.js Buffer that writeFile() can save.
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    // ── Step 12: Return the public URL ────────────────────────────────────────
    // Next.js serves everything under /public as static files.
    // Since UPLOAD_DIR maps to /app/public/uploads in the container,
    // the public URL is: /uploads/{folderName}/{safeSlug}/{filename}
    const publicUrl = `/uploads/${folderName}/${safeSlug}/${filename}`;

    return NextResponse.json(
      { url: publicUrl },
      { status: 201 } // 201 Created — a new resource was successfully stored
    );

  } catch (error) {
    // Catch unexpected errors (e.g. disk full, permission denied)
    console.error("[upload] Unexpected error:", error);
    return NextResponse.json(
      { error: "Upload failed due to a server error." },
      { status: 500 }
    );
  }
}
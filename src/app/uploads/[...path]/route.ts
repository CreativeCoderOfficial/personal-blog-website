// src/app/uploads/[...path]/route.ts
//
// Dynamic file server for runtime-uploaded images.
//
// HOW IT WORKS:
//   A request to /uploads/blog-posts/my-post/thumbnail.jpg is caught by the
//   [...path] catch-all segment, which gives us ["blog-posts", "my-post", "thumbnail.jpg"].
//   We join those segments onto UPLOAD_DIR to get the absolute file path,
//   read it from disk, and stream it back with the correct Content-Type header.
//

import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, resolve } from "path";

// The root upload directory — must match the value used in /api/upload/route.ts
const UPLOAD_DIR = process.env.UPLOAD_DIR ?? join(process.cwd(), "public", "uploads");

// Maps file extensions to their correct MIME type for the Content-Type header.
// The browser uses this to decide how to handle/display the response.
const EXT_TO_MIME: Record<string, string> = {
  jpg:  "image/jpeg",
  jpeg: "image/jpeg",
  png:  "image/png",
  webp: "image/webp",
  gif:  "image/gif",
};

interface RouteContext {
  // Next.js passes the catch-all segments as an array.
  // For /uploads/blog-posts/my-post/thumbnail.jpg this is:
  // ["blog-posts", "my-post", "thumbnail.jpg"]
  params: Promise<{ path: string[] }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {

    // ── Step 1: Extract path segments ─────────────────────────────────────────
    const { path } = await context.params;

    if (!path || path.length === 0) {
      return new NextResponse("Not found", { status: 404 });
    }

    // ── Step 2: Build and verify the absolute file path ───────────────────────
    // join() combines UPLOAD_DIR with the path segments from the URL.
    // resolve() converts it to an absolute path, resolving any .. segments.
    const filePath     = join(UPLOAD_DIR, ...path);
    const resolvedPath = resolve(filePath);
    const resolvedBase = resolve(UPLOAD_DIR);

    // Security check: ensure the resolved path is still inside UPLOAD_DIR.
    // If someone requested /uploads/../../../../etc/passwd, resolve() would
    // produce a path outside UPLOAD_DIR — we catch and reject that here.
    if (!resolvedPath.startsWith(resolvedBase)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // ── Step 3: Read the file from disk ───────────────────────────────────────
    // readFile() throws if the file doesn't exist — we catch that below
    // and return a 404 rather than crashing the route.
    const fileBuffer = await readFile(resolvedPath);

    // ── Step 4: Determine the Content-Type ────────────────────────────────────
    // Extract the extension from the last path segment (the filename).
    // e.g. "thumbnail.jpg" → "jpg" → "image/jpeg"
    const filename  = path[path.length - 1];
    const ext       = filename.split(".").pop()?.toLowerCase() ?? "";
    const mimeType  = EXT_TO_MIME[ext] ?? "application/octet-stream";

    // ── Step 5: Return the file ───────────────────────────────────────────────
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        // Tells the browser what kind of file this is
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, s-maxage=3600",
      },
    });

  } catch (error: unknown) {
    // readFile() throws with code "ENOENT" when the file doesn't exist
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as NodeJS.ErrnoException).code === "ENOENT"
    ) {
      return new NextResponse("Not found", { status: 404 });
    }

    // Any other error (permissions, disk failure, etc.)
    console.error("[uploads] Failed to serve file:", error);
    return new NextResponse("Server error", { status: 500 });
  }
}
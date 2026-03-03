import { auth } from "@/lib/auth";
import { z } from "zod";
import { ActionResult } from "@/lib/actions/posts";

// ------------------------------------------------------------
// Authentication & input validation helpers
// ------------------------------------------------------------
// A small private helper that checks the session and throws an error if
// there is none. We call this at the top of every action.

export async function verifyAdmin(): Promise<void> {
  const session = await auth();

  // If there's no session, we throw an Error.
  // In Server Actions, throwing stops execution immediately —
  // the calling component's try/catch will catch it.
  if (!session) {
    throw new Error("Unauthorized");
  }
}

// Handles errors thrown inside Server Actions consistently.
// Two cases:
//   - "Unauthorized" thrown by verifyAdmin() → return 401-style message
//   - Anything else → log it server-side, return a generic message to the client
//     (we never expose raw error details to the client — could leak internals)
export function handleActionError(error: unknown, context: string): ActionResult {
  if (error instanceof Error && error.message === "Unauthorized") {
    return { success: false, error: "Unauthorized" };
  }
  console.error(`[${context}]`, error);
  return { success: false, error: "Something went wrong. Please try again." };
}

// Uses Zod v4's built-in prettifyError utility —
// no manual .issues mapping needed
export function formatZodErrors(error: unknown): string {
  return z.prettifyError(error as z.ZodError);
}


// ------------------------------------------------------------

// ------------------------------------------------------------
// Data-related helpers
// ------------------------------------------------------------

// Splits a string or string[] of category names into a clean array.
// Handles both formats since the form sends string[] but we keep the
// logic flexible in case that ever changes.
    export function processCategoryNames(categories: string | string[]): string[] {
  return Array.isArray(categories)
    ? categories.map((c) => c.trim()).filter(Boolean)
    : (categories ?? "").split(",").map((c) => c.trim()).filter(Boolean);
}

// Builds the Prisma connectOrCreate array for categories.
    export function buildCategoryConnectOrCreate(categoryNames: string[]) {
  return categoryNames.map((name) => ({
    where: { name },
    create: { name, color: "#6366f1" },
  }));
}

// Maps form section objects to the shape Prisma expects, adding order index.
export function buildSectionData(sections: { title?: string; content?: string; imageUrl?: string; imageDescription?: string }[]) {
  return sections.map((section, index) => ({
    order: index,
    title: section.title ?? null,
    content: section.content ?? null,
    imageUrl: section.imageUrl || null,
    imageDescription: section.imageDescription ?? null,
  }));
}

// Builds the Prisma resourceType relation, or returns undefined if none provided.
export function buildResourceTypeRelation(resourceType?: string) {
  return resourceType
    ? { connectOrCreate: { where: { name: resourceType }, create: { name: resourceType } } }
    : undefined;
}


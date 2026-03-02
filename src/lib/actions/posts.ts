// src/lib/actions/posts.ts
//
// Server Actions for all post-related write operations

"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPostSchema,
  createCategorySchema,
  createResourceTypeSchema,
  type CreatePostData,
  type CreateCategoryData,
  type CreateResourceTypeData,
} from "@/lib/validators/post";

// We define what the response is of a server action, this can then be rendered on the client side
type ActionResult =
  | { success: true; slug?: string }   // slug is for redirect after create
  | { success: false; error: string };
  
// ------------------------------------------------------------
// HELPER: verifyAdmin
// ------------------------------------------------------------
// A small private helper that checks the session and throws an error if
// there is none. We call this at the top of every action.

async function verifyAdmin(): Promise<void> {
  const session = await auth();

  // If there's no session, we throw an Error.
  // In Server Actions, throwing stops execution immediately —
  // the calling component's try/catch will catch it.
  if (!session) {
    throw new Error("Unauthorized");
  }
}

// Uses Zod v4's built-in prettifyError utility —
// no manual .issues mapping needed
function formatZodErrors(error: unknown): string {
  return z.prettifyError(error as z.ZodError);
}

// Handles errors thrown inside Server Actions consistently.
// Two cases:
//   - "Unauthorized" thrown by verifyAdmin() → return 401-style message
//   - Anything else → log it server-side, return a generic message to the client
//     (we never expose raw error details to the client — could leak internals)
function handleActionError(error: unknown, context: string): ActionResult {
  if (error instanceof Error && error.message === "Unauthorized") {
    return { success: false, error: "Unauthorized" };
  }
  console.error(`[${context}]`, error);
  return { success: false, error: "Something went wrong. Please try again." };
}






// ------------------------------------------------------------
// ACTION: createPost
// ------------------------------------------------------------

export async function createPost(data: CreatePostData): Promise<ActionResult> {
  try {
    // 1. Verify the admin session before doing anything else
    await verifyAdmin();

    // 2. Validate the incoming data with our Zod schema.
    // safeParse() is like parse() but instead of throwing on failure,
    // it returns an object: { success: true, data: ... } or { success: false, error: ... }
    const validated = createPostSchema.safeParse(data);

    if (!validated.success) {
      return { success: false, error: `Validation failed: ${formatZodErrors(validated.error)}` };
    }

    // If our check passed, we can safely use the validated data
    const {
      title,
      slug,
      summary,
      type,
      status,
      readingTime,
      thumbnailUrl,
      keyTakeaways,
      sections,
      categories,
      resourceType,
      resourceCost,
      resourceRating,
      resourceLink,
    } = validated.data;

    // 3. Process categories
    const categoryNames: string[] = Array.isArray(categories)
      ? categories.map((c) => c.trim()).filter(Boolean)
      : (categories ?? "")
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean);
    // .filter(Boolean) removes any empty strings that result from trailing commas or extra spaces e.g. "tech, , productivity,"

    // 4. Build the Prisma `categories` relation using `connectOrCreate`.
    // connectOrCreate means: "find an existing category with this name  and connect it, OR create a new one if it doesn't exist yet."
    // This way we never get duplicate categories in the DB.
    const categoryConnectOrCreate = categoryNames.map((name) => ({
      where: { name },   // look for existing category with this name
      create: { name, color: "#6366f1" }, // create with default color if not found
    }));


    // 5. Process sections.
    // Your ContentEditor uses `para.text` for content, but your Prisma
    // Section model uses `content`. We map between them here.
    const sectionData = sections.map((section, index) => ({
      order: index,
      title: section.title ?? null,
      content: section.content ?? null,   // <-- maps from form's "text" field
      imageUrl: section.imageUrl || null,
      imageDescription: section.imageDescription ?? null,
    }));

    // 6. Handle resource type.
    // If a resourceType name was provided, we connectOrCreate it.
    const resourceTypeRelation = resourceType
      ? {
          connectOrCreate: {
            where: { name: resourceType },
            create: { name: resourceType },
          },
        }
      : undefined;

    // 7. Write everything to the database in a single Prisma `create` call.
    // This is an atomic operation — if any part fails (e.g. a section
    // fails to insert), the ENTIRE operation is rolled back automatically.
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        summary,
        type,
        status,
        readingTime,
        thumbnailUrl: thumbnailUrl || null,
        keyTakeaways,
        resourceCost: resourceCost ?? null,
        resourceRating: resourceRating ?? null,
        resourceLink: resourceLink || null,

        // Nested write: create all sections in the same operation
        sections: {
          create: sectionData,
        },

        // Nested write: connect or create all categories
        categories: {
          connectOrCreate: categoryConnectOrCreate,
        },

        // Nested write: connect or create the resource type (or nothing if undefined)
        resourceType: resourceTypeRelation,
      },
    });

    // Step 8: Revalidate only what's necessary.
    // We only revalidate the public list page if the post is published —
    // a draft won't appear there anyway.
    if (status === "PUBLISHED") {
      revalidatePath(type === "BLOG" ? "/blogs" : "/resources");
      revalidatePath(
        `/${type === "BLOG" ? "blogs" : "resources"}/${post.slug}`
      );
    }
    revalidatePath("/admin");

    return { success: true, slug: post.slug };

  } catch (error) {
    return handleActionError(error, "createPost");
  }
}

// ------------------------------------------------------------
// ACTION: createCategory
// ------------------------------------------------------------
// Separate action for creating a new category with a name and color.
// Called from the category picker UI in the MetadataPanel.

export async function createCategory(data: CreateCategoryData): Promise<ActionResult> {
  try {
    await verifyAdmin();

    const validated = createCategorySchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: `Validation failed: ${formatZodErrors(validated.error)}` };
    }

    const { name, color } = validated.data;

    // upsert: update if exists, create if not.
    await prisma.category.upsert({
      where: { name },
      update: { color },
      create: { name, color },
    });

    // Revalidate admin so the new category appears in the list immediately
    revalidatePath("/admin");

    return { success: true };

  } catch (error) {
    return handleActionError(error, "createCategory");
  }
}

// ------------------------------------------------------------
// ACTION: createResourceType
// ------------------------------------------------------------
// Separate action for creating a new resource type.
// Called from the resource type selector UI in the MetadataPanel.

export async function createResourceType(
  data: CreateResourceTypeData
): Promise<ActionResult> {
  try {
    await verifyAdmin();

    const validated = createResourceTypeSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: `Validation failed: ${formatZodErrors(validated.error)}` };
    }

    const { name } = validated.data;

    await prisma.resourceType.upsert({
      where: { name },
      update: {},   // nothing to update — name is the only field
      create: { name },
    });

    revalidatePath("/admin");

    return { success: true };

  } catch (error) {
    return handleActionError(error, "createResourceType");
  }
}

// ------------------------------------------------------------
// ACTION: deletePost
// ------------------------------------------------------------
// Deletes a post by id. Prisma's onDelete: Cascade on Section means
// all related sections are automatically deleted too.
// Categories and ResourceType are NOT deleted — they're shared across
// posts and should persist independently.

export async function deletePost(id: number): Promise<ActionResult> {
  try {
    await verifyAdmin();

    await prisma.post.delete({
      where: { id },
    });

    // Revalidate the dashboard so the deleted post disappears immediately,
    // and the public pages so they no longer serve the deleted content
    revalidatePath("/admin");
    revalidatePath("/blogs");
    revalidatePath("/resources");

    return { success: true };

  } catch (error) {
    return handleActionError(error, "deletePost");
  }
}
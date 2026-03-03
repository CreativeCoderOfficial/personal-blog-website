// src/lib/actions/posts.ts
//
// Server Actions for all post-related write operations

"use server";


import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  createPostSchema,
  createCategorySchema,
  createResourceTypeSchema,
  updatePostSchema,
  type CreatePostData,
  type CreateCategoryData,
  type CreateResourceTypeData,
  type UpdatePostData,
} from "@/lib/validators/post";
import { verifyAdmin, formatZodErrors, handleActionError } from "./posts_helper_functions";
import { buildCategoryConnectOrCreate, buildSectionData, processCategoryNames, buildResourceTypeRelation } from "./posts_helper_functions";

// We define what the response is of a server action, this can then be rendered on the client side
export type ActionResult =
  | { success: true; slug?: string }   // slug is for redirect after create
  | { success: false; error: string };
  


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
    const categoryNames = processCategoryNames(categories);
    const categoryConnectOrCreate = buildCategoryConnectOrCreate(categoryNames);
    
    // 4. Process sections 
    const sectionData = buildSectionData(sections);

    // 5. Handle resource type — same as createPost
    const resourceTypeRelation = buildResourceTypeRelation(resourceType);

    // 6. Write everything to the database in a single Prisma `create` call.
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
// ACTION: updatePost
// ------------------------------------------------------------
// Updates an existing post by id.
// Strategy for sections: delete all existing ones and re-insert.
// This avoids complex diffing logic — order may have changed, sections
// may have been added or removed. A clean replace is simpler and correct.
// Strategy for categories: disconnect all, then reconnect with connectOrCreate.
// Same reasoning — simpler than tracking which were added/removed.
// All three operations (delete sections, reconnect categories, update post)
// are wrapped in a prisma.$transaction so they succeed or fail together.

export async function updatePost(data: UpdatePostData): Promise<ActionResult> {
  try {
    // 1. Verify admin session
    await verifyAdmin();

    // 2. Validate with our update schema (same as create, but with id added)
    const validated = updatePostSchema.safeParse(data);
    if (!validated.success) {
      return { success: false, error: `Validation failed: ${formatZodErrors(validated.error)}` };
    }

    const {
      id,
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

    // 3. Check the post actually exists before trying to update it
    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Post not found" };
    }

    // 4. Process categories 
    const categoryNames = processCategoryNames(categories);
    const categoryConnectOrCreate = buildCategoryConnectOrCreate(categoryNames);
    
    // 5. Process sections 
    const sectionData = buildSectionData(sections);

    // 6. Handle resource type — same as createPost
    const resourceTypeRelation = buildResourceTypeRelation(resourceType);

    // 7. Run all mutations in a single transaction.
    const [, , updatedPost] = await prisma.$transaction([

      // Delete all existing sections for this post.
      // We re-insert them fresh below so we don't have to diff order changes.
      prisma.section.deleteMany({
        where: { postId: id },
      }),

      // Disconnect ALL current categories from this post.
      // "set: []" means "replace the current relation set with an empty set",
      // which effectively removes all category connections without deleting the category records themselves.
      prisma.post.update({
        where: { id },
        data: { categories: { set: [] } },
      }),

      // Step C: Update the post with all new values, and re-create sections and re-connect categories in the same operation.
      prisma.post.update({
        where: { id },
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

          // Re-create all sections from scratch
          sections: {
            create: sectionData,
          },

          // Re-connect categories (connectOrCreate handles new ones)
          categories: {
            connectOrCreate: categoryConnectOrCreate,
          },

          // Update or clear resource type
          resourceType: resourceTypeRelation,
        },
      }),
    ]);

    // 8. Revalidate paths — both old slug and new slug in case it changed.
    // We revalidate the old slug (from `existing`) in case it was renamed,
    // so the old URL doesn't serve stale cached content.
    revalidatePath("/admin");
    revalidatePath("/admin/posts");

    if (status === "PUBLISHED" || existing.status === "PUBLISHED") {
      // Revalidate both old and new slug in case slug changed
      const basePath = type === "BLOG" ? "/blogs" : "/resources";
      revalidatePath(basePath);
      revalidatePath(`${basePath}/${slug}`);
      revalidatePath(`${basePath}/${existing.slug}`);
    }

    return { success: true, slug: updatedPost.slug };

  } catch (error) {
    return handleActionError(error, "updatePost");
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
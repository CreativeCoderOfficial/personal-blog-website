// src/lib/validators/post.ts
//
// Defines the shape and rules for a valid "create post" payload.
// It specifies what the form must send
// and what the Server Action expects to receive.
//
// Zod serves two purposes here:
//   1. Runtime validation — rejects invalid data so invalid database queries don't run
//   2. Type inference — generates the TypeScript type automatically

import { z } from "zod";

// A Zod schema for a single section (paragraph block in the form)
export const sectionSchema = z.object({
  // title and content are optional — a section can be image-only
  title: z.string().optional(),

  // .optional() means the field can be undefined (not provided at all)
  content: z.string().optional(),

  imageUrl: z.string().optional().or(z.literal("")),
  // ^ .or(z.literal("")) allows empty string in addition to a valid URL or undefined.
  //   This is important because the form initializes imageUrl as ""

  imageDescription: z.string().optional(),
});

// The main schema for creating a post
export const createPostSchema = z.object({

  // --- Core fields ---

  title: z.string().min(1, "Title is required"),
  // .min(1) means at least 1 character — rejects empty strings

  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens only"),
  // .regex() enforces URL-safe slug format e.g. "my-new-post" not "My New Post"

  summary: z.string().min(1, "Summary is required"),

  type: z.enum(["BLOG", "RESOURCE"]),
  // z.enum() restricts to exact known values 

  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  // .default() means if the field is missing, use "DRAFT" automatically

  readingTime: z.coerce.number().int().min(1, "Reading time must be at least 1 minute"),
  // z.coerce.number() converts incoming strings to numbers automatically.
  // This is important because HTML inputs always return strings — even type="number".
  // .int() ensures it's a whole number (no decimals)

  thumbnailUrl: z.string().optional().or(z.literal("")),

  // --- Content fields ---

  keyTakeaways: z.array(z.string()).default([]),
  // z.array() wraps another schema — an array of strings here

  sections: z.array(sectionSchema).default([]),
  // An array of section objects, each validated by sectionSchema above

  // --- Category ---

  categories: z.array(z.string()).default([]),
  // Comma-separated string from the form e.g. "tech, productivity"
  // We'll split and process this in the Server Action

  // --- Resource-only fields (all optional since blogs don't use them) ---

  resourceType: z.string().optional(),
  resourceCost: z.coerce.number().optional(),
  resourceRating: z.coerce.number().min(0).max(5).optional(),
  resourceLink: z.url("Must be a valid URL").optional().or(z.literal("")),
});


export type CreatePostData = z.infer<typeof createPostSchema>;

// updatePostSchema extends createPostSchema with an id field.
// .extend() means all existing fields are inherited automatically
export const updatePostSchema = createPostSchema.extend({
  id: z.number().int().positive(),
});

export type UpdatePostData = z.infer<typeof updatePostSchema>;

// --- Category Schema ---
// Used by the separate createCategory Server Action
export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  // Validates a CSS hex color e.g. #ff6600
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color e.g. #ff6600"),
});

export type CreateCategoryData = z.infer<typeof createCategorySchema>;

// --- Resource Type Schema ---
// Used by the separate createResourceType Server Action
export const createResourceTypeSchema = z.object({
  name: z.string().min(1, "Resource type name is required"),
});

export type CreateResourceTypeData = z.infer<typeof createResourceTypeSchema>;
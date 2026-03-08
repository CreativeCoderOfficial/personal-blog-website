// src/types/admin.ts
//
// Admin-only types — used exclusively by admin pages, PostForm,
// and admin sub-components (MetadataPanel, ContentEditor, selectors).

import { Category } from "@/types/post";


// Both names now refer to the same type.
export type { Category as CategoryOption };

// A resource type option used in the admin form selector
export interface ResourceTypeOption {
  name: string;
}

// The shape of the controlled form state shared between PostForm,
// MetadataPanel, and ContentEditor.
// All fields are strings because HTML inputs always return strings —
// Zod coerces numbers (readingTime, resourceCost, resourceRating) on submit.
// Empty string is the valid "empty" value — never null or undefined.
export interface PostFormData {
  title: string;
  slug: string;
  summary: string;
  thumbnailUrl: string;
  readingTime: string;
  status: "DRAFT" | "PUBLISHED";
  categories: string[];
  resourceType: string;
  resourceLink: string;
  resourceCost: string;
  resourceRating: string;
}

// One content section in the form — matches the Prisma Section model
// minus the DB-only fields (id, postId, order).
// Used by both PostForm (state) and ContentEditor (props).
export interface SectionItem {
  title: string;
  content: string;
  imageUrl: string;
}

// The shape of a post as fetched from Prisma and passed to PostForm
// as initialData in edit mode. Fields mirror the DB schema but sections
// are stripped of DB-only fields (id, postId, order).
export interface InitialPostData {
  id: number;
  title: string;
  slug: string;
  summary: string;
  type: "BLOG" | "RESOURCE";
  status: "DRAFT" | "PUBLISHED";
  readingTime: number;
  thumbnailUrl: string | null;
  keyTakeaways: string[];
  sections: {
    title: string | null;
    content: string | null;
    imageUrl: string | null;
    imageDescription: string | null;
  }[];
  categories: { name: string }[];
  resourceType: { name: string } | null;
  resourceCost: number | null;
  resourceRating: number | null;
  resourceLink: string | null;
}
// src/types/post.ts
//
// Public-facing post types — used by public pages, the API route,
// usePostFetcher, and public-facing components.

import { PostType } from "@prisma/client";

// A category as it comes from the DB
export interface Category {
  name: string;
  color: string;
}

// Base fields shared by both BlogPost and ResourcePost
export interface BasePost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  readingTime: number;
  thumbnailUrl: string | null;
  createdAt: string; // Dates serialized to strings for Client Components
  updatedAt: string;
  categories: Category[];
}

// Blog post — only adds the type discriminator
export interface BlogPost extends BasePost {
  type: "BLOG";
}

// Resource post — adds resource-specific fields on top of BasePost
export interface ResourcePost extends BasePost {
  type: "RESOURCE";
  resourceLink: string | null;
  resourceCost: number | null;
  resourceRating: number | null;
  resourceType?: { name: string } | null;
}

// Union type used in components that handle both types.
// The `type` field acts as a discriminator — TypeScript can narrow
// from PostItem to BlogPost or ResourcePost by checking post.type
export type PostItem = BlogPost | ResourcePost;
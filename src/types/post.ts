// types/post.ts
import { PostType } from "@prisma/client";


// Category type:
export interface Category {
  name: string;
  color: string;
}

export interface PostFilters {
  search: string;
  categories: string[];
  dateFrom: string;
  dateTo: string;
  resourceType: string[];
}

// 1. The Base Interface
export interface BasePost {
  id: number;
  slug: string;
  title: string;
  summary: string;
  readingTime: number;
  thumbnailUrl: string | null;
  createdAt: string; // We use string because we serialize Dates from the server
  updatedAt: string;
  
  // Relations
  categories: Category[];
}

// 2. The Blog Post Interface
export interface BlogPost extends BasePost {
  type: "BLOG"; 
}

// 3. The Resource Post Interface
// Extends BasePost and adds resource-specific fields
export interface ResourcePost extends BasePost {
  type: "RESOURCE"; // Literal type! This is the "Discriminator"
  resourceLink: string | null;
  resourceCost: number | null;
  resourceRating: number | null;
  resourceType?: { name: string } | null;
}

// 4. The Union Type
// This is what we use in components.
// It means "This variable is EITHER a Blog OR a Resource"
export type PostItem = BlogPost | ResourcePost;

// The shape of the controlled form state shared between PostForm,
// MetadataPanel, and ContentEditor.
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

// The shape of a category coming from the DB
export interface CategoryOption {
  name: string;
  color: string;
}

// The shape of a resource type coming from the DB
export interface ResourceTypeOption {
  name: string;
}
// src/app/admin/posts/edit/[id]/page.tsx
//
// Server Component — fetches the post and passes it to PostForm as initialData.
// Mirrors the pattern in new/page.tsx, with two additions:
//   1. Parses and validates the [id] URL param
//   2. Fetches the specific post by id, including all its relations

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: PageProps) {
  const { id } = await params;

  const postId = parseInt(id, 10);
  if (isNaN(postId)) notFound();

  // Fetch the post with all relations the form needs.
  // If the post doesn't exist, trigger notFound() 
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      // We only select the fields InitialPostData expects —
      // no need to fetch section ids or postIds since the form doesn't use them
      sections: {
        select: {
          title: true,
          content: true,
          imageUrl: true,
          imageDescription: true,
        },
        orderBy: { order: "asc" },
      },
      categories: {
        select: { name: true },
      },
      resourceType: {
        select: { name: true },
      },
    },
  });

  if (!post) notFound();

  // Fetch all available categories and resource types for the form selectors —
  // same as new/page.tsx
  const categories = await prisma.category.findMany({
    select: { name: true, color: true },
    orderBy: { name: "asc" },
  });

  const resourceTypes = await prisma.resourceType.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

  return (
    <PostForm
      mode="edit"
      initialData={post}
      categories={categories}
      resourceTypes={resourceTypes}
    />
  );
}
// src/app/admin/posts/new/page.tsx
//
// Server Component — its only job is to fetch the data that the form
// needs (the most recent list of categories and resource types) and pass them as props.

import { prisma } from "@/lib/prisma";
import PostForm from "@/components/admin/PostForm";

export default async function NewPostPage() {

  // Fetch all existing categories — we need name AND color so the
  // CategorySelector can style each toggle button with its own color
  const categories = await prisma.category.findMany({
    select: { name: true, color: true },
    orderBy: { name: "asc" },
  });

  // Fetch all existing resource types — name only, that's all we need
  const resourceTypes = await prisma.resourceType.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  });

  // Pass the data down to the Client Component as plain props.
  // Prisma returns plain objects so no serialization needed here
  // (unlike Dates, which would need .toISOString())
  return (
    <PostForm
      mode="create"
      categories={categories}
      resourceTypes={resourceTypes}
    />
  );
}
// src/app/admin/page.tsx
//
// Server Component — fetches ALL posts (including drafts) from Prisma
// and passes them to the Client Component for filtering and display.
//
// We include categories so the filter panel can show category options
// and so ContentCard can render the colored category pills.

import { prisma } from "@/lib/prisma";
import AdminDashboardContainer from "@/components/admin/AdminDashboardContainer";
import { PostItem } from "@/types/post";

export default async function AdminDashboardPage() {

  // Fetch first 12 posts, ALL categories, and ALL resource types in parallel.
  // Promise.all runs all three queries simultaneously instead of one after another
  const [postsData, allCategories, allResourceTypes] = await Promise.all([
    prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      include: { categories: true, resourceType: true },
    }),
    // Fetch ALL categories regardless of how many posts are loaded —
    // so the filter panel always shows the complete list from the start
    prisma.category.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    }),
    // Same for resource types
    prisma.resourceType.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ]);


  // Serialize dates — Prisma returns Date objects but Client Components
  // only accept plain serializable values (strings, numbers, etc.)
  const initialPosts: (PostItem & { status: string })[] = postsData.map((post) => {
    // Base fields shared by both types
    const base = {
      id: post.id,
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      readingTime: post.readingTime,
      thumbnailUrl: post.thumbnailUrl,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      // status is admin-only — we add it here even though PostItem
      // doesn't declare it, the container accesses it via the raw data
      categories: post.categories.map((c) => ({
        name: c.name,
        color: c.color,
      })),
      status: post.status,
    };

    if (post.type === "RESOURCE") {
      return {
        ...base,
        type: "RESOURCE" as const,
        resourceLink: post.resourceLink,
        resourceCost: post.resourceCost,
        resourceRating: post.resourceRating,
        resourceType: post.resourceType ?? null,
      };
    }

    return { ...base, type: "BLOG" as const };
  });

  // We also pass status separately since PostItem doesn't include it —
  // the container needs it for the type toggle filtering and status badge
  const statuses = Object.fromEntries(
    postsData.map((p) => [p.id, p.status])
  );

  return (
    <AdminDashboardContainer
      initialPosts={initialPosts}
      allCategoryOptions={allCategories.map((c) => c.name)}
      allResourceTypeOptions={allResourceTypes.map((rt) => rt.name)}
    />
  );
}
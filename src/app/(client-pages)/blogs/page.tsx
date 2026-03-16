import { prisma } from "@/lib/prisma";
import { PostStatus, PostType } from "@prisma/client";
import PageHeader from "@/components/general/PageHeader";
import BlogsContainer from "./BlogsContainer";
import { BlogPost } from "@/types/post";
import PageWrapper from "@/components/general/PageWrapper";

// This ensures the page is always fresh when you reload.
// Without this, Next.js might cache the list and not show new posts immediately.
export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  // 1. Fetch Data Directly from Database
  // Since this is a Server Component, we can use 'prisma' directly!
  const [postsData, categoriesData] = await Promise.all([
    prisma.post.findMany({
      where: { type: PostType.BLOG, status: PostStatus.PUBLISHED },
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { categories: true },
    }),
    prisma.category.findMany({
      select: { name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // 2. Data Serialization (The "Bridge")
  // We must convert the raw Database objects into the 'BlogPost' type 
  // that our Client Component expects.
  const initialPosts: BlogPost[] = postsData.map((post) => ({
    ...post,
    // We explicitly set the type to satisfy our Discriminated Union
    type: "BLOG", 
    // Convert Date objects to Strings (Crucial!)
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }));


  const categoryNames = categoriesData.map((cat) => cat.name);

  return (
    <PageWrapper
      title={<>Blog <span className="text-accent-orange">Posts</span></>}
      subtitle="Insights, tutorials, and thoughts on technology, productivity, and personal development."
    >
      <BlogsContainer initialPosts={initialPosts} categories={categoryNames} />
    </PageWrapper>
  );
}
import { prisma } from "@/lib/prisma";
import { PostStatus, PostType } from "@prisma/client";
import PageHeader from "@/components/general/PageHeader";
import BlogsContainer from "./BlogsContainer";
import { BlogPost } from "@/types/post";

// This ensures the page is always fresh when you reload.
// Without this, Next.js might cache the list and not show new posts immediately.
export const dynamic = "force-dynamic";

export default async function BlogsPage() {
  // 1. Fetch Data Directly from Database
  // Since this is a Server Component, we can use 'prisma' directly!
  const postsData = await prisma.post.findMany({
    where: {
      type: PostType.BLOG,       
      status: PostStatus.PUBLISHED,
    },
    take: 6, // Must match the 'limit' in your API route
    orderBy: { createdAt: "desc" },
    include: {
      categories: true, // Join with Categories table
    },
  });

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

  return (
    <main className="min-h-screen bg-main">
      {/* 3. Render Static Content */}
      {/* The Header is static, so we render it here on the server */}
      <PageHeader 
        title={<>Blog <span className="text-accent-orange">Posts</span></>}
        subtitle="Insights, tutorials, and thoughts on technology."
      />

      {/* 4. Hand off to Client Component */}
      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24">
         <BlogsContainer initialPosts={initialPosts} />
      </div>
    </main>
  );
}
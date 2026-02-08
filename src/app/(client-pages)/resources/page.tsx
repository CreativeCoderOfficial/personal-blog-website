import { prisma } from "@/lib/prisma";
import { PostStatus, PostType } from "@prisma/client";
import PageHeader from "@/components/general/PageHeader";
import ResourcesContainer from "./ResourcesContainer";
import { ResourcePost } from "@/types/post";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  
  // 1. Fetch Posts (Resources only)
  const postsData = await prisma.post.findMany({
    where: {
      type: PostType.RESOURCE,
      status: PostStatus.PUBLISHED,
    },
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      categories: true,
      resourceType: true, // Crucial: We need the type name (e.g. "Video")
    },
  });

  // 2. Fetch Available Resource Types (for the Filter Buttons)
  // We want a list of names like ["App", "Video", "Tool"]
  const resourceTypesData = await prisma.resourceType.findMany({
    select: { name: true },
    orderBy: { name: 'asc' }
  });
  
  // Convert [{name: 'App'}, {name: 'Video'}] -> ['App', 'Video']
  const resourceTypeNames = resourceTypesData.map(rt => rt.name);

  // 3. Serialize Data
  const initialPosts: ResourcePost[] = postsData.map((post) => ({
    ...post,
    type: "RESOURCE",
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    resourceLink: post.resourceLink,
    resourceCost: post.resourceCost,
    resourceRating: post.resourceRating,
    resourceType: post.resourceType, 
  }));

  return (
    <main className="min-h-screen bg-main">
      <PageHeader 
        title={<>Explore <span className="text-accent-orange">Resources</span></>}
        subtitle="Curated tools and templates."
      />

      <div className="container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24">
         <ResourcesContainer 
           initialPosts={initialPosts} 
           resourceTypes={resourceTypeNames} 
         />
      </div>
    </main>
  );
}
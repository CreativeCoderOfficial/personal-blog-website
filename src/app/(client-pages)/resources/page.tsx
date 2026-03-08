import { prisma } from "@/lib/prisma";
import { PostStatus, PostType } from "@prisma/client";
import PageHeader from "@/components/general/PageHeader";
import ResourcesContainer from "./ResourcesContainer";
import { ResourcePost } from "@/types/post";
import PageWrapper from "@/components/general/PageWrapper";

export const dynamic = "force-dynamic";

export default async function ResourcesPage() {
  
  // 1. Fetch Resource posts and all filter options 
  const [postsData, resourceTypesData, categoriesData] = await Promise.all([
  prisma.post.findMany({
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
  }),


  prisma.resourceType.findMany({
    select: { name: true },
    orderBy: { name: 'asc' }
  }),


  prisma.category.findMany({
    select: { name: true },
    orderBy: { name: "asc" },
  }),
]);

  // Map the names[{name: 'App'}, {name: 'Video'}] -> ['App', 'Video']
  const categoryNames = categoriesData.map((c) => c.name);
  const resourceTypeNames = resourceTypesData.map(rt => rt.name);

  // 2. Serialize Data
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
    <PageWrapper
      title={<>Explore <span className="text-accent-orange">Resources</span></>}
      subtitle="Curated tools and templates."
    >
      <ResourcesContainer 
        initialPosts={initialPosts} 
        categories={categoryNames}
        resourceTypes={resourceTypeNames} 
      />
    </PageWrapper>
  );
}
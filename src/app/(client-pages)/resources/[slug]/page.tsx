import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

// --- CUSTOM COMPONENTS ---
import PostLayout from "@/components/posts/specific/PostLayout";
import PostHeader from "@/components/posts/specific/PostHeader";
import ContentRenderer from "@/components/posts/specific/ContentRenderer";
import SummaryBox from "@/components/posts/specific/SummaryBox";
import ResourceActionBox from "@/components/posts/specific/ResourceActionBox";


// --- CONFIGURATION ---
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ slug: string }>;
}

// --- 1. STATIC GENERATION ---
export async function generateStaticParams() {
  const resources = await prisma.post.findMany({
    where: { 
      status: "PUBLISHED",
      type: "RESOURCE" 
    },
    select: { slug: true },
  });
  return resources.map((post) => ({ slug: post.slug }));
}

// --- 2. METADATA ---
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, summary: true },
  });
  if (!post) return { title: "Resource Not Found" };
  
  return {
    title: `${post.title} | My Resources`,
    description: post.summary,
  };
}

// --- 3. THE PAGE COMPONENT ---
export default async function SingleResourcePage({ params }: PageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      categories: true,
      resourceType: true,
      sections: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!post) notFound();

  // Prepare Categories (Just the categories, NO merging with ResourceType)
const categoryNames = post.categories.map(c => c.name);

  // Group the sidebar items (Action Box + Summary)
  const SidebarContent = (
    <>
      <ResourceActionBox 
        resourceLink={post.resourceLink}
        resourceType={post.resourceType?.name || null}
        resourceCost={post.resourceCost}
        resourceRating={post.resourceRating}
      />
      <SummaryBox 
        summary={post.summary}
        takeaways={post.keyTakeaways}
        readingTime={post.readingTime}
      />
    </>
  );

  return (
    <PostLayout
      header={
        <PostHeader 
          title={post.title}
          categories={categoryNames}
          createdAt={post.createdAt.toISOString()}
          thumbnailUrl={post.thumbnailUrl || ""}
          backHref="/resources"
          backLabel="Back to Resources"
        />
      }
      mobileTopContent={SidebarContent}
      sidebar={SidebarContent}
      content={<ContentRenderer sections={post.sections} />}
    />
  );
}
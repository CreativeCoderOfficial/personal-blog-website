import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

// --- CUSTOM COMPONENTS ---
import PostLayout from "@/components/posts/specific/PostLayout";
import PostHeader from "@/components/posts/specific/PostHeader";
import ContentRenderer from "@/components/posts/specific/ContentRenderer";
import SummaryBox from "@/components/posts/specific/SummaryBox";

// Rerender the Server-side component every week (should be okay, since once posted, the post won't change normally )
export const revalidate = 604800; 
// Next.js 15 introduced a change where dynamic route params are now passed as Promises to support async data fetching at the page level.
// This means that instead of receiving `params` as a plain object, we now receive it as a Promise that resolves to the params object.
interface PageProps {
  params: Promise<{ slug: string }>;
}

// This function generates the static paths for all blog posts based on their slugs. 
// Next.js will use this to pre-render pages at build time.
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}

// We need to generate this seperately since metadata is in the <head>
// and so when generating the BlogPage, we don't have access to the post data yet.
// Next.js needs to determine the Title/Description before it starts streaming the Body content.
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    select: { title: true, summary: true },
  });
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | My Blog`,
    description: post.summary,
  };
}

// Builds the single blog post page. The `slug` is now accessed by awaiting the `params` Promise.
export default async function SingleBlogPage({ params }: PageProps) {
  // Slug is now a Promise
  const { slug } = await params;

  // Fetch Data
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      categories: true,
      sections: {
        orderBy: { order: "asc" }, // Keep sections in correct reading order
      },
    },
  });

  if (!post) notFound(); // If no post is found, trigger a 404 page

  // Data Prep
  const categoryNames = post.categories.map(c => c.name); 
// Reusable Sidebar Component
  const SidebarContent = (
    <SummaryBox 
      summary={post.summary}
      takeaways={post.keyTakeaways}
      readingTime={post.readingTime}
    />
  );

  return (
    <PostLayout
      // Slot 1: Header
      header={
        <PostHeader 
          title={post.title}
          categories={categoryNames}
          createdAt={post.createdAt.toISOString()}
          thumbnailUrl={post.thumbnailUrl || ""}
        />
      }
      // Slot 2: Mobile Top (Just summary for blogs)
      mobileTopContent={SidebarContent}
      // Slot 3: Desktop Sidebar (Same summary)
      sidebar={SidebarContent}
      // Slot 4: Main Content
      content={<ContentRenderer sections={post.sections} />}
    />
  );
}
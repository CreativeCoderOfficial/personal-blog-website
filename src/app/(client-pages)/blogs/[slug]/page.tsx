import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

// --- CUSTOM COMPONENTS ---
import PostHeader from "@/components/generic/PostHeader";
import SummaryBox from "@/components/generic/SummaryBox";
import DonateBox from "@/components/generic/DonateBox";

// --- CONFIGURATION ---
export const revalidate = 24 * 60 * 60; // Revalidate every 24 hours 

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
  const categoryList = post.categories.map(c => c.name); 

  return (
    <main className="min-h-screen bg-main pt-8 pb-24">
      <article className="container max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="lg:col-span-8">
            
            {/* 1. Header */}
            <PostHeader 
              title={post.title}
              // If your component expects objects, remove .map() above and pass post.categories
              categories={categoryList} 
              createdAt={post.createdAt.toISOString()}
              thumbnailUrl={post.thumbnailUrl || ""}
            />

            {/* 2. Mobile Summary (Visible only on small screens) */}
            <div className="block lg:hidden mb-10">
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                readingTime={post.readingTime} 
              />
            </div>

            {/* 3. The Content (Replacing ContentRenderer with Markdown Logic) */}
            <div className="space-y-12 mt-8">
              {post.sections.map((section) => (
                <div key={section.id} className="group">
                  
                  {/* Section Title */}
                  {section.title && (
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6 mt-12">
                      {section.title}
                    </h2>
                  )}

                  {/* Section Image */}
                  {section.imageUrl && (
                    <figure className="my-8">
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border-subtle">
                        <Image 
                          src={section.imageUrl} 
                          alt={section.imageDescription || "Illustration"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {section.imageDescription && (
                        <figcaption className="text-center text-xs text-text-secondary mt-3 italic">
                          {section.imageDescription}
                        </figcaption>
                      )}
                    </figure>
                  )}

                  {/* Markdown Content */}
                  {section.content && (
                    <div className="
                      prose prose-lg prose-invert max-w-none
                      prose-headings:text-text-primary prose-headings:font-bold
                      prose-p:text-text-secondary prose-p:leading-relaxed
                      prose-a:text-accent-purple prose-a:no-underline hover:prose-a:underline
                      prose-strong:text-text-primary
                      prose-li:text-text-secondary
                      prose-code:text-accent-orange prose-code:bg-accent-orange/10 prose-code:px-1 prose-code:rounded
                    ">
                      <ReactMarkdown>{section.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* 4. Mobile Donate (Visible only on small screens) */}
            <div className="block lg:hidden mt-12">
              <DonateBox />
            </div>
          </div>

          {/* --- RIGHT COLUMN (Sticky Sidebar) --- */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 flex flex-col gap-6 mt-20">
              {/* Sticky Summary */}
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                readingTime={post.readingTime}
              />
              
              {/* Sticky Donate */}
              <DonateBox />
            </div>
          </div>

        </div>
      </article>
    </main>
  );
}
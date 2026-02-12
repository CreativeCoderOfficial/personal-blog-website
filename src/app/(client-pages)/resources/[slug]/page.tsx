import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

// --- CUSTOM COMPONENTS ---
import PostHeader from "@/components/posts/specific/PostHeader";
import SummaryBox from "@/components/posts/specific/SummaryBox";
import DonateBox from "@/components/posts/specific/DonateBox";
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
              categories={categoryList} 
              createdAt={post.createdAt.toISOString()}
              thumbnailUrl={post.thumbnailUrl || ""}
            />

            {/* 2. Mobile Actions (Small Screens Only) */}
            <div className="block lg:hidden mb-10 space-y-8">
              <ResourceActionBox 
                resourceLink={post.resourceLink}
                resourceType={post.resourceType?.name || null}
                resourceCost={post.resourceCost}
                resourceRating={post.resourceRating}
              />
              
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                readingTime={post.readingTime} // 👈 Correct attribute
              />
            </div>

            {/* 3. The Content (Markdown) */}
            <div className="space-y-12 mt-8">
              {post.sections.map((section) => (
                <div key={section.id} className="group">
                  {section.title && (
                    <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6 mt-12">
                      {section.title}
                    </h2>
                  )}

                  {section.imageUrl && (
                    <figure className="my-8">
                      <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border-subtle">
                        <Image 
                          src={section.imageUrl} 
                          alt={section.imageDescription || "Resource Preview"}
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

             {/* 4. Mobile Donate */}
             <div className="block lg:hidden mt-12">
              <DonateBox />
            </div>
          </div>

          {/* --- RIGHT COLUMN (Sticky Sidebar) --- */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 flex flex-col gap-6 mt-20">
              
              {/* 1. The New Resource Box */}
              <ResourceActionBox 
                resourceLink={post.resourceLink}
                resourceType={post.resourceType?.name || null}
                resourceCost={post.resourceCost}
                resourceRating={post.resourceRating}
              />

              {/* 2. Summary */}
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                readingTime={post.readingTime} // 👈 Correct attribute
              />
              
              {/* 3. Donate */}
              <DonateBox />
            </div>
          </div>

        </div>
      </article>
    </main>
  );
}
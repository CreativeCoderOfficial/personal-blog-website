import PostHeader from "@/components/generic/PostHeader";
import SummaryBox from "@/components/generic/SummaryBox";
import DonateBox from "@/components/generic/DonateBox";
import ContentRenderer, { Paragraph } from "@/components/generic/ContentRenderer"; 

// --- MOCK DATA ---
const getPostData = (slug: string) => {
  return {
    id: 101,
    slug: slug,
    title: "The Ultimate Guide to React & Next.js Architecture",
    categories: ["Web Development", "Productivity"],
    readingTime: 12, 
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-03-25T10:00:00Z",
    summary: "In this deep dive, we explore how to structure large-scale Next.js applications for maintainability, speed, and developer happiness.",
    keyTakeaways: [
      "Understand the difference between Server and Client Components",
      "Learn how to organize your folder structure for scalability",
      "Mastering Tailwind CSS theme tokens for consistent design",
      "Best practices for data fetching and caching"
    ],
    // Updated Paragraphs with titles
    paragraphs: [
      {
        id: 1,
        order: 1,
        title: "Why Architecture Matters", // <--- NEW TITLE
        text: "When building modern web applications, the architecture you choose at the beginning often dictates the project's success or failure months down the line. With Next.js 14, we have shifted towards a Server Component first approach.",
        imageUrl: undefined
      },
      {
        id: 2,
        order: 2,
        title: "Managing State Effectively", // <--- NEW TITLE
        text: "One of the biggest challenges developers face is state management. By pushing data fetching to the server, we reduce the amount of JavaScript sent to the client.",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: 3,
        order: 3,
        // Title is optional, so we can skip it
        text: "Furthermore, folder structure plays a crucial role. I recommend grouping features by domain rather than by file type. This 'Colocation' pattern ensures that when you delete a feature, you delete all its related styles, tests, and components in one go.",
        imageUrl: undefined
      }
    ] as Paragraph[]
  };
};

export default function SingleBlogPage({ params }: { params: { slug: string } }) {
  const post = getPostData(params.slug);

  return (
    <main className="min-h-screen bg-main pt-8 pb-24">
      <article className="container max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8">
            <PostHeader 
              title={post.title}
              categories={post.categories}
              createdAt={post.createdAt}
              thumbnailUrl={post.thumbnailUrl}
            />

            <div className="block lg:hidden mb-10">
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                metaBadge={`${post.readingTime} min read`} 
              />
            </div>

            {/* Using Generic ContentRenderer */}
            <ContentRenderer contentBlocks={post.paragraphs} />

            <div className="block lg:hidden mt-12">
              <DonateBox />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 flex flex-col gap-6 mt-20">
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                metaBadge={`${post.readingTime} min read`}
              />
              <DonateBox />
            </div>
          </div>

        </div>
      </article>
    </main>
  );
}
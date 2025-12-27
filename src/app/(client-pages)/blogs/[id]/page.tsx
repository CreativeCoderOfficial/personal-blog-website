import BlogPostHeader from "@/components/blogs/blog-post/BlogPostHeader";
import BlogContent, { Paragraph } from "@/components/blogs/blog-post/BlogContent";
import SummaryBox from "@/components/blogs/blog-post/SummaryBox";
import DonateBox from "@/components/blogs/blog-post/DonateBox";

// --- MOCK DATA SIMULATION ---
const getPostData = (slug: string) => {
  return {
    id: 101,
    slug: slug,
    title: "The Ultimate Guide to React & Next.js Architecture",
    categories: ["Web Development", "Productivity"],
    readingTime: 12, // Integer
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2024-03-25T10:00:00Z",
    updatedAt: "2024-03-26T14:30:00Z",
    summary: "In this deep dive, we explore how to structure large-scale Next.js applications for maintainability, speed, and developer happiness.",
    keyTakeaways: [
      "Understand the difference between Server and Client Components",
      "Learn how to organize your folder structure for scalability",
      "Mastering Tailwind CSS theme tokens for consistent design",
      "Best practices for data fetching and caching"
    ],
    paragraphs: [
      {
        id: 1,
        postId: 101,
        order: 1,
        text: "When building modern web applications, the architecture you choose at the beginning often dictates the project's success or failure months down the line. With Next.js 14, we have shifted towards a Server Component first approach, which fundamentally changes how we think about data flow.",
        imageUrl: undefined
      },
      {
        id: 2,
        postId: 101,
        order: 2,
        text: "One of the biggest challenges developers face is state management. By pushing data fetching to the server, we reduce the amount of JavaScript sent to the client. This results in faster First Contentful Paint (FCP) scores and better SEO rankings.",
        imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80"
      },
      {
        id: 3,
        postId: 101,
        order: 3,
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
          
          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="lg:col-span-8">
            
            {/* 1. The Header, including the main title & thumbnail */}
            <BlogPostHeader 
              title={post.title}
              categories={post.categories}
              createdAt={post.createdAt}
              thumbnailUrl={post.thumbnailUrl}
            />

            {/* --- MOBILE ONLY: Summary Box --- 
                Shows immediately after header, but ONLY on screens smaller than lg (so laptops)
            */}
            <div className="block lg:hidden mb-10">
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                readingTime={post.readingTime}
              />
            </div>

            {/* 2. Main Content Paragraphs */}
            <BlogContent paragraphs={post.paragraphs} />

            {/* --- MOBILE ONLY: Donate Box --- 
                Shows at the very end of content, ONLY on screens smaller than lg (so laptops)
            */}
            <div className="block lg:hidden mt-12">
              <DonateBox />
            </div>
          
          </div>


          {/* --- RIGHT COLUMN (Desktop Sidebar) --- 
              On mobile this dissapears
              On laptops / large screens: we have a sticky side bar that contains the key details of the article & prompt to support the blog
          */}
          <div className="hidden lg:block lg:col-span-4">
            
            {/* SPACING FIX: Added 'mt-20' to push ONLY the sidebar down 
                so it sits lower than the header, as requested.
            */}
            <div className="sticky top-32 flex flex-col gap-6 mt-26">
              
              <SummaryBox 
                summary={post.summary}
                takeaways={post.keyTakeaways}
                readingTime={post.readingTime}
              />

              <DonateBox />
              
            </div>

          </div>

        </div>

      </article>
    </main>
  );
}
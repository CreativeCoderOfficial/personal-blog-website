import PostHeader from "@/components/generic/PostHeader";
import SummaryBox from "@/components/generic/SummaryBox";
import DonateBox from "@/components/generic/DonateBox";
import ContentRenderer, { Paragraph } from "@/components/generic/ContentRenderer"; // <--- Import

// --- MOCK DATA ---
const getResourceData = (slug: string) => {
  return {
    id: 201,
    slug: slug,
    title: "Ultimate VS Code Setup for Web Dev",
    categories: ["Tools", "Productivity"], 
    createdAt: "2024-04-10T10:00:00Z", 
    thumbnailUrl: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80",
    
    summary: "A curated collection of VS Code extensions, settings.json configurations, and snippets to boost your coding speed by 50%.",
    keyTakeaways: [
      "Pre-configured Prettier & ESLint settings",
      "List of top 10 productivity extensions",
      "Custom snippets for React & Tailwind",
      "Dark mode theme optimized for eye strain"
    ],
    fileSize: "24 MB", // Resource specific data
    
    // Using Paragraph model for Resource Description
    paragraphs: [
      {
        id: 1,
        order: 1,
        title: "Installation Instructions",
        text: "Simply download the ZIP file, extract it to your root directory, and run the installation command. It is optimized for performance and follows the latest industry standards.",
        imageUrl: undefined
      },
      {
        id: 2,
        order: 2,
        title: "What's Included?",
        text: "This pack includes all the necessary configuration files (settings.json, keybindings.json) and a list of recommended extensions that sync automatically.",
        imageUrl: undefined
      }
    ] as Paragraph[]
  };
};

export default function SingleResourcePage({ params }: { params: { slug: string } }) {
  const resource = getResourceData(params.slug);

  return (
    <main className="min-h-screen bg-main pt-8 pb-24">
      <article className="container max-w-7xl mx-auto px-6 lg:px-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8">
            <PostHeader 
              title={resource.title}
              categories={resource.categories}
              createdAt={resource.createdAt}
              thumbnailUrl={resource.thumbnailUrl}
            />

            <div className="block lg:hidden mb-10">
              <SummaryBox 
                summary={resource.summary}
                takeaways={resource.keyTakeaways}
                metaBadge={`ZIP • ${resource.fileSize}`} // <--- Custom Label for Resources
              />
            </div>

            {/* Using Generic ContentRenderer for Resources too! */}
            <ContentRenderer contentBlocks={resource.paragraphs} />

            <div className="block lg:hidden mt-12">
              <DonateBox />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 flex flex-col gap-6 mt-20">
              <SummaryBox 
                summary={resource.summary}
                takeaways={resource.keyTakeaways}
                metaBadge={`ZIP • ${resource.fileSize}`}
              />
              <DonateBox />
            </div>
          </div>

        </div>

      </article>
    </main>
  );
}
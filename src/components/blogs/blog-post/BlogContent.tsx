// Variable length depending the amount of paragraphs and images
export interface Paragraph {
  id: number;
  order: number;
  text: string;
  imageUrl?: string; // Optional
}

interface BlogContentProps {
  paragraphs: Paragraph[];
}

export default function BlogContent({ paragraphs }: BlogContentProps) {
  // Sort by order just in case data comes in unsorted
  const sortedParagraphs = [...paragraphs].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12 mb-20">
      {sortedParagraphs.map((para) => (
        <div key={para.id} className="group">
          
          {/* 1. Paragraph Text */}
          <p className="text-lg md:text-xl text-text-secondary leading-loose">
            {para.text}
          </p>

          {/* 2. Optional Image */}
          {para.imageUrl && (
            <figure className="mt-8 mb-4">
              <div className="rounded-xl overflow-hidden border border-border-subtle shadow-lg">
                <img 
                  src={para.imageUrl} 
                  alt="Article illustration" 
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
              {/* Optional: You could add a caption field to your model later */}
            </figure>
          )}

        </div>
      ))}
    </div>
  );
}
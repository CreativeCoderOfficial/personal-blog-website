// src/components/generic/ContentRenderer.tsx

export interface Paragraph {
  id: number;
  order: number;
  title?: string;
  text: string;
  imageUrl?: string; 
}

interface ContentRendererProps {
  contentBlocks: Paragraph[]; 
}

export default function ContentRenderer({ contentBlocks }: ContentRendererProps) {
  const sortedBlocks = [...contentBlocks].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12 mb-20">
      {sortedBlocks.map((block) => (
        <div key={block.id} className="group">
          
          {/* 1. Optional Block Title (Rendered as H2) */}
          {block.title && (
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4 mt-8">
              {block.title}
            </h2>
          )}

          {/* 2. Text Content */}
          <p className="text-lg md:text-xl text-text-secondary leading-loose">
            {block.text}
          </p>

          {/* 3. Optional Image */}
          {block.imageUrl && (
            <figure className="mt-8 mb-4">
              <div className="rounded-xl overflow-hidden border border-border-subtle shadow-lg">
                <img 
                  src={block.imageUrl} 
                  alt={block.title || "Section illustration"} 
                  className="w-full h-auto object-cover group-hover:scale-[1.01] transition-transform duration-500"
                />
              </div>
            </figure>
          )}

        </div>
      ))}
    </div>
  );
}
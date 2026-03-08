// src/components/generic/ContentRenderer.tsx
import ReactMarkdown from "react-markdown";
import Image from "next/image";

// Plugins for Markdown rendering
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

// import our markdown style
import { markdownComponents, markdownProseClasses } from "@/lib/markdownConfig";

// Define the interface to match your Prisma "Section" model
export interface ContentSection {
  id: number;
  order: number;
  title: string | null;
  content: string | null; // Markdown string
  imageUrl: string | null; 
  imageDescription: string | null;
}

interface ContentRendererProps {
  sections: ContentSection[]; 
}

export default function ContentRenderer({ sections }: ContentRendererProps) {
  // 1. Sort sections by order (Defensive coding, even if DB sorts it)
  const sortedBlocks = [...sections].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-12 mt-8">
      {sortedBlocks.map((section) => (
        <div key={section.id} className="group">
          
          {/* A. Section Title */}
          {section.title && (
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6 mt-12">
              {section.title}
            </h2>
          )}

          {/* B. Section Image */}
          {section.imageUrl && (
            <figure className="my-8">
              <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-border-subtle shadow-lg">
                <Image 
                  src={section.imageUrl} 
                  alt={section.imageDescription || section.title || "Section illustration"} 
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
              {section.imageDescription && (
                <figcaption className="text-center text-xs text-text-secondary mt-3 italic">
                  {section.imageDescription}
                </figcaption>
              )}
            </figure>
          )}

          {/* C. Text Content (Markdown) */}
          {section.content && (
            <div className={markdownProseClasses}>
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeHighlight]}
                components={markdownComponents}
              >
                {section.content}
              </ReactMarkdown>
            </div>
          )}

        </div>
      ))}
    </div>
  );
}
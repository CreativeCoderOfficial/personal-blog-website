// src/components/generic/ContentRenderer.tsx
import ReactMarkdown from "react-markdown";
import Image from "next/image";

// Plugins for Markdown rendering
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

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
            <div className="
              prose prose-lg prose-invert max-w-none
              prose-headings:text-text-primary prose-headings:font-bold
              prose-p:text-text-secondary prose-p:leading-relaxed
              prose-a:text-accent-purple prose-a:no-underline hover:prose-a:underline
              prose-strong:text-text-primary prose-strong:font-bold
              
              /* Code Block Styling */
              prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border-subtle prose-pre:rounded-xl
              prose-code:text-accent-orange prose-code:bg-accent-orange/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              
              /* Table Styling */
              prose-table:w-full prose-table:text-left prose-table:border-collapse
              prose-th:p-4 prose-th:bg-card prose-th:text-text-primary prose-th:border prose-th:border-border-subtle
              prose-td:p-4 prose-td:text-text-secondary prose-td:border prose-td:border-border-subtle
            ">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeHighlight]}
                components={{
                  // Force Unordered Lists to have visible bullets
                  ul: ({...props}) => <ul className="list-disc pl-6 space-y-2 my-4 text-text-secondary marker:text-accent-purple" {...props} />,
                  
                  // Force Ordered Lists to have visible numbers
                  ol: ({...props}) => <ol className="list-decimal pl-6 space-y-2 my-4 text-text-secondary marker:text-accent-purple" {...props} />,
                  
                  // Force List Items to behave
                  li: ({...props}) => <li className="pl-1" {...props} />,

                  // Force Blockquotes to look nice
                  blockquote: ({...props}) => (
                    <blockquote className="border-l-4 border-accent-purple bg-accent-purple/5 px-4 py-2 rounded-r-lg not-italic my-6 text-text-secondary" {...props} />
                  ),

                  h1: ({...props}) => <h1 className="text-3xl md:text-4xl font-extrabold text-text-primary mt-12 mb-6" {...props} />,
                  h2: ({...props}) => <h2 className="text-2xl md:text-3xl font-bold text-text-primary mt-10 mb-5" {...props} />,
                  h3: ({...props}) => <h3 className="text-xl md:text-2xl font-bold text-text-primary mt-8 mb-4" {...props} />,
                  h4: ({...props}) => <h4 className="text-lg md:text-xl font-bold text-text-primary mt-6 mb-3" {...props} />,
                }}
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
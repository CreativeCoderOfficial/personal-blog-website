// src/lib/markdownConfig.tsx
// This file centralizes all the custom styling for markdown-rendered content
//
// EXPORTS:
//   - markdownComponents   → pass directly to <ReactMarkdown components={...} />
//   - markdownProseClasses → apply to the <div> wrapper around <ReactMarkdown />
//
// USAGE EXAMPLE:
//   import { markdownComponents, markdownProseClasses } from "@/lib/markdownConfig";
//   <div className={markdownProseClasses}>
//     <ReactMarkdown components={markdownComponents}>
//       {content}
//     </ReactMarkdown>
//   </div>

import type { Components } from "react-markdown";

// ─────────────────────────────────────────────────────────────
// MARKDOWN COMPONENT OVERRIDES
// These replace ReactMarkdown's default HTML renderers so our
// custom Tailwind styles are applied consistently everywhere.
// ─────────────────────────────────────────────────────────────
export const markdownComponents: Components = {

  // Force Unordered Lists to have visible bullets
  // (prose-invert resets list styles, so we re-apply them here)
  ul: ({ ...props }) => (
    <ul
      className="list-disc pl-6 space-y-2 my-4 text-text-secondary marker:text-accent-purple"
      {...props}
    />
  ),

  // Force Ordered Lists to have visible numbers
  ol: ({ ...props }) => (
    <ol
      className="list-decimal pl-6 space-y-2 my-4 text-text-secondary marker:text-accent-purple"
      {...props}
    />
  ),

  // Force List Items to have a small left indent for readability
  li: ({ ...props }) => <li className="pl-1" {...props} />,

  // Force Blockquotes to look intentional — purple left border with tinted bg
  blockquote: ({ ...props }) => (
    <blockquote
      className="border-l-4 border-accent-purple bg-accent-purple/5 px-4 py-2 rounded-r-lg not-italic my-6 text-text-secondary"
      {...props}
    />
  ),

  // Heading overrides — override prose defaults with explicit sizing
  h1: ({ ...props }) => (
    <h1
      className="text-3xl md:text-4xl font-extrabold text-text-primary mt-12 mb-6"
      {...props}
    />
  ),
  h2: ({ ...props }) => (
    <h2
      className="text-2xl md:text-3xl font-bold text-text-primary mt-10 mb-5"
      {...props}
    />
  ),
  h3: ({ ...props }) => (
    <h3
      className="text-xl md:text-2xl font-bold text-text-primary mt-8 mb-4"
      {...props}
    />
  ),
  h4: ({ ...props }) => (
    <h4
      className="text-lg md:text-xl font-bold text-text-primary mt-6 mb-3"
      {...props}
    />
  ),
};

// ─────────────────────────────────────────────────────────────
// PROSE WRAPPER CLASSES
//
// The full Tailwind class string applied to the <div> that wraps
// <ReactMarkdown />. Used identically in both ContentRenderer.tsx
// (published post view) and ContentEditor.tsx (admin preview),
// so the preview always matches exactly what readers will see.
// ─────────────────────────────────────────────────────────────
export const markdownProseClasses = [
  "prose prose-lg prose-invert max-w-none",

  // Headings & paragraphs
  "prose-headings:text-text-primary prose-headings:font-bold",
  "prose-p:text-text-secondary prose-p:leading-relaxed",

  // Links
  "prose-a:text-accent-purple prose-a:no-underline hover:prose-a:underline",

  // Bold text
  "prose-strong:text-text-primary prose-strong:font-bold",

  // Inline code
  "prose-code:text-accent-orange prose-code:bg-accent-orange/10",
  "prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md",
  "prose-code:before:content-none prose-code:after:content-none",

  // Code blocks
  "prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border-subtle prose-pre:rounded-xl",

  // Tables
  "prose-table:w-full prose-table:text-left prose-table:border-collapse",
  "prose-th:p-4 prose-th:bg-card prose-th:text-text-primary prose-th:border prose-th:border-border-subtle",
  "prose-td:p-4 prose-td:text-text-secondary prose-td:border prose-td:border-border-subtle",
].join(" ");
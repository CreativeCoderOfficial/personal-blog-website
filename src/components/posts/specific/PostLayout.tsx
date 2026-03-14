import { ReactNode } from "react";
import DonateBox from "@/components/support/DonateBox";

interface PostLayoutProps {
  header: ReactNode;         // The PostHeader component
  content: ReactNode;        // The ContentRenderer component
  sidebar: ReactNode;        // What goes in the sticky right column
  mobileTopContent?: ReactNode; // Extra stuff for mobile (like Resource Buttons)
}

export default function PostLayout({ 
  header, 
  content, 
  sidebar,
  mobileTopContent 
}: PostLayoutProps) {
  return (
    <main className="min-h-screen bg-main pt-8 pb-24">
      <article className="container max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* --- LEFT COLUMN (Main Content) --- */}
          <div className="lg:col-span-8">
            {/* 1. Header is always first */}
            {header}

            {/* 2. Mobile-only top content (Summary, Buttons, etc) */}
            <div className="block lg:hidden mb-10 space-y-8">
              {mobileTopContent}
            </div>

            {/* 3. The Main Content */}
            {content}

            {/* 4. Mobile Donate (Always at bottom on mobile) */}
            <div className="block lg:hidden mt-12">
              <DonateBox />
            </div>
          </div>

          {/* --- RIGHT COLUMN (Desktop Sticky Sidebar) --- */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-32 flex flex-col gap-6 mt-20">
              {sidebar}
              {/* DonateBox is standard in sidebar for all post types */}
              <DonateBox />
            </div>
          </div>

        </div>
      </article>
    </main>
  );
}
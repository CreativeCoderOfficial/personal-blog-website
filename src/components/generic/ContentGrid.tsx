import { ReactNode } from "react";

interface ContentGridProps {
  children: ReactNode;
  isEmpty?: boolean;
}

export default function ContentGrid({ children, isEmpty }: ContentGridProps) {
  if (isEmpty) {
    return (
      <div className="text-center py-32 border border-dashed border-border-subtle rounded-3xl bg-card/30">
        <div className="inline-flex p-4 rounded-full bg-main mb-4">
             <span className="text-4xl">🔍</span>
        </div>
        <p className="text-xl text-text-primary font-bold mb-2">No results found</p>
        <p className="text-text-secondary">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pb-24">
      {children}
    </div>
  );
}
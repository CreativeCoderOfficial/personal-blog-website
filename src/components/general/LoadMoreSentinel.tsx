// src/components/posts/filtering/LoadMoreSentinel.tsx
// This component is responsible for rendering the "sentinel" div that the IntersectionObserver watches to trigger loading more posts.
import { RefObject } from "react";
import { Loader2 } from "lucide-react";

interface LoadMoreSentinelProps {
  hasMore: boolean;
  isLoading: boolean;
  sentinelRef: RefObject<HTMLDivElement | null>;
}

export default function LoadMoreSentinel({
  hasMore,
  isLoading,
  sentinelRef,
}: LoadMoreSentinelProps) {
  return (
    <>
      {/* The sentinel div — the IntersectionObserver watches this element.
          When it scrolls into view, usePostFetcher increments the page.
          Only rendered while there are more posts to fetch. */}
      {hasMore && (
        <div ref={sentinelRef} className="mt-16 flex justify-center items-center h-20">
          {isLoading ? (
            // Loading state: spinner + label
            <div className="flex flex-col items-center gap-2 text-accent-purple">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-sm font-medium">Loading more...</span>
            </div>
          ) : (
            // Not loading yet — invisible spacer so the observer can still trigger
            <div className="h-4 w-full" />
          )}
        </div>
      )}

      {!hasMore && (
        <div className="mt-16 text-center text-text-secondary opacity-60">
          End of results.
        </div>
      )}
    </>
  );
}
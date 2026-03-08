// src/components/admin/AdminDashboardContainer.tsx
//
// Client Component — the admin dashboard UI.
//
// ARCHITECTURE:
//   - usePostFetcher handles: search, category/date filters, infinite scroll,
//     pagination, and API calls. Type is "ALL" here.
//   - Local `contentType` state handles: the type toggle (Blog/Resource/All).
//     This filters the already-fetched posts in memory — instant, no API call.
//   - When filters change (search/category/date), the hook re-fetches from the
//     API with the current filters applied, status="ALL" so drafts are included.

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Clock, Download, Edit3, FileText, Layers, Loader2, Plus, Trash2 } from "lucide-react";
import FilterPanel from "@/components/posts/filtering/FilterPanel";
import ContentGrid from "@/components/posts/filtering/ContentGrid";
import ContentCard from "@/components/posts/filtering/ContentCard";
import { usePostFetcher } from "@/hooks/usePostFetcher";
import { deletePost } from "@/lib/actions/posts";
import { PostItem } from "@/types/post";

// Type toggle button — same style as the old mock dashboard
function TypeButton({
  active,
  onClick,
  label,
  icon,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all
        ${active
          ? "bg-text-primary text-main shadow-lg"
          : "bg-card border border-border-subtle text-text-secondary hover:text-text-primary hover:border-text-secondary"
        }
      `}
    >
      {icon}
      <span>{label}</span>
      {count !== undefined && (
        <span className="opacity-60 text-xs ml-1">({count})</span>
      )}
    </button>
  );
}

// PostItem extended with admin-only status field
type AdminPost = PostItem & { status: string };

interface AdminDashboardContainerProps {
  initialPosts: AdminPost[];
  allCategoryOptions: string[];
  allResourceTypeOptions: string[];
}


export default function AdminDashboardContainer({
  initialPosts,
  allCategoryOptions,
  allResourceTypeOptions,
}: AdminDashboardContainerProps) {

  // --- Type toggle (local — no API call) ---
  // "all" | "BLOG" | "RESOURCE"
  const [contentType, setContentType] = useState<"all" | "BLOG" | "RESOURCE">("all");

  // --- Delete state ---
  const [isDeleting, setIsDeleting] = useState(false);

  // --- usePostFetcher ---
  // type="ALL"   → no type restriction in API query
  // status="ALL" → drafts included (API verifies admin session)
  // limit=12     → 12 posts per page instead of the public site's 6
  const {
    posts,       // current page of posts from the API (grows as user scrolls)
    isLoading,
    hasMore,
    sentinelRef, // attach to a div at the bottom to trigger next page load
    filters,
    setFilters,
    setPosts,
  } = usePostFetcher({
    initialPosts,
    type: "ALL",
    status: "ALL",
    limit: 12,
  });

  // --- Local type filter ---
  // Applied on top of whatever the hook has fetched.
  // Does NOT trigger an API call — purely client-side.
  const visiblePosts = useMemo(() => {
    if (contentType === "all") return posts;
    return posts.filter((p) => p.type === contentType);
  }, [posts, contentType]);

  // --- Delete handler ---
  const handleDelete = async (id: number, title: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const result = await deletePost(id);
    setIsDeleting(false);

    if (!result.success) {
      alert(`Failed to delete: ${result.error}`);
      return;
    }

    // Remove the deleted post from local state (instead of re-fetching everything)
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <main className="min-h-screen bg-main text-text-primary p-6 md:p-12 pb-32">
      <div className="max-w-7xl mx-auto">

        {/* 1. Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
            <p className="text-text-secondary mt-1">
              {posts.length} post{posts.length !== 1 ? "s" : ""} loaded
            </p>
          </div>
          <Link
            href="/admin/posts/new"
            className="
              inline-flex items-center gap-2 px-6 py-3 rounded-xl self-start md:self-auto
              bg-gradient-to-r from-accent-purple to-purple-600 text-white font-bold
              shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]
              transition-all
            "
          >
            <Plus className="w-5 h-5" />
            Create New Post
          </Link>
        </div>

        {/* 2. Type toggle — local filter, no API call on change */}
        <div className="mb-8 flex flex-wrap gap-3">
          <TypeButton
            active={contentType === "all"}
            onClick={() => setContentType("all")}
            label="All Content"
            // Show count of currently visible posts for the selected type
            count={posts.length}
          />
          <TypeButton
            active={contentType === "BLOG"}
            onClick={() => setContentType("BLOG")}
            label="Blogs"
            icon={<FileText className="w-4 h-4" />}
            count={posts.filter((p) => p.type === "BLOG").length}
          />
          <TypeButton
            active={contentType === "RESOURCE"}
            onClick={() => setContentType("RESOURCE")}
            label="Resources"
            icon={<Download className="w-4 h-4" />}
            count={posts.filter((p) => p.type === "RESOURCE").length}
          />
        </div>

        {/* 3. Filter Panel — triggers API re-fetch via usePostFetcher */}
        <FilterPanel
          searchPlaceholder="Search by title or summary..."
          filterLabel="Filter by Category"
          filterOptions={allCategoryOptions}
          resourceTypeLabel="Filter by Resource Type"
          resourceTypeOptions={allResourceTypeOptions}
          filters={filters}
          setFilters={setFilters}
        />

        {/* 4. Card Grid */}
        <ContentGrid isEmpty={visiblePosts.length === 0}>
          {visiblePosts.map((post) => {
            const adminPost = post as AdminPost;
            const isResource = post.type === "RESOURCE";

            return (
              <ContentCard
                key={post.id}
                title={post.title}
                summary={post.summary}
                categories={post.categories}
                thumbnailUrl={post.thumbnailUrl || ""}
                date={post.createdAt}
                href={`/admin/posts/edit/${post.id}`}
                metaItem={
                  isResource ? (
                    <div className="flex items-center gap-1.5 text-accent-orange">
                      <Layers className="w-3.5 h-3.5" />
                      <span className="capitalize">
                        {(post as any).resourceType?.name || "Resource"}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-accent-purple">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  )
                }
                customFooter={
                  <div className="space-y-3">

                    {/* Status badge */}
                    <span className={`
                      inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                      text-xs font-semibold
                      ${adminPost.status === "PUBLISHED"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-yellow-500/10 text-yellow-400"
                      }
                    `}>
                      <span className={`
                        w-1.5 h-1.5 rounded-full
                        ${adminPost.status === "PUBLISHED" ? "bg-green-400" : "bg-yellow-400"}
                      `} />
                      {adminPost.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>

                    {/* Edit + Delete */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/posts/edit/${post.id}`}
                        className="
                          flex-1 py-2 rounded-lg text-sm font-bold text-text-secondary
                          bg-main border border-border-subtle
                          hover:bg-white/5 hover:border-text-secondary hover:text-white
                          flex items-center justify-center gap-2 transition-all
                        "
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        disabled={isDeleting}
                        aria-label="Delete post"
                        className="
                          px-3 py-2 rounded-lg transition-all
                          bg-red-500/10 border border-red-500/20 text-red-400
                          hover:bg-red-500/20 hover:border-red-500/40
                          disabled:opacity-50 disabled:cursor-not-allowed
                        "
                      >
                        {isDeleting
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Trash2 className="w-4 h-4" />
                        }
                      </button>
                    </div>

                  </div>
                }
              />
            );
          })}
        </ContentGrid>

        {/* 5. Infinite scroll sentinel — same pattern as public pages */}
        {hasMore && (
          <div ref={sentinelRef} className="mt-16 flex justify-center items-center h-20">
            {isLoading && <Loader2 className="w-6 h-6 animate-spin text-text-secondary" />}
          </div>
        )}

      </div>
    </main>
  );
}
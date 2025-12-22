import BlogCard, { BlogPostProps } from "@/components/blogs/BlogCard"; 

interface BlogGridProps {
  posts: BlogPostProps[];
}

export default function BlogGrid({ posts }: BlogGridProps) {
  
  // 1. EMPTY STATE
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-border-subtle rounded-2xl bg-card/30">
        <p className="text-xl text-text-primary font-semibold mb-2">No articles found</p>
        <p className="text-text-secondary">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  // 2. GRID LAYOUT
  return (
    <div className="flex flex-col gap-16">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
import Link from "next/link";
import { Plus } from "lucide-react";

export default function AdminHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-secondary">Manage your content, analytics, and settings.</p>
      </div>

      <Link 
        href="/admin/posts/new"
        className="
          inline-flex items-center gap-2 px-6 py-3 rounded-xl
          bg-gradient-to-r from-accent-purple to-purple-600 text-white font-bold
          shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-[0.98]
          transition-all
        "
      >
        <Plus className="w-5 h-5" />
        Create New Post
      </Link>
    </div>
  );
}
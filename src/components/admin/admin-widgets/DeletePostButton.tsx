// src/components/admin/DeletePostButton.tsx
//
// A small Client Component that renders the Delete button per post row.
// It lives in its own file so the parent dashboard page can stay a
// Server Component — only this tiny piece needs client-side interactivity.
//
// It uses a native window.confirm() for the confirmation dialog.
// Simple, zero dependencies, no modal component needed.

"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deletePost } from "@/lib/actions/posts";

interface DeletePostButtonProps {
  id: number;
  // Title is shown in the confirmation message so the admin
  // knows exactly which post they're about to delete
  title: string;
}

export default function DeletePostButton({ id, title }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // window.confirm() blocks execution until the user responds.
    // Returns true if they clicked OK, false if they clicked Cancel.
    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?\n\nThis cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    const result = await deletePost(id);

    if (!result.success) {
      alert(`Failed to delete: ${result.error}`);
      setIsDeleting(false);
      return;
    }

    // No need to update local state — deletePost calls revalidatePath("/admin")
    // which causes Next.js to re-render the dashboard Server Component,
    // automatically removing the deleted post from the table
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="
        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
        border border-red-500/30 text-red-400
        hover:bg-red-500/10 hover:border-red-500/50
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-all
      "
    >
      {isDeleting
        ? <Loader2 className="w-3 h-3 animate-spin" />
        : <Trash2 className="w-3 h-3" />
      }
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
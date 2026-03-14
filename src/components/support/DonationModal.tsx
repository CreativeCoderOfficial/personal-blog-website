// src/components/support/DonationModal.tsx
//
// A reusable modal shell that wraps DonationForm.
//   - Render a full-screen overlay (backdrop) when open
//   - Centre the DonationForm card inside it
//   - Provide a close button and allow closing by clicking the backdrop
//   - Lock body scroll while open so the page doesn't scroll behind the modal

"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import DonationForm from "@/components/support/DonationForm";

// ── Props ────────────────────────────────────────────────────
interface DonationModalProps {
  // Whether the modal is currently visible
  isOpen: boolean;
  // Called when the user wants to close the modal (backdrop click or X button)
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {

  // ── Side effect: lock body scroll while the modal is open ──
  useEffect(() => {
    if (isOpen) {
      // Prevent the background page from scrolling
      document.body.style.overflow = "hidden";
    } else {
      // Restore normal scrolling
      document.body.style.overflow = "";
    }

    // Restore scroll if component unmounts while open
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]); // Re-run only when isOpen changes


  if (!isOpen) return null;

  return (

    // Fixed overlay as a backdrop that covers the entire viewport.
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-50
        bg-black/70 backdrop-blur-sm
        flex items-center justify-center
        p-4 sm:p-6
        animate-in fade-in duration-200
      "
    >
      {/* stopPropagation() makes sure only clicks on the backdrop itself (not in the card) close it. */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative
          w-full max-w-lg
          max-h-[90vh] overflow-y-auto
          rounded-3xl
          bg-card border border-border-subtle
          shadow-2xl shadow-black/60
          animate-in zoom-in-95 duration-200
        "
      >


        <button
          onClick={onClose}
          aria-label="Close donation modal"
          className="
            absolute top-4 right-4 z-10
            p-2 rounded-full
            bg-main/80 hover:bg-main
            border border-border-subtle
            text-text-secondary hover:text-text-primary
            transition-colors duration-150
          "
        >
          <X className="w-4 h-4" />
        </button>

        <DonationForm />

      </div>
    </div>
  );
}
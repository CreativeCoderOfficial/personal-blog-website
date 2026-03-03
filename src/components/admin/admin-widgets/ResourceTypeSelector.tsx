// src/components/admin/ResourceTypeSelector.tsx
//
// Displays existing resource types as radio buttons (only one per post),
// and provides an inline form to create a new resource type.

"use client";

import { useState } from "react";
import { Plus, Loader2, Check } from "lucide-react";
import { createResourceType } from "@/lib/actions/posts";
import type { ResourceTypeOption } from "@/components/admin/CreatePostForm";

interface ResourceTypeSelectorProps {
  // Full list of available resource types — grows when admin creates new ones
  options: ResourceTypeOption[];

  // The currently selected resource type name — single string in formData
  selected: string;

  // Called when selection changes — updates formData.resourceType in parent
  onChange: (selected: string) => void;
}

export default function ResourceTypeSelector({
  options,
  selected,
  onChange,
}: ResourceTypeSelectorProps) {

  // Local copy so we can optimistically add new types without a page reload
  const [localOptions, setLocalOptions] = useState<ResourceTypeOption[]>(options);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // --- Handle Creation ---
  const handleCreate = async () => {
    if (!newName.trim()) return;

    setIsCreating(true);
    setCreateError("");

    const result = await createResourceType({ name: newName.trim() });

    if (!result.success) {
      setCreateError(result.error);
      setIsCreating(false);
      return;
    }

    // Optimistically add the new type to the local list
    const newType = { name: newName.trim() };
    setLocalOptions((prev) => [...prev, newType]);

    // Auto-select the newly created type — saves an extra click
    onChange(newName.trim());

    // Reset the form
    setNewName("");
    setShowNewForm(false);
    setIsCreating(false);
  };

  return (
    <div className="space-y-3">

      {/* --- Existing Resource Types: Radio Buttons --- */}
      {localOptions.length > 0 ? (
        <div className="space-y-2">
          {localOptions.map((rt) => {
            const isSelected = selected === rt.name;

            return (
              // We render a styled div that behaves like a radio button.
              // Using a native <input type="radio"> internally for accessibility,
              // but wrapping it in a custom styled container for appearance.
              <label
                key={rt.name}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer
                  transition-all duration-150
                  ${isSelected
                    ? "border-accent-orange bg-accent-orange/10 text-accent-orange"
                    : "border-border-subtle text-text-secondary hover:border-text-secondary/50 hover:text-text-primary"
                  }
                `}
              >
                {/* Hidden native radio input — handles the actual selection logic.
                    Screen readers and keyboard navigation rely on this. */}
                <input
                  type="radio"
                  name="resourceType"  // all radios share a name so only one can be selected
                  value={rt.name}
                  checked={isSelected}
                  onChange={() => onChange(rt.name)}
                  className="sr-only" // sr-only = visually hidden but accessible to screen readers
                />

                {/* Custom visual radio indicator */}
                <div className={`
                  w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0
                  ${isSelected
                    ? "border-accent-orange"
                    : "border-border-subtle"
                  }
                `}>
                  {/* Inner dot — only visible when selected */}
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-accent-orange" />
                  )}
                </div>

                <span className="text-sm font-medium">{rt.name}</span>
              </label>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-text-secondary italic">
          No resource types yet — create one below.
        </p>
      )}

      {/* --- Clear selection button ---
          Useful if the admin selected a type by mistake and wants to unset it.
          Only shown when something is selected. */}
      {selected && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-xs text-text-secondary hover:text-red-400 transition-colors"
        >
          Clear selection
        </button>
      )}

      {/* --- New Resource Type Form --- */}
      {showNewForm ? (
        <div className="p-3 rounded-xl bg-main border border-border-subtle space-y-3">

          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="e.g. Video, E-Book, Tool..."
            className="w-full bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-orange outline-none text-text-primary"
            // Allow submitting with Enter key for convenience —
            // but we call handleCreate directly, not form submit,
            // so the parent post form is never accidentally triggered
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleCreate();
              }
            }}
          />

          {createError && (
            <p className="text-xs text-red-400">{createError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !newName.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-orange text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Check className="w-3 h-3" />
              )}
              {isCreating ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowNewForm(false);
                setCreateError("");
                setNewName("");
              }}
              className="px-3 py-1.5 rounded-lg border border-border-subtle text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowNewForm(true)}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-orange transition-colors"
        >
          <Plus className="w-3 h-3" />
          New Resource Type
        </button>
      )}
    </div>
  );
}
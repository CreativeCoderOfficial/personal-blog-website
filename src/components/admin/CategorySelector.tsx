// src/components/admin/CategorySelector.tsx
"use client";

import { useState } from "react";
import { Plus, Loader2, Check } from "lucide-react";
import { createCategory } from "@/lib/actions/posts";
import type { CategoryOption } from "@/components/admin/PostForm";

interface CategorySelectorProps {
  options: CategoryOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
}

export default function CategorySelector({
  options,
  selected,
  onChange,
}: CategorySelectorProps) {
  const [localOptions, setLocalOptions] = useState<CategoryOption[]>(options);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  const handleToggle = (name: string) => {
    const isSelected = selected.includes(name);
    onChange(
      isSelected
        ? selected.filter((s) => s !== name)
        : [...selected, name]
    );
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsCreating(true);
    setCreateError("");

    const result = await createCategory({
      name: newName.trim(),
      color: newColor,
    });

    if (!result.success) {
      setCreateError(result.error);
      setIsCreating(false);
      return;
    }

    const newCategory = { name: newName.trim(), color: newColor };
    setLocalOptions((prev) => [...prev, newCategory]);
    onChange([...selected, newName.trim()]);
    setNewName("");
    setNewColor("#6366f1");
    setShowNewForm(false);
    setIsCreating(false);
  };

  return (
    <div className="space-y-2">

      {/* stacked rectangle list  */}
      {localOptions.length > 0 ? (
        <div className="rounded-xl border border-border-subtle overflow-hidden divide-y divide-border-subtle">
          {localOptions.map((cat) => {
            const isSelected = selected.includes(cat.name);

            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleToggle(cat.name)}
                className={`
                  w-full flex items-center justify-between px-4 py-2.5
                  text-sm font-medium transition-all duration-150 text-left
                  ${isSelected
                    ? "bg-white/5"
                    : "hover:bg-white/[0.03] text-text-secondary hover:text-text-primary"
                  }
                `}
              >
                {/* Left side: color dot + name */}
                <div className="flex items-center gap-3">
                  {/* Color indicator dot using the category's own color */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  {/* Category name — colored when selected */}
                  <span style={isSelected ? { color: cat.color } : undefined}>
                    {cat.name}
                  </span>
                </div>

                {/* Right side: checkmark only visible when selected */}
                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: cat.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-text-secondary italic">
          No categories yet — create one below.
        </p>
      )}

      {/* New Category Form*/}
      {showNewForm ? (
        <div className="p-3 rounded-xl bg-main border border-border-subtle space-y-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="w-full bg-transparent border border-border-subtle rounded-lg px-3 py-2 text-sm focus:border-accent-purple outline-none text-text-primary"
          />

          <div className="flex items-center gap-3">
            <label className="text-xs text-text-secondary font-semibold shrink-0">
              Color
            </label>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border border-border-subtle bg-transparent"
            />
            {/* Live preview */}
            <span
              style={{
                borderColor: newColor,
                color: newColor,
                backgroundColor: `${newColor}33`,
              }}
              className="px-2 py-0.5 rounded-full border text-xs font-semibold"
            >
              {newName || "Preview"}
            </span>
          </div>

          {createError && (
            <p className="text-xs text-red-400">{createError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={isCreating || !newName.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-purple text-white text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                setNewColor("#6366f1");
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
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent-purple transition-colors"
        >
          <Plus className="w-3 h-3" />
          New Category
        </button>
      )}
    </div>
  );
}
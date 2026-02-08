import { X } from "lucide-react";
import React from "react";

interface Props {
  label?: string;
  labelIcon?: React.ReactNode;
  options: string[];
  selected: string[];
  onToggle: (opt: string) => void;
  onClear?: () => void;
  clearLabel?: string;
  selectedClass?: string;
  unselectedClass?: string;
}

export default function MultiPillFilter({
  label,
  labelIcon,
  options,
  selected,
  onToggle,
  onClear,
  clearLabel = "Clear",
  selectedClass = "bg-accent-purple text-white border-accent-purple shadow-lg shadow-accent-purple/20",
  unselectedClass = "bg-main/50 text-text-secondary border-border-subtle hover:border-text-secondary hover:text-text-primary",
}: Props) {
  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-secondary font-medium">
            {labelIcon}
            <span>{label}:</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 capitalize
                ${isSelected ? selectedClass : unselectedClass}
              `}
            >
              {opt}
            </button>
          );
        })}

        {onClear && selected.length > 0 && (
          <button
            onClick={onClear}
            className="px-4 py-2 rounded-full text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            {clearLabel}
          </button>
        )}
      </div>
    </div>
  );
}
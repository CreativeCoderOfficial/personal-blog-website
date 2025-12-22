import React from "react";

interface LineMarkerProps {
  width?: "full" | "short";
  className?: string;
}

export default function LineMarker({ width = "full", className = "" }: LineMarkerProps) {
  return (
    <div 
      className={`
        h-[1px] w-full
        bg-gradient-to-r from-transparent via-border-subtle to-transparent
        opacity-70
        ${width === "short" ? "max-w-xl mx-auto" : ""}
        ${className}
      `} 
    />
  );
}
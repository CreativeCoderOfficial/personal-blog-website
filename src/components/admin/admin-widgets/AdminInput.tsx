// src/components/admin/AdminInput.tsx
//
// Standard admin form input style.

import React from "react";

// We omit className from InputHTMLAttributes so we can re-declare it
// as optional below, allowing it to be merged with the base style.
type AdminInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export default function AdminInput({ className = "", ...props }: AdminInputProps) {
  return (
    <input
      // Base style — applied to every admin input
      // bg-main:             dark background matching the admin panel
      // border-border-subtle: faint 10% white border
      // rounded-lg px-3 py-2: standard padding and rounding
      // text-sm:             consistent small text size
      // text-text-primary:   readable white text
      // focus:border-accent-purple: purple focus ring by default
      // outline-none:        removes the browser default outline
      className={`w-full bg-main border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:border-accent-purple outline-none ${className}`}
      {...props}
    />
  );
}
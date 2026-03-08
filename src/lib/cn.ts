// src/lib/cn.ts
//
// Utility for merging Tailwind classes safely.
// clsx handles conditional classes (arrays, objects, falsy values).
// tailwind-merge resolves conflicts — e.g. if you pass both "p-4" and "p-6",
// it keeps only the last one instead of both being applied unpredictably.

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
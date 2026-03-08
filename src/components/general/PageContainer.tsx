// src/components/general/PageContainer.tsx
//
// Standard horizontal padding throughout the site. 
// Any responsive padding tweak is made in one place.

import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  // Optional extra className for one-off overrides (e.g. extra top padding)
  className?: string;
}

export default function PageContainer({ children, className = "" }: PageContainerProps) {
  return (
    <div className={`container w-full mx-auto px-6 lg:px-10 xl:px-16 2xl:px-24 ${className}`}>
      {children}
    </div>
  );
}
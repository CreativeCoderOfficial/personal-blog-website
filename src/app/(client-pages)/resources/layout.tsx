// ./app/resources/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Resources | Maxxed Out",
  description: "Useful tools, products or technologies to elevate your life.",
};

export default function BlogLayout({ children }: { children: ReactNode }) {
    // use <> </> to only return children
  return (
    <>
      {children}
    </>
  );
}
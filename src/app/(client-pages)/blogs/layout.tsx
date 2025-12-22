// ./app/blogs/layout.tsx
import type { ReactNode } from "react";

export const metadata = {
  title: "Blogs | Maxxed Out",
  description: "Insights, tutorials, and thoughts on technology.",
};

export default function BlogLayout({ children }: { children: ReactNode }) {
    // use <> </> to only return children
  return (
    <>
      {children}
    </>
  );
}
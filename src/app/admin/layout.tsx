import { ReactNode } from "react";

export const metadata = {
  title: "Admin Portal | Maxxed Out",
  robots: "noindex, nofollow", // Security best practice --> tell search engines not to index this
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // APPLY ADMIN THEME
    // Don't add header or footer
    <div className="theme-admin min-h-screen bg-main text-text-primary font-sans">
      {children}
    </div>
  );
}
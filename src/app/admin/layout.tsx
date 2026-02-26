// src/app/admin/layout.tsx
import { ReactNode } from "react";
import { signOut } from "@/lib/auth";
import { LayoutDashboard, LogOut } from "lucide-react";


export const metadata = {
  title: "Admin Portal | Maxxed Out",
  robots: "noindex, nofollow", // Security best practice --> tell search engines not to index this
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-admin min-h-screen bg-main text-text-primary font-sans">

      {/* Top Navigation Bar */}
      <nav className="border-b border-border-subtle bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-8 h-16 flex items-center justify-between">

          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-orange/10">
              <LayoutDashboard className="w-5 h-5 text-accent-orange" />
            </div>
            <span className="font-bold text-text-primary">Admin Portal</span>
          </div>

          {/* Right: Logout */}
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>

        </div>
      </nav>

      {/* Page Content */}
      <main className="container mx-auto px-8 py-10">
        {children}
      </main>

    </div>
  );
}
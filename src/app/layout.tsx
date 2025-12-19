// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";

export const metadata = {
  title: "CreativeCoder — Personal Blog",
  description: "Articles and projects about web development and productivity.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
  <html lang="en">
    <body>
      <Header />
      <main>{children}</main>
      <Footer />
    </body>
  </html>
  );
}

import "@/app/globals.css";
import { Inter } from "next/font/google"; // global font
import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maxxed Out",
  description: "My Portfolio and Blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-main text-text-primary`}>
        {/* Header appears on every page */}
        <Header />
        
        {/* This is where your page content (Home, Blogs) is injected */}
        {children}
        
        {/* Footer appears on every page */}
        <Footer />
      </body>
    </html>
  );
}

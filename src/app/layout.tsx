import "@/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Maxxed Out",
  description: "Reaching your elevated potential: enhance productivity, elevate focus & drive, stategic planning & more",
   icons: {
    icon: [
      { url: "/static-media/favicons/favicon-32x32.png" },
      { url: "/static-media/favicons/favicon-16x16.png" },
    ],
    apple: [
      { url: "/static-media/favicons/apple-touch-icon.png" },
    ],
    other: [
      { url: "/static-media/favicons/favicon.ico" },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
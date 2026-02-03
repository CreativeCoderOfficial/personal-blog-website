import Header from "@/components/general/Header";
import Footer from "@/components/general/Footer";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-main text-text-primary min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
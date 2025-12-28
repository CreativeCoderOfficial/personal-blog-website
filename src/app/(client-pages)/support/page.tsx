import AboutSection from "@/components/support/AboutSection";
import DonationForm from "@/components/support/DonationForm";

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-main flex flex-col">

      <div className="flex-1 container mx-auto px-6 lg:px-10 xl:px-16 py-32">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* COLUMN 1: Donation Form 
             - Desktop: Order 1 (Left)
             - Mobile: Order 2 (Bottom)
          */}
          <div className="order-2 lg:order-2">
             <DonationForm />
          </div>

          {/* COLUMN 2: About Section 
             - Desktop: Order 2 (Right)
             - Mobile: Order 1 (Top)
          */}
          <div className="order-1 lg:order-1">
            <AboutSection />
          </div>

        </div>

      </div>
    </main>
  );
}
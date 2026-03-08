// src/components/general/PageWrapper.tsx

import { ReactNode } from "react";
import PageHeader from "@/components/general/PageHeader";
import PageContainer from "@/components/general/PageContainer";

interface PageWrapperProps {
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
}

export default function PageWrapper({ title, subtitle, children }: PageWrapperProps) {
  return (
    <main className="min-h-screen bg-main">
      {/* Header renders its own PageContainer internally for the title/subtitle */}
      <PageHeader title={title} subtitle={subtitle} />

      {/* Content area — same padding as PageHeader so everything lines up */}
      <PageContainer>
        {children}
      </PageContainer>
    </main>
  );
}
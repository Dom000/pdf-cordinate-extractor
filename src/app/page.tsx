import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Toolkit from "@/components/landing/Toolkit";
import FinalCta from "@/components/landing/FinalCta";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Toolkit />
      <FinalCta />
    </main>
  );
}

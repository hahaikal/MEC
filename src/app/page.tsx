import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Programs } from "@/components/landing/programs";
import { WhyUs } from "@/components/landing/why-us";
import { Gallery } from "@/components/landing/gallery";
import { Testimonials } from "@/components/landing/testimonials";
import { CTABanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="bg-background">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Programs />
        <WhyUs />
        <Gallery />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}

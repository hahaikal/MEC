import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Programs } from "@/components/landing/programs";
import { WhyUs } from "@/components/landing/why-us";
import { Gallery } from "@/components/landing/gallery";
import { Testimonials } from "@/components/landing/testimonials";
import { CTABanner } from "@/components/landing/cta-banner";
import { Footer } from "@/components/landing/footer";
import { getSystemSettings } from "@/actions/settings";

export default async function LandingPage() {
  const settings = await getSystemSettings() || {};
  const phone = settings.schoolPhone || "+62 812-7425-6077";
  const email = settings.schoolEmail || "myenglishcoursebaganbatu@gmail.com";

  return (
    <div className="bg-background">
      <Navbar phone={phone} />
      <main>
        <Hero phone={phone} />
        <About />
        <Programs phone={phone} />
        <WhyUs />
        <Gallery />
        <Testimonials />
        <CTABanner phone={phone} />
      </main>
      <Footer phone={phone} email={email} />
    </div>
  );
}

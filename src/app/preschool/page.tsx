import { Navbar } from "@/components/preschool-landing/Navbar";
import { Hero } from "@/components/preschool-landing/Hero";
import { WhyChoose } from "@/components/preschool-landing/WhyChoose";
import { Classes } from "@/components/preschool-landing/Classes";
import { Gallery } from "@/components/preschool-landing/Gallery";
import { Experts } from "@/components/preschool-landing/Experts";
import { FooterSection } from "@/components/preschool-landing/FooterSection";
import { getPublicPreschoolTeachers } from "@/actions/parent-hub-public";
import { getSystemSettings } from "@/actions/settings";

export const metadata = {
  title: "MEC Preschool | Bright Future Starts Here",
  description: "MEC Preschool helps your little one grow confidently through fun, safe, and loving English learning.",
};

export default async function PreschoolLandingPage() {
  const teachersData = await getPublicPreschoolTeachers();
  
  const teachers = teachersData.map((t: any) => ({
    name: t.name,
    role: t.role || "Preschool Teacher",
    img: t.image || "",
  }));

  const settings = await getSystemSettings() || {};
  const phone = settings.schoolPhone || "+62 812-7425-6077";
  const email = settings.schoolEmail || "myenglishcoursebaganbatu@gmail.com";
  const address = "Jl. Lancang Kuning Bagan Batu, Kec. Bagan Sinembah, Rokan Hilir";

  return (
    <div className="preschool-theme bg-background text-foreground min-h-screen">
      <Navbar phone={phone} />
      <main>
        <Hero phone={phone} />
        <WhyChoose phone={phone} />
        <Classes phone={phone} />
        <Gallery />
        <Experts teachers={teachers} />
      </main>
      <FooterSection phone={phone} email={email} address={address} />
    </div>
  );
}

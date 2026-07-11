import { Navbar } from "@/components/preschool-landing/Navbar";
import { Hero } from "@/components/preschool-landing/Hero";
import { WhyChoose } from "@/components/preschool-landing/WhyChoose";
import { Classes } from "@/components/preschool-landing/Classes";
import { Gallery } from "@/components/preschool-landing/Gallery";
import { Experts } from "@/components/preschool-landing/Experts";
import { FooterSection } from "@/components/preschool-landing/FooterSection";
import { getPublicPreschoolTeachers } from "@/actions/parent-hub-public";

export const metadata = {
  title: "MEC Preschool | Bright Future Starts Here",
  description: "MEC Preschool helps your little one grow confidently through fun, safe, and loving English learning.",
};

export default async function PreschoolLandingPage() {
  const teachersData = await getPublicPreschoolTeachers();
  
  const teachers = teachersData.map((t: any) => ({
    name: t.name,
    role: "Preschool Teacher", // or t.role
    img: t.image || "",
  }));

  return (
    <div className="preschool-theme bg-background text-foreground min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <WhyChoose />
        <Classes />
        <Gallery />
        <Experts teachers={teachers} />
      </main>
      <FooterSection />
    </div>
  );
}

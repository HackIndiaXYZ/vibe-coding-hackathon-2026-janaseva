import { createFileRoute } from "@tanstack/react-router";
import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { LandingFooter } from "@/components/landing/footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JanMitra AI — From Complaint to Resolution" },
      { name: "description", content: "AI-powered civic reporting. Snap a photo, let AI write the complaint, route it to the right Telangana authority, rally your community." },
      { property: "og:title", content: "JanMitra AI — From Complaint to Resolution" },
      { property: "og:description", content: "Upload a photo. Let AI identify the issue, generate a complaint, find the right authority." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <LandingFooter />
    </div>
  );
}

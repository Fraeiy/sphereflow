import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Architecture } from "@/components/landing/Architecture";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="architecture">
        <Architecture />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <CTA />
      <footer className="border-t border-border px-6 py-8 text-center text-sm text-muted-foreground">
        <p>© 2026 SphereFlow · Built for Unicity Sphere</p>
      </footer>
    </main>
  );
}
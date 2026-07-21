import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Architecture } from "@/components/landing/Architecture";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CTA } from "@/components/landing/CTA";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div className="app-mesh">
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
        <footer className="border-t border-white/[0.06] px-6 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
            <p>© 2026 SphereFlow · Unicity Sphere</p>
            <p className="font-mono text-xs">
              Policy · Astrid gates · Sphere Connect v2
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
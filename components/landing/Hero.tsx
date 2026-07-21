"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepthCard } from "@/components/ui/depth-card";
import { SPHEREFLOW_FERRO_COLORS } from "@/components/ui/ferrofluid";

const Ferrofluid = dynamic(
  () => import("@/components/ui/ferrofluid").then((m) => m.Ferrofluid),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(232,163,23,0.14), transparent 65%), #070708",
        }}
      />
    ),
  }
);

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
      {/* Optimized Ferrofluid — SphereFlow gold palette */}
      <div className="absolute inset-0 z-0">
        <Ferrofluid
          className="h-full w-full"
          colors={[...SPHEREFLOW_FERRO_COLORS]}
          backgroundColor="#070708"
          speed={0.32}
          scale={1.4}
          turbulence={0.8}
          fluidity={0.14}
          rimWidth={0.17}
          sharpness={2.6}
          shimmer={0.85}
          glow={1.55}
          flowDirection="down"
          opacity={0.7}
          mouseInteraction
          mouseStrength={0.8}
          mouseRadius={0.28}
          mouseDampening={0.22}
          mixBlendMode="screen"
          targetFps={28}
          maxDpr={1.15}
        />
        {/* Soft vignette so text stays readable */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070708]/50 via-[#070708]/45 to-[#070708]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#070708_85%)] opacity-70" />
        <div className="app-grid pointer-events-none absolute inset-0 opacity-25" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary/90">
            Unicity Epoch Four
          </p>
          <h1 className="mt-4 font-display text-[2.15rem] font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-[4rem]">
            Autonomous treasury
            <span className="mt-1 block text-gradient-gold">
              for Sphere agents
            </span>
          </h1>
          <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-6 sm:text-base">
            Financial mandates in natural language. Astrid-aligned capability
            gates. Deterministic policy execution and Sphere SDK settlement.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/login">
                Connect Wallet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full border-white/15 bg-black/40 backdrop-blur-sm sm:w-auto"
            >
              <Link href="/dashboard">Explore Dashboard</Link>
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-6 sm:mt-14 sm:gap-6 sm:pt-8">
            {[
              { label: "Settlement", value: "Sphere SDK" },
              { label: "Safety", value: "Astrid gates" },
              { label: "Network", value: "testnet2" },
            ].map((item) => (
              <div key={item.label}>
                <dt className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {item.label}
                </dt>
                <dd className="mt-1 font-mono text-sm font-medium text-foreground">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <motion.div
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <DepthCard glow tilt className="w-full">
              <div className="p-6">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                  <span className="font-mono text-xs text-muted-foreground">
                    treasury_agent.session
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
                <div className="mt-5 space-y-3 font-mono text-[13px] leading-relaxed">
                  <p className="text-muted-foreground">
                    <span className="text-primary/80">→</span> mandate received
                  </p>
                  <p className="rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2.5 text-foreground/90">
                    Reserve 100 UCT · Daily cap 25 UCT · Auto-approve &lt; 10
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-emerald-400/80">✓</span> policy
                    validated
                  </p>
                  <p className="text-muted-foreground">
                    <span className="text-emerald-400/80">✓</span> awaiting
                    sphere settlement
                  </p>
                </div>
              </div>
            </DepthCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SceneOrb } from "@/components/ui/scene-orb";
import { DepthCard } from "@/components/ui/depth-card";

export function Hero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden px-4 pb-16 pt-24 sm:px-6 sm:pb-20 sm:pt-28">
      <div className="app-grid pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
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
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
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
          <SceneOrb size="lg" className="absolute -right-8 opacity-90" />
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
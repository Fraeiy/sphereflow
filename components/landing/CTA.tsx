"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepthCard } from "@/components/ui/depth-card";
import { Magnet, ShinyText } from "@/components/react-bits";

export function CTA() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl"
      >
        <DepthCard glow tilt={false}>
          <div className="relative overflow-hidden px-6 py-12 text-center sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,163,23,0.12),transparent_65%)]" />
            <ShinyText
              text="Get started"
              className="relative text-[11px] font-medium uppercase tracking-[0.28em]"
              speed={3.5}
              color="rgba(232,163,23,0.8)"
              shineColor="#f5d061"
            />
            <h2 className="relative mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Deploy your autonomous treasury
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-sm text-muted-foreground sm:text-base">
              Production architecture with policy enforcement and real Sphere
              settlement.
            </p>
            <div className="relative mt-8">
              <Magnet magnetStrength={4} padding={60} wrapperClassName="w-full sm:w-auto">
                <Button asChild size="lg" className="w-full sm:w-auto">
                  <Link href="/login">
                    Connect Sphere Wallet
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnet>
            </div>
          </div>
        </DepthCard>
      </motion.div>
    </section>
  );
}

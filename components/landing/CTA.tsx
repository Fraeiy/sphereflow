"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepthCard } from "@/components/ui/depth-card";

export function CTA() {
  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-4xl"
      >
        <DepthCard glow tilt={false}>
          <div className="relative overflow-hidden px-8 py-14 text-center sm:px-12">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(232,163,23,0.12),transparent_65%)]" />
            <h2 className="relative font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Deploy your autonomous treasury
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-muted-foreground">
              Built for the Unicity Epoch Four Builder Program. Production
              architecture, real Sphere settlement.
            </p>
            <Button asChild size="lg" className="relative mt-8">
              <Link href="/login">
                Connect Sphere Wallet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </DepthCard>
      </motion.div>
    </section>
  );
}
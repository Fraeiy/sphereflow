"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="px-6 py-24">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mx-auto max-w-3xl rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-transparent p-12 text-center"
      >
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to automate your treasury?
        </h2>
        <p className="mt-4 text-muted-foreground">
          Join the Unicity Epoch Four Builder Program with a Gold-tier
          autonomous agent application.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link href="/login">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </section>
  );
}
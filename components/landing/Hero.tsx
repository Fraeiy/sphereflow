"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-32">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="gold" className="mb-6">
            Unicity Epoch Four Builder Program
          </Badge>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Your Autonomous
            <span className="block bg-gradient-to-r from-primary to-[#D4AF37] bg-clip-text text-transparent">
              AI Treasury
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Set financial mandates in natural language. The policy engine
            validates every action. Sphere SDK settles on-chain. Like Cursor,
            but for treasury management.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/login">
                Connect Sphere Wallet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">View Demo Dashboard</Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-16 max-w-3xl rounded-2xl border border-border bg-card/80 p-1 backdrop-blur"
        >
          <div className="rounded-xl bg-background p-6 text-left">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Treasury Chat
            </div>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary">
                &quot;Keep 100 UCT in reserve. Never spend more than 25 UCT/day.
                Auto-pay invoices below 10 UCT.&quot;
              </div>
              <div className="rounded-lg border border-border px-4 py-3 text-sm">
                <p className="text-muted-foreground">
                  I&apos;ve configured your treasury policy:
                </p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Reserve: 100 UCT</li>
                  <li>• Daily limit: 25 UCT</li>
                  <li>• Auto-approve threshold: 10 UCT</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  Policy engine validated · Ready for autonomous execution
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
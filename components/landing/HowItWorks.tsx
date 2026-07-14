"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Fund treasury",
    description:
      "Connect Sphere wallet on testnet2. UCT balances sync in real time via Sphere Connect.",
  },
  {
    step: "02",
    title: "Issue mandate",
    description:
      "Define reserves, velocity limits, and approval rules through the treasury agent interface.",
  },
  {
    step: "03",
    title: "Policy enforcement",
    description:
      "The engine validates every payment against compiled rules before any settlement attempt.",
  },
  {
    step: "04",
    title: "Autonomous settlement",
    description:
      "Approved transfers execute through Sphere SDK with full activity attribution.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-28" id="how-it-works">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.28em] text-primary/80">
          Workflow
        </p>
        <h2 className="mt-3 text-center font-display text-3xl font-semibold tracking-tight">
          Four steps to autonomous treasury
        </h2>

        <div className="relative mt-16 space-y-0">
          <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/40 via-white/10 to-transparent" />
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              <div className="relative z-[1] flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/[0.08] font-mono text-xs font-semibold text-primary shadow-[0_0_20px_rgba(232,163,23,0.12)]">
                {item.step}
              </div>
              <div className="pt-1">
                <h3 className="font-display text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
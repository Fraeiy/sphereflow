"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "User", sub: "Financial mandate" },
  { label: "Chat", sub: "Natural language" },
  { label: "LLM", sub: "Structured JSON plan" },
  { label: "Policy Engine", sub: "Validation" },
  { label: "Sphere SDK", sub: "Settlement" },
  { label: "Activity Log", sub: "Audit trail" },
];

export function Architecture() {
  return (
    <section className="border-y border-border bg-card/30 px-6 py-24">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          The LLM never controls money
        </h2>
        <p className="mt-4 text-muted-foreground">
          A strict separation between AI planning and financial execution.
        </p>

        <div className="mt-16 flex flex-col items-center gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
          {steps.map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <div className="rounded-xl border border-border bg-card px-4 py-3 text-left">
                <p className="text-sm font-semibold">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.sub}</p>
              </div>
              {i < steps.length - 1 && (
                <span className="hidden text-muted-foreground sm:inline">↓</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
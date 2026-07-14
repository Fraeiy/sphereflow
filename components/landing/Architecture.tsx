"use client";

import { motion } from "framer-motion";

const steps = [
  { label: "Operator", sub: "Financial mandate" },
  { label: "Intent Layer", sub: "Natural language" },
  { label: "LLM Planner", sub: "Structured JSON" },
  { label: "Policy Engine", sub: "Validation" },
  { label: "Sphere SDK", sub: "Settlement" },
  { label: "Audit Log", sub: "Immutable trail" },
];

export function Architecture() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.01] px-6 py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary/80">
            Architecture
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            LLM plans. Policy executes.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Capital never flows through the language model. Execution is
            deterministic and auditable at every step.
          </p>
        </div>

        <div className="perspective-scene mt-16">
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3"
            initial={{ opacity: 0, rotateX: 8 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-3">
                <div
                  className="depth-panel-elevated min-w-[140px] rounded-xl px-4 py-3.5 text-left"
                  style={{
                    transform: `translateZ(${i * 4}px)`,
                  }}
                >
                  <p className="font-mono text-xs font-medium text-foreground">
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {step.sub}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <span className="hidden font-mono text-muted-foreground/50 sm:inline">
                    →
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
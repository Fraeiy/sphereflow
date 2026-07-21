"use client";

import { motion } from "framer-motion";
import { ShinyText } from "@/components/react-bits";

const steps = [
  { label: "Operator", sub: "Financial mandate" },
  { label: "LLM Planner", sub: "Structured JSON" },
  { label: "Astrid Gates", sub: "Capabilities" },
  { label: "Policy Engine", sub: "Validation" },
  { label: "Sphere SDK", sub: "Settlement" },
  { label: "Receipts", sub: "Session audit" },
];

export function Architecture() {
  return (
    <section className="border-y border-white/[0.06] bg-white/[0.01] px-4 py-16 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <ShinyText
            text="Architecture"
            className="text-[11px] font-medium uppercase tracking-[0.28em]"
            speed={4}
            color="rgba(232,163,23,0.75)"
            shineColor="#f5d061"
          />
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            LLM plans. Astrid gates. Policy executes.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground sm:text-base">
            Capital never flows through the language model. Capabilities,
            thresholds, and the policy engine keep settlement deterministic.
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
                  className="depth-panel-elevated min-w-[120px] rounded-xl px-3 py-3 text-left sm:min-w-[140px] sm:px-4 sm:py-3.5"
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
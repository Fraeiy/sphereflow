"use client";

import { motion } from "framer-motion";

const steps = [
  {
    step: "01",
    title: "Deposit UCT",
    description:
      "Connect your Sphere wallet and deposit UCT into your treasury. Real balances via Sphere Connect.",
  },
  {
    step: "02",
    title: "Set Your Mandate",
    description:
      "Chat with the AI agent. Describe how you want your treasury managed in plain English.",
  },
  {
    step: "03",
    title: "Policy Engine Executes",
    description:
      "Structured policies validate every payment. Reserve limits, wallet rules, and budgets are enforced.",
  },
  {
    step: "04",
    title: "Autonomous Settlement",
    description:
      "Approved payments settle through the Sphere SDK. Full activity timeline for audit and compliance.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center text-3xl font-bold tracking-tight">
          How it works
        </h2>

        <div className="mt-16 space-y-8">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex gap-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary">
                {item.step}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-muted-foreground">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
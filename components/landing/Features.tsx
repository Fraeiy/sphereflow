"use client";

import { motion } from "framer-motion";
import {
  Bot,
  Shield,
  Zap,
  Lock,
  ArrowLeftRight,
  BarChart3,
} from "lucide-react";
import { DepthCard } from "@/components/ui/depth-card";

const features = [
  {
    icon: Bot,
    title: "Mandate Interface",
    description:
      "Operators define treasury rules in plain language. The agent compiles mandates into auditable policy structures.",
  },
  {
    icon: Shield,
    title: "Policy Engine",
    description:
      "Every outbound transfer passes deterministic validation — reserves, limits, wallet rules — before execution.",
  },
  {
    icon: Zap,
    title: "Sphere Settlement",
    description:
      "Approved actions settle via Sphere Connect on testnet2 with full identity and transfer attribution.",
  },
  {
    icon: Lock,
    title: "Reserve Controls",
    description:
      "Hard reserve floors, velocity limits, and approval thresholds enforced without LLM involvement.",
  },
  {
    icon: ArrowLeftRight,
    title: "Payment Rails",
    description:
      "Instant, scheduled, recurring, and invoice flows with policy-gated approval and activity logging.",
  },
  {
    icon: BarChart3,
    title: "Treasury Analytics",
    description:
      "Health scoring, category breakdowns, and exportable reports for operational oversight.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-primary/80">
            Capabilities
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Infrastructure-grade treasury automation
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Designed for operators who need enforceable policy, not chatbot
            theatrics.
          </p>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
            >
              <DepthCard tilt className="h-full">
                <div className="p-6">
                  <div className="mb-4 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </DepthCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
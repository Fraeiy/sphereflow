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
import { SpotlightCard } from "@/components/react-bits";
import { ShinyText } from "@/components/react-bits";
import { cn } from "@/lib/utils";

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
    <section className="px-4 py-16 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <ShinyText
            text="Capabilities"
            className="text-[11px] font-medium uppercase tracking-[0.28em]"
            speed={4}
            color="rgba(232,163,23,0.75)"
            shineColor="#f5d061"
          />
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
            Infrastructure-grade treasury automation
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Designed for operators who need enforceable policy, not chatbot
            theatrics.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.45 }}
            >
              <SpotlightCard
                className={cn(
                  "depth-panel h-full rounded-2xl border border-white/[0.06] p-5 sm:p-6",
                  "transition-colors hover:border-white/12"
                )}
                spotlightColor="rgba(232, 163, 23, 0.2)"
              >
                <div className="mb-4 inline-flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-2.5">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Bot,
    title: "Natural Language Mandates",
    description:
      "Tell the AI how to manage your treasury. It converts instructions into structured, executable policies.",
  },
  {
    icon: Shield,
    title: "Policy Engine Guardrails",
    description:
      "The LLM never touches money. Every action passes through deterministic validation before settlement.",
  },
  {
    icon: Zap,
    title: "Sphere SDK Settlement",
    description:
      "Real transfers via Unicity Sphere Connect. Wallet connection, identity, and on-chain finality.",
  },
  {
    icon: Lock,
    title: "Reserve & Limits",
    description:
      "Reserve funds, daily/weekly limits, auto-approve thresholds, and wallet allowlists — all enforced.",
  },
  {
    icon: ArrowLeftRight,
    title: "Autonomous Payments",
    description:
      "Instant, scheduled, recurring, invoice, and escrow payments — validated and tracked automatically.",
  },
  {
    icon: BarChart3,
    title: "Treasury Analytics",
    description:
      "Health scores, spending reports, category breakdowns, and agent activity timelines.",
  },
];

export function Features() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Treasury management, reimagined
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for the Unicity Sphere ecosystem with production-grade architecture.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full transition-colors hover:border-primary/30">
                <CardHeader>
                  <div className="mb-2 w-fit rounded-lg bg-primary/10 p-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
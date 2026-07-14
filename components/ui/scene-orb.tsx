"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SceneOrbProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-48 w-48",
  md: "h-72 w-72",
  lg: "h-96 w-96",
};

export function SceneOrb({ className, size = "md" }: SceneOrbProps) {
  return (
    <div
      className={cn(
        "pointer-events-none perspective-scene select-none",
        className
      )}
      aria-hidden
    >
      <motion.div
        className={cn("relative orb-3d", sizeMap[size])}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Core sphere */}
        <div
          className="absolute inset-[12%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, rgba(245,208,97,0.9) 0%, rgba(232,163,23,0.5) 35%, rgba(17,17,19,0.95) 72%)",
            boxShadow:
              "0 0 80px rgba(232,163,23,0.25), inset -12px -16px 32px rgba(0,0,0,0.5), inset 8px 8px 24px rgba(255,255,255,0.08)",
            transform: "translateZ(40px)",
          }}
        />

        {/* Orbit ring */}
        <div
          className="absolute inset-0 rounded-full border border-primary/20"
          style={{
            transform: "rotateX(72deg) rotateZ(15deg) translateZ(20px)",
            boxShadow: "0 0 40px rgba(232,163,23,0.15)",
          }}
        />

        {/* Secondary ring */}
        <div
          className="absolute inset-[8%] rounded-full border border-white/10"
          style={{
            transform: "rotateX(55deg) rotateY(-20deg) translateZ(10px)",
          }}
        />

        {/* Glow halo */}
        <div
          className="orb-glow absolute inset-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(232,163,23,0.35) 0%, transparent 70%)",
          }}
        />

        {/* Floating nodes */}
        {[0, 120, 240].map((deg, i) => (
          <motion.div
            key={deg}
            className="absolute h-2 w-2 rounded-full bg-primary/80 shadow-[0_0_12px_rgba(232,163,23,0.8)]"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(130%) translateY(-50%) translateZ(60px)`,
            }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 2.5,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
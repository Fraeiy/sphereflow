"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface DepthCardProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  tilt?: boolean;
  glow?: boolean;
}

export function DepthCard({
  children,
  className,
  innerClassName,
  tilt = true,
  glow = false,
}: DepthCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  });

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (!tilt || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={cn("perspective-scene", className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={
        tilt
          ? { rotateX, rotateY, transformStyle: "preserve-3d" }
          : undefined
      }
    >
      <div
        className={cn(
          "depth-panel relative overflow-hidden rounded-2xl",
          glow && "border-gradient",
          innerClassName
        )}
      >
        {glow && (
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--primary-glow)" }}
          />
        )}
        <div className="relative z-[1]">{children}</div>
      </div>
    </motion.div>
  );
}
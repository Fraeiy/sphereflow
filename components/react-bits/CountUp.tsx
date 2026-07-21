"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  delay?: number;
  className?: string;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
}

/** React Bits CountUp — spring counter via framer-motion (already in project). */
export function CountUp({
  to,
  from = 0,
  duration = 1.4,
  delay = 0,
  className,
  decimals,
  prefix = "",
  suffix = "",
  separator = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const motionValue = useMotionValue(from);
  const spring = useSpring(motionValue, {
    damping: 28,
    stiffness: 90 / Math.max(duration, 0.3),
  });
  const inView = useInView(ref, { once: true, margin: "-20px" });

  const maxDecimals =
    decimals ??
    Math.max(
      (String(from).split(".")[1] || "").length,
      (String(to).split(".")[1] || "").length
    );

  useEffect(() => {
    if (!ref.current) return;
    if (reduced) {
      ref.current.textContent = `${prefix}${format(to, maxDecimals, separator)}${suffix}`;
      return;
    }
    if (inView) {
      const t = window.setTimeout(() => motionValue.set(to), delay * 1000);
      return () => clearTimeout(t);
    }
  }, [
    inView,
    to,
    delay,
    motionValue,
    reduced,
    prefix,
    suffix,
    maxDecimals,
    separator,
  ]);

  useEffect(() => {
    if (reduced) return;
    const unsub = spring.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${prefix}${format(v, maxDecimals, separator)}${suffix}`;
      }
    });
    return unsub;
  }, [spring, prefix, suffix, maxDecimals, separator, reduced]);

  return (
    <span className={cn("tabular-nums", className)} ref={ref}>
      {prefix}
      {format(from, maxDecimals, separator)}
      {suffix}
    </span>
  );
}

function format(n: number, decimals: number, grouping: boolean) {
  return Intl.NumberFormat("en-US", {
    useGrouping: grouping,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

export default CountUp;

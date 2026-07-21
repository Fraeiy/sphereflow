"use client";

import { cn } from "@/lib/utils";
import "./shiny-text.css";

interface ShinyTextProps {
  text: string;
  className?: string;
  disabled?: boolean;
  /** Seconds per sweep */
  speed?: number;
  color?: string;
  shineColor?: string;
  as?: "span" | "p" | "h1" | "h2" | "h3";
}

/**
 * React Bits ShinyText — CSS-only shine (no rAF).
 * Optimized: pure animation, pauses under reduced-motion.
 */
export function ShinyText({
  text,
  className,
  disabled = false,
  speed = 3,
  color = "#8b8b95",
  shineColor = "#f5d061",
  as: Tag = "span",
}: ShinyTextProps) {
  return (
    <Tag
      className={cn("shiny-text", disabled && "shiny-text--off", className)}
      style={
        {
          "--shiny-color": color,
          "--shiny-shine": shineColor,
          "--shiny-duration": `${speed}s`,
        } as React.CSSProperties
      }
    >
      {text}
    </Tag>
  );
}

export default ShinyText;

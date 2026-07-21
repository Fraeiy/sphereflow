"use client";

import {
  useCallback,
  useRef,
  type CSSProperties,
  type ReactNode,
  type MouseEvent,
} from "react";
import { useCanHoverFx } from "@/hooks/use-media-pref";
import { cn } from "@/lib/utils";
import "./spotlight-card.css";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** CSS color for the spotlight (gold default matches SphereFlow) */
  spotlightColor?: string;
  style?: CSSProperties;
}

/** React Bits SpotlightCard — cursor light on hover (desktop). */
export function SpotlightCard({
  children,
  className,
  spotlightColor = "rgba(232, 163, 23, 0.18)",
  style,
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const canHover = useCanHoverFx();
  const rafRef = useRef(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!canHover || !divRef.current) return;
      if (rafRef.current) return;
      const el = divRef.current;
      const { clientX, clientY } = e;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0;
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
        el.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
        el.style.setProperty("--spotlight-color", spotlightColor);
      });
    },
    [canHover, spotlightColor]
  );

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={cn("card-spotlight", className)}
      style={style}
    >
      {children}
    </div>
  );
}

export default SpotlightCard;

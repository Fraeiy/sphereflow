"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useCanHoverFx } from "@/hooks/use-media-pref";
import { cn } from "@/lib/utils";

interface MagnetProps {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  wrapperClassName?: string;
  innerClassName?: string;
}

/** React Bits Magnet — pointer magnetic pull (desktop hover only). */
export function Magnet({
  children,
  padding = 80,
  disabled = false,
  magnetStrength = 3.5,
  wrapperClassName,
  innerClassName,
}: MagnetProps) {
  const canHover = useCanHoverFx();
  const off = disabled || !canHover;
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (off) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!magnetRef.current) return;
      const { left, top, width, height } =
        magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        setPosition({
          x: (e.clientX - centerX) / magnetStrength,
          y: (e.clientY - centerY) / magnetStrength,
        });
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [off, padding, magnetStrength]);

  return (
    <div
      ref={magnetRef}
      className={cn("relative inline-block", wrapperClassName)}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isActive
            ? "transform 0.25s ease-out"
            : "transform 0.45s ease-in-out",
          willChange: off ? undefined : "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default Magnet;

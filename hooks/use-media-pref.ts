"use client";

import { useEffect, useState } from "react";

function useMediaQuery(query: string, defaultValue = false) {
  const [matches, setMatches] = useState(defaultValue);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/** True when user prefers reduced motion */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

/** True for touch / coarse pointers (phones, tablets) */
export function useIsCoarsePointer() {
  return useMediaQuery("(hover: none), (pointer: coarse)");
}

/** Desktop hover devices only — safe for magnet / heavy pointer FX */
export function useCanHoverFx() {
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();
  return !reduced && !coarse;
}

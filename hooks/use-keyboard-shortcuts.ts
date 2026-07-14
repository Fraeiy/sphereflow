"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useKeyboardShortcuts(onCommandPalette?: () => void) {
  const router = useRouter();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key === "k") {
        e.preventDefault();
        onCommandPalette?.();
      }

      if (meta && e.shiftKey && e.key === "D") {
        e.preventDefault();
        router.push("/dashboard");
      }

      if (meta && e.shiftKey && e.key === "C") {
        e.preventDefault();
        router.push("/chat");
      }

      if (meta && e.shiftKey && e.key === "P") {
        e.preventDefault();
        router.push("/payments");
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [router, onCommandPalette]);
}
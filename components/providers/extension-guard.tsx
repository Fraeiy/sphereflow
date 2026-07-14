"use client";

import { useEffect } from "react";

/**
 * Suppresses benign wallet-extension injection conflicts (e.g. Phantom vs MetaMask
 * both defining window.ethereum). SphereFlow uses Sphere Connect, not EVM providers.
 */
export function ExtensionGuard() {
  useEffect(() => {
    const suppressExtensionConflict = (event: ErrorEvent) => {
      const message = event.message ?? "";
      const source = event.filename ?? "";

      const isExtensionSource = source.includes("chrome-extension://");
      const isEthereumConflict =
        message.includes("Cannot redefine property: ethereum") ||
        message.includes("Cannot set property ethereum");

      if (isExtensionSource && isEthereumConflict) {
        event.preventDefault();
        console.debug(
          "[SphereFlow] Suppressed wallet extension conflict — Sphere Connect is unaffected."
        );
        return true;
      }

      return false;
    };

    const suppressUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = String(event.reason ?? "");
      if (
        reason.includes("Cannot redefine property: ethereum") ||
        reason.includes("Cannot set property ethereum")
      ) {
        event.preventDefault();
        console.debug(
          "[SphereFlow] Suppressed wallet extension promise rejection."
        );
      }
    };

    window.addEventListener("error", suppressExtensionConflict);
    window.addEventListener("unhandledrejection", suppressUnhandledRejection);

    return () => {
      window.removeEventListener("error", suppressExtensionConflict);
      window.removeEventListener("unhandledrejection", suppressUnhandledRejection);
    };
  }, []);

  return null;
}
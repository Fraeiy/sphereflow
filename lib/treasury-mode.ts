const MODE_KEY = "sphereflow:mode";

export type TreasuryMode = "live" | "demo";

export function getTreasuryMode(): TreasuryMode {
  if (typeof window === "undefined") return "demo";
  return (localStorage.getItem(MODE_KEY) as TreasuryMode) ?? "demo";
}

export function setTreasuryMode(mode: TreasuryMode): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MODE_KEY, mode);
}

export function isLiveMode(): boolean {
  return getTreasuryMode() === "live";
}
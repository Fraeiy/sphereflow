export const APP_NAME = "SphereFlow";
export const APP_TAGLINE = "Your Autonomous AI Treasury";
export const APP_DESCRIPTION =
  "AI-powered treasury management for Unicity Sphere. Set financial mandates, let the policy engine execute — every settlement through Sphere SDK.";

export const COLORS = {
  background: "#09090B",
  card: "#18181B",
  primary: "#F59E0B",
  gold: "#D4AF37",
  border: "#27272A",
  muted: "#71717A",
} as const;

export const SPHERE_WALLET_URL =
  process.env.NEXT_PUBLIC_SPHERE_WALLET_URL ?? "https://sphere.unicity.network";

/**
 * Optional override for UCT coin id (64-char lowercase hex).
 * Prefer resolving from sphere_getAssets at runtime — SDK 0.12 rejects symbols.
 */
export const UCT_COIN_ID = process.env.NEXT_PUBLIC_UCT_COIN_ID ?? "";

/** Sphere SDK default — UCT uses 18 decimal places on testnet2. */
export const UCT_DECIMALS = 18;

/** Connect / trust-base network id for testnet2 (SPHERE_NETWORKS.testnet2). */
export const SPHERE_TESTNET2_NETWORK_ID = 4;

export const DEFAULT_POLICY = {
  reserveBalance: 0,
  dailySpendLimit: 100,
  weeklySpendLimit: 500,
  monthlyBudget: 2000,
  maxSingleTransaction: 50,
  autoApproveThreshold: 10,
  allowedWallets: [] as string[],
  blockedWallets: [] as string[],
  emergencyFreeze: false,
};

export const SUGGESTED_PROMPTS = [
  "Manage my treasury autonomously",
  "Keep 100 UCT in reserve",
  "Spend maximum 20 UCT daily",
  "Automatically pay invoices below 10 UCT",
  "Reject wallets I don't know",
  "Pay developers automatically",
  "Pause all recurring payments",
  "Generate monthly report",
];

export const PAYMENT_CATEGORIES = [
  "Operations",
  "Development",
  "Infrastructure",
  "Marketing",
  "Legal",
  "Subscriptions",
  "Contractors",
  "Other",
] as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/chat", label: "AI Treasury", icon: "MessageSquare" },
  { href: "/policies", label: "Policies", icon: "Shield" },
  { href: "/activity", label: "Agent Activity", icon: "Activity" },
  { href: "/payments", label: "Payments", icon: "ArrowLeftRight" },
  { href: "/reports", label: "Reports", icon: "BarChart3" },
  { href: "/agent", label: "Agent Runtime", icon: "Box" },
] as const;
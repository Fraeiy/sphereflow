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

export const UCT_COIN_ID =
  process.env.NEXT_PUBLIC_UCT_COIN_ID ?? "UCT";

export const UCT_DECIMALS = 6;

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
] as const;
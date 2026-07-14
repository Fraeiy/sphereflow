import type { TreasuryPlan } from "@/types/treasury";

export function generateFallbackPlan(userMessage: string): {
  content: string;
  plan: TreasuryPlan | null;
} {
  const lower = userMessage.toLowerCase();

  const reserveMatch = lower.match(/(?:reserve|keep)\s+(\d+(?:\.\d+)?)/);
  const dailyMatch = lower.match(/(?:daily|day).*?(\d+(?:\.\d+)?)/);
  const autoMatch = lower.match(/(?:below|under)\s+(\d+(?:\.\d+)?)/);

  if (reserveMatch || dailyMatch || lower.includes("manage my treasury")) {
    const reserve = reserveMatch ? parseFloat(reserveMatch[1]) : 100;
    const daily = dailyMatch ? parseFloat(dailyMatch[1]) : 25;
    const autoApprove = autoMatch ? parseFloat(autoMatch[1]) : 10;

    const plan: TreasuryPlan = {
      action: "update_policy",
      policyUpdates: {
        reserveBalance: reserve,
        dailySpendLimit: daily,
        autoApproveThreshold: autoApprove,
      },
      message: `Configured reserve at ${reserve} UCT, daily limit at ${daily} UCT, auto-approve at ${autoApprove} UCT.`,
      confidence: 0.85,
    };

    return {
      content: `I've configured your treasury policy based on your mandate.\n\n**Changes:**\n- Reserve balance: ${reserve} UCT\n- Daily spend limit: ${daily} UCT\n- Auto-approve threshold: ${autoApprove} UCT\n\nThe policy engine will validate all future payments against these rules before Sphere settlement.`,
      plan,
    };
  }

  if (lower.includes("freeze") || lower.includes("pause")) {
    const freeze = !lower.includes("unfreeze") && !lower.includes("resume");
    const plan: TreasuryPlan = {
      action: freeze ? "freeze" : "unfreeze",
      message: freeze
        ? "Emergency freeze activated."
        : "Treasury unfrozen.",
      confidence: 0.9,
    };

    return {
      content: freeze
        ? "Emergency freeze has been requested. All outgoing payments will be blocked until you lift the freeze."
        : "Treasury freeze lifted. Payments will resume per your active policy rules.",
      plan,
    };
  }

  if (lower.includes("reject") && lower.includes("wallet")) {
    const plan: TreasuryPlan = {
      action: "update_policy",
      policyUpdates: {
        allowedWallets: [],
        blockedWallets: [],
      },
      message: "Configured strict wallet policy — add allowed wallets in Policies.",
      confidence: 0.7,
    };

    return {
      content:
        "To reject unknown wallets, enable an allowlist policy. Add trusted wallets in the Policies page, or tell me specific wallets to allow (e.g. \"Allow @alice and @dev-team\").",
      plan,
    };
  }

  if (lower.includes("report")) {
    return {
      content:
        "I've noted your report request. Visit the Reports page for daily, weekly, and monthly analytics with category breakdowns and export.",
      plan: {
        action: "report",
        message: "Report requested",
        confidence: 0.95,
      },
    };
  }

  return {
    content:
      "I understand your treasury mandate. For full AI-powered policy generation, configure OPENAI_API_KEY in your environment. I can still help with reserves, limits, freezes, and reports — try being specific about amounts and rules.",
    plan: null,
  };
}
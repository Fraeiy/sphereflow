# SphereFlow Product Report  
### Autonomous AI Treasury for Unicity Sphere

**Product:** SphereFlow  
**Live app:** https://sphereflow-psi.vercel.app  
**Audience:** End users with no technical background; judges and partners evaluating Unicity ecosystem fit  
**Date:** July 2026  

---

## 1. Executive summary

SphereFlow is a web application that helps people and small teams manage a **treasury of UCT** (Unicity Credit Tokens) on Unicity Sphere **without needing to understand wallets, scripts, or smart contracts**.

Users describe money rules in plain English. An AI agent turns those words into structured plans. A separate **policy engine** enforces the rules. Only after validation can payments settle through the **Sphere wallet / SDK**.

The product is needed because crypto treasuries are easy to mismanage: either everything is manual and error-prone, or automation can move funds with too few safeguards. SphereFlow is designed so that **language is flexible, but money movement is strict**.

---

## 2. Why SphereFlow is needed

### 2.1 The problem

| Approach | What goes wrong |
|----------|-----------------|
| Manual wallet use | Easy to overspend, forget reserves, lose track of who was paid |
| Unrestricted bots / AI | An agent can be tricked (prompt injection) into sending funds |
| Spreadsheets + chat | No hard enforcement; rules live only in people’s heads |

### 2.2 SphereFlow’s answer

SphereFlow separates three roles:

1. **User** — states intent (“keep 500 UCT reserved”, “pay Alice 10 UCT”).  
2. **AI** — converts intent into a plan (never signs transactions itself).  
3. **Policy engine + Sphere** — validates limits and settles only if allowed.

**One-line thesis:** *The AI plans; the policy engine decides; Sphere moves money.*

That design is valuable for:

- Project treasuries and builder-team funds  
- Anyone who wants **reserves, daily limits, and freezes** that actually stick  
- Demos and production paths where **auditability** matters  
- Reducing fear of “the chatbot controls my wallet”

---

## 3. Who it is for

| User type | How they benefit |
|-----------|------------------|
| Non-technical founder / lead | Sets rules in English; does not write code |
| Small team with shared funds | Shared policies; pending approvals; activity log |
| Builder-program participant | Shows a complete Unicity Sphere + AI product story |
| Power user | Can edit policies manually and export reports |

No prior knowledge of blockchain internals is required for the demo path. Live settlement requires a Sphere wallet connection.

---

## 4. How a user with zero knowledge uses SphereFlow

### Step 1 — Open the product

Visit **https://sphereflow-psi.vercel.app**.

The landing page explains the product. The user chooses to enter the app.

### Step 2 — Start in Demo or connect a wallet

On **Login**:

- **Demo mode** — safe practice with simulated balances and payments. Recommended for first-time users.  
- **Connect Sphere Wallet** — live testnet treasury; balances sync from Sphere Connect; payments can settle on-chain via the Sphere SDK.

A zero-knowledge user should start in **Demo**, learn the screens, then connect a wallet when ready.

### Step 3 — Read the Dashboard

The **Dashboard** is the home screen of the treasury. It shows, in plain language:

- Total balance  
- Reserved funds (protected by policy)  
- Available funds (what can be spent)  
- Monthly / daily spend against budgets  
- Treasury health score  
- Recent agent actions and transactions  

The user does not need to interpret raw blockchain data.

### Step 4 — Talk to Treasury Chat (primary workflow)

Open **Treasury Chat** and type natural language, for example:

- “Keep 500 UCT in reserve and never spend it.”  
- “Limit daily spending to 50 UCT.”  
- “Pay @alice 10 UCT for design work.”  
- “Freeze all outgoing payments.”  
- “Unfreeze payments and show me this week’s spending.”  

What the user experiences:

1. They send a message.  
2. The agent replies with an explanation and a structured plan.  
3. Allowed policy changes apply; allowed payments may be created or executed.  
4. The user can check **Policies**, **Payments**, and **Activity** to confirm results.

What the user does **not** need to do:

- Write JSON  
- Call APIs  
- Understand UCT decimal precision  
- Manually enforce “don’t touch the reserve”

### Step 5 — Review Policies

**Policies** lists every rule as cards, including:

- Reserve balance  
- Daily / weekly / monthly spend limits  
- Maximum single transaction  
- Auto-approve threshold (small payments may execute without extra approval)  
- Allowed and blocked recipient wallets  
- Emergency freeze  

Users can edit rules by clicking a card, without using chat.

### Step 6 — Create or approve Payments

On **Payments**, the user can:

- Create a payment (recipient, amount, type, category, memo)  
- See pending items that need **Approve** or **Reject**  
- Filter by status (all / completed / scheduled / pending)  

Every payment is checked against active policy before settlement. If the wallet is connected and rules pass, Sphere can settle the transfer.

### Step 7 — Check Activity and Reports

- **Activity** — timeline of autonomous decisions (policy updates, payments, freezes).  
- **Reports** — spending totals, trends, category breakdown, export for records.

This closes the loop: intent → enforcement → proof of what happened.

### Recommended first session (about five minutes)

1. Open app → **Demo**.  
2. Chat: “Set reserve to 100 UCT and daily limit to 20.”  
3. Open **Policies** → confirm numbers.  
4. **Payments** → create a small test payment.  
5. **Activity** → read the recorded events.  

That is the full product loop for a non-technical user.

---

## 5. Mental model (for training or onboarding)

| Component | Job |
|-----------|-----|
| User | Decides goals and approves edge cases |
| Treasury Chat (AI) | Translates English into structured plans |
| Policy engine | Enforces reserves, limits, freezes, allow/block lists |
| Sphere wallet / SDK | Holds UCT and executes approved transfers |
| Activity + Reports | Shows history and analytics |

**Safety claim for users:** the language model does not hold keys and does not settle transfers by itself. Settlement only happens through the validated payment path.

---

## 6. Product architecture (brief, non-technical)

```
User message
    → AI produces a plan (advisory)
    → Policy engine validates / applies rules
    → If payment allowed + wallet connected
    → Sphere SDK settles UCT
    → Activity log records the outcome
```

SphereFlow currently runs as a **Next.js web app** on Vercel, with optional OpenRouter/OpenAI for chat, local storage (and optional Supabase) for app state, and Sphere Connect for wallet operations.

---

## 7. Integration with Astrid OS (Unicity agent OS)

> Note: “Asrid OS” is understood here as **Unicity Astrid OS** (also referred to as AOS) — Unicity’s open-source **operating system for AI agents**, with a kernel, **capsules** (sandboxed extensions), capabilities, approval gates, and audit/observability.

### 7.1 What Astrid OS is (in product terms)

Astrid is not a replacement for SphereFlow’s UI. It is a **runtime underneath agents** that adds:

- Security sandboxing for agent tools  
- Explicit **capabilities** (what an agent is allowed to call)  
- **Approval gates** for sensitive actions (e.g. sending funds)  
- Observability / audit of agent behavior  

Sphere is the **wallet and settlement layer**. Astrid is the **agent execution and safety layer**. SphereFlow is currently a **web treasury product** that uses Sphere directly and runs its own policy engine in the app.

### 7.2 Is integration possible?

**Yes.** Integration is not only possible; it is a natural Unicity-stack direction. Official work already contemplates a **Sphere wallet capsule** for Astrid (`astrid-capsule-sphere` / Sphere SDK parity), so agents on Astrid can hold and move Unicity assets under capability and approval controls.

SphereFlow and Astrid solve complementary problems:

| Layer | Today (SphereFlow) | With Astrid |
|-------|--------------------|-------------|
| User interface | Web app (chat, dashboard, policies) | Can stay as web UI, or agent CLI/session |
| Intent → plan | LLM via API | Same, or agent hosted under Astrid |
| Hard money rules | SphereFlow policy engine | Policy engine + Astrid capabilities/approvals |
| Settlement | Sphere SDK in browser / server | Sphere capsule or OpenClaw Sphere plugin under Astrid |
| Audit | Activity log in app | Activity log + Astrid session receipts / bus events |

### 7.3 Practical integration paths

**Path A — Soft integration (fastest)**  
Keep SphereFlow as the product UI. Run the treasury agent logic as an Astrid-hosted agent that:

- Receives the same mandates  
- Calls Sphere only through gated tools  
- Emits Astrid audit events that SphereFlow can display  

**Path B — Capsule integration (deeper Unicity alignment)**  
Package SphereFlow’s **policy engine** (and optionally payment tools) as an **Astrid capsule** or agent skill:

- Capsule exposes tools: `update_policy`, `validate_payment`, `create_payment`  
- Capsule requests capabilities such as payment send, KV for policy state, and **approval** for amounts above threshold  
- Sphere settlement goes through the forthcoming Sphere capsule / OpenClaw Sphere path rather than ad-hoc browser-only logic  

**Path C — Full agent OS mode**  
SphereFlow becomes the **control plane UI**; Astrid becomes the **execution plane**:

- UI never holds raw spend authority beyond human approval  
- All autonomous runs are sandboxed sessions  
- Freezes, reserves, and daily limits are dual-enforced (app policy + Astrid policy)  

### 7.4 What would *not* change for end users

A zero-knowledge user would still:

1. Open a web (or agent-facing) interface  
2. Speak in plain English  
3. See policies, payments, and activity  

Astrid mainly strengthens **trust, isolation, and audit** for agent runs — especially important if the product later runs fully autonomous agents without a human watching every click.

### 7.5 Current status and recommendation

| Item | Status |
|------|--------|
| SphereFlow + Sphere SDK | Implemented (web app) |
| SphereFlow + Astrid OS | Not implemented yet; design-compatible |
| Official Sphere-on-Astrid capsule | Under evaluation / design in Astrid ecosystem |

**Recommendation for builders:** treat Astrid as a **Phase 2** platform move after the web treasury loop is solid. Highest-value first step is dual-enforcement: keep SphereFlow’s policy engine, and map each money action to an Astrid **capability + approval** boundary when a Sphere capsule is available.

---

## 8. Limitations (honest scope)

- Full AI chat requires a configured LLM API key (e.g. OpenRouter). Without it, a limited demo fallback may still handle simple rule-like requests.  
- Live settlement requires a connected Sphere wallet; Demo mode does not move real funds.  
- Astrid OS is not wired into the current production deployment.  
- The product is built for Unicity Sphere / UCT workflows, not multi-chain general banking.

---

## 9. Conclusion

SphereFlow exists so that **ordinary users can run a disciplined treasury on Unicity Sphere** using natural language, without giving an AI direct control of money. The product is needed wherever people want **automation with hard limits**.

For a beginner, usage is a short loop: **open app → set rules in chat → check policies → pay if needed → review activity**.

For the Unicity stack, **Astrid OS integration is feasible and strategically aligned**: SphereFlow is the treasury product surface; Astrid can become the sandboxed agent runtime that executes treasury tools under capabilities, approvals, and stronger audit. Sphere remains the settlement layer for UCT.

---

## 10. References

- SphereFlow production: https://sphereflow-psi.vercel.app  
- Unicity / agent OS overview: https://unicity.ai/  
- Astrid OS book (kernel, capsules, security model): https://github.com/unicity-astrid/book  
- Astrid JS capsule SDK: https://github.com/unicity-astrid/sdk-js  
- Sphere wallet capsule design discussion (Astrid issue #706): first-party Sphere capabilities for agents under Astrid  

---

*End of report.*

"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { AIChat } from "@/components/treasury/AIChat";
import { useTreasury } from "@/hooks/use-treasury";
import {
  getChatHistory,
  saveChatMessage,
  saveActivities,
  savePayment,
  savePolicy,
  addPolicyHistory,
} from "@/services/treasury-store";
import { parseTreasuryPlan, stripPlanBlock } from "@/ai/parser";
import { generateFallbackPlan } from "@/ai/fallback";
import { generateId } from "@/lib/utils";
import type { ChatMessage } from "@/types/treasury";
import { executeSphereTransfer } from "@/sphere/client";

export default function ChatPage() {
  const {
    userId,
    policy,
    snapshot,
    connection,
    refresh,
    setPolicy,
    setActivities,
    setPayments,
    setSnapshot,
  } = useTreasury();

  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getChatHistory(userId)
  );
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const processPlan = useCallback(
    async (plan: NonNullable<ChatMessage["plan"]>, assistantContent: string) => {
      if (!policy || !snapshot) return;

      const res = await fetch("/api/execute-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId, policy, snapshot }),
      });

      const result = await res.json();

      if (result.activities?.length) {
        saveActivities(userId, result.activities);
        setActivities((prev) => [...result.activities, ...prev]);
      }

      if (result.policy) {
        savePolicy(result.policy);
        setPolicy(result.policy);
        addPolicyHistory(userId, {
          policyId: result.policy.id,
          changes: plan.policyUpdates ?? {},
          source: "ai",
          timestamp: new Date().toISOString(),
        });
      }

      if (result.payment) {
        savePayment(result.payment);
        setPayments((prev) => [result.payment, ...prev]);

        if (
          result.payment.status === "approved" &&
          connection &&
          result.payment.type === "instant"
        ) {
          const transfer = await executeSphereTransfer(connection.client, {
            recipient: result.payment.recipient,
            amount: result.payment.amount,
            memo: result.payment.memo,
          });

          if (transfer.success) {
            result.payment.status = "completed";
            result.payment.executedAt = new Date().toISOString();
            result.payment.transferId = transfer.transferId;
            result.payment.deliveryPending = transfer.deliveryPending;
            savePayment(result.payment);
            toast.success("Payment settled via Sphere SDK");
          } else {
            toast.error(transfer.error ?? "Sphere settlement failed");
          }
        }
      }

      await refresh();
      void assistantContent;
    },
    [
      policy,
      snapshot,
      userId,
      connection,
      refresh,
      setPolicy,
      setActivities,
      setPayments,
      setSnapshot,
    ]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: text.trim(),
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      saveChatMessage(userId, userMessage);
      setInput("");
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history, userMessage: text.trim() }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          if (
            response.status === 500 &&
            typeof err.error === "string" &&
            err.error.includes("OPENAI_API_KEY")
          ) {
            const fallback = generateFallbackPlan(text.trim());
            const assistantMessage: ChatMessage = {
              id: generateId(),
              role: "assistant",
              content: fallback.content,
              plan: fallback.plan ?? undefined,
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            saveChatMessage(userId, assistantMessage);
            if (fallback.plan && fallback.plan.action !== "respond_only" && fallback.plan.action !== "report") {
              await processPlan(fallback.plan, fallback.content);
            }
            return;
          }
          throw new Error(
            (err as { error?: string }).error ?? "Chat request failed"
          );
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let fullContent = "";

        const assistantId = generateId();
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content: "",
            timestamp: new Date().toISOString(),
          },
        ]);

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullContent += chunk;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: fullContent } : m
              )
            );
          }
        }

        const plan = parseTreasuryPlan(fullContent);
        const cleanContent = stripPlanBlock(fullContent) || fullContent;

        const assistantMessage: ChatMessage = {
          id: assistantId,
          role: "assistant",
          content: cleanContent,
          plan: plan ?? undefined,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? assistantMessage : m))
        );
        saveChatMessage(userId, assistantMessage);

        if (plan && plan.action !== "respond_only" && plan.action !== "report") {
          await processPlan(plan, cleanContent);
          toast.success("Policy engine processed mandate");
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to get AI response"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, userId, processPlan]
  );

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col -mx-6 -mt-6 lg:-mx-8 lg:-mt-8">
      <div className="border-b border-white/[0.06] px-6 py-5 lg:px-8">
        <p className="section-label">Agent Interface</p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight">
          Treasury Chat
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Mandates compile to policy — execution stays deterministic
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <AIChat
          messages={messages}
          input={input}
          isLoading={isLoading}
          onInputChange={setInput}
          onSend={() => sendMessage(input)}
          onSuggestionClick={sendMessage}
        />
      </div>
    </div>
  );
}
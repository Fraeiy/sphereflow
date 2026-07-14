"use client";

import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SUGGESTED_PROMPTS } from "@/lib/constants";
import type { ChatMessage } from "@/types/treasury";
import { cn } from "@/lib/utils";

interface AIChatProps {
  messages: ChatMessage[];
  input: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onSuggestionClick: (prompt: string) => void;
}

export function AIChat({
  messages,
  input,
  isLoading,
  onInputChange,
  onSend,
  onSuggestionClick,
}: AIChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto px-4 py-6"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-2xl bg-primary/10 p-4">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">AI Treasury Agent</h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Give me a financial mandate. I&apos;ll convert it into structured
              policies — the policy engine executes, never me.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => onSuggestionClick(prompt)}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-3",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.role === "assistant" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-xl px-4 py-3",
                  message.role === "user"
                    ? "bg-primary text-background"
                    : "border border-border bg-card"
                )}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                {message.plan && (
                  <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
                    <Badge variant="gold">
                      Action: {message.plan.action}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {Math.round(message.plan.confidence * 100)}%
                      — Policy engine will validate
                    </p>
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/20">
                  <User className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="rounded-xl border border-border bg-card px-4 py-3">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="border-t border-border p-4">
        {messages.length > 0 && (
          <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
            {SUGGESTED_PROMPTS.slice(4).map((prompt) => (
              <button
                key={prompt}
                onClick={() => onSuggestionClick(prompt)}
                className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <Input
            placeholder="Set your treasury mandate..."
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="flex-1"
          />
          <Button onClick={onSend} disabled={isLoading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          LLM plans actions · Policy engine executes · Sphere SDK settles
        </p>
      </div>
    </div>
  );
}
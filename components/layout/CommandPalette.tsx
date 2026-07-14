"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  MessageSquare,
  Shield,
  Activity,
  ArrowLeftRight,
  BarChart3,
  Search,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  MessageSquare,
  Shield,
  Activity,
  ArrowLeftRight,
  BarChart3,
};

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open) setSearch("");
  }, [open]);

  if (!open) return null;

  const navigate = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-[20vh] backdrop-blur-sm">
      <Command
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
        loop
      >
        <div className="flex items-center gap-2 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search pages, actions..."
            className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 text-xs text-muted-foreground">
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>
          <Command.Group heading="Navigation">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-primary/10"
                >
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  {item.label}
                </Command.Item>
              );
            })}
          </Command.Group>
          <Command.Group heading="Actions">
            <Command.Item
              value="Set reserve balance"
              onSelect={() => navigate("/chat")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-primary/10"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Ask AI to set reserve balance
            </Command.Item>
            <Command.Item
              value="Create payment"
              onSelect={() => navigate("/payments")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-primary/10"
            >
              <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
              Create new payment
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
      <button
        className="fixed inset-0 -z-10"
        onClick={() => onOpenChange(false)}
        aria-label="Close command palette"
      />
    </div>
  );
}
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
    <div className="modal-overlay items-start pt-[18vh]">
      <Command
        className="depth-panel-elevated w-full max-w-lg overflow-hidden rounded-2xl"
        loop
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Command.Input
            value={search}
            onValueChange={setSearch}
            placeholder="Search pages, actions..."
            className="flex h-12 w-full bg-transparent font-mono text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded-md border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
            No results found.
          </Command.Empty>
          <Command.Group
            heading="Navigation"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <Command.Item
                  key={item.href}
                  value={item.label}
                  onSelect={() => navigate(item.href)}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors aria-selected:bg-primary/10"
                >
                  {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                  {item.label}
                </Command.Item>
              );
            })}
          </Command.Group>
          <Command.Group
            heading="Actions"
            className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-muted-foreground"
          >
            <Command.Item
              value="Set reserve balance"
              onSelect={() => navigate("/chat")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors aria-selected:bg-primary/10"
            >
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Ask AI to set reserve balance
            </Command.Item>
            <Command.Item
              value="Create payment"
              onSelect={() => navigate("/payments")}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors aria-selected:bg-primary/10"
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
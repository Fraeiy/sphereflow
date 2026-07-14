"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Shield,
  Activity,
  ArrowLeftRight,
  BarChart3,
  LogOut,
  Sparkles,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn, truncateAddress } from "@/lib/utils";
import type { WalletIdentity } from "@/types/treasury";
import { Badge } from "@/components/ui/badge";

const iconMap = {
  LayoutDashboard,
  MessageSquare,
  Shield,
  Activity,
  ArrowLeftRight,
  BarChart3,
};

interface SidebarProps {
  identity: WalletIdentity | null;
  isLive?: boolean;
  onDisconnect?: () => void;
}

export function Sidebar({ identity, isLive, onDisconnect }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-card/50">
      <div className="flex items-center gap-2 border-b border-border px-6 py-5">
        <div className="rounded-lg bg-primary/10 p-1.5">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold">SphereFlow</p>
          <p className="text-xs text-muted-foreground">Autonomous Treasury</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4">
        {identity ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-muted/10 p-3">
              <p className="text-xs text-muted-foreground">Connected</p>
              <p className="mt-1 truncate text-sm font-medium">
                {identity.nametag ?? truncateAddress(identity.chainPubkey, 8)}
              </p>
              <Badge variant={isLive ? "success" : "warning"} className="mt-2">
                {isLive ? "Live · testnet2" : "Identity cached"}
              </Badge>
            </div>
            {onDisconnect && (
              <button
                onClick={onDisconnect}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/10 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-background"
          >
            Connect Wallet
          </Link>
        )}
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Shield,
  Activity,
  ArrowLeftRight,
  BarChart3,
  LogOut,
} from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn, truncateAddress } from "@/lib/utils";
import type { WalletIdentity } from "@/types/treasury";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";

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
    <aside className="flex h-full w-[260px] flex-col border-r border-white/[0.06] bg-[#0a0a0c]/90 backdrop-blur-xl">
      <div className="border-b border-white/[0.06] px-5 py-5">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent shadow-[0_0_24px_rgba(232,163,23,0.08)]"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon
                className={cn(
                  "relative z-[1] h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="relative z-[1]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        {identity ? (
          <div className="space-y-3">
            <div className="depth-panel rounded-xl p-3.5">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Session
              </p>
              <p className="mt-1.5 truncate font-mono text-xs font-medium">
                {identity.nametag ?? truncateAddress(identity.chainPubkey, 8)}
              </p>
              <Badge
                variant={isLive ? "success" : "warning"}
                className="mt-2.5"
              >
                {isLive ? "Live · testnet2" : "Cached identity"}
              </Badge>
            </div>
            {onDisconnect && (
              <button
                onClick={onDisconnect}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-[#f0b429] to-[#c98a0f] px-3 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg transition hover:brightness-105"
          >
            Connect Wallet
          </Link>
        )}
      </div>
    </aside>
  );
}
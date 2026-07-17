"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Shield,
  ArrowLeftRight,
  Box,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PRIMARY = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/payments", label: "Pay", icon: ArrowLeftRight },
  { href: "/policies", label: "Rules", icon: Shield },
  { href: "/agent", label: "Agent", icon: Box },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-[#0a0a0c]/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1">
        {PRIMARY.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground active:text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5", active && "text-primary")} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
        <li className="flex-1">
          <Link
            href="/activity"
            className={cn(
              "flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 text-[10px] font-medium transition-colors",
              pathname === "/activity" || pathname === "/reports"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span>More</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
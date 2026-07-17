"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SimulationBanner } from "@/components/layout/SimulationBanner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useTreasury } from "@/hooks/use-treasury";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { identity, disconnect, isLive } = useTreasury();
  const router = useRouter();

  useKeyboardShortcuts(() => setCommandOpen(true));

  const handleDisconnect = () => {
    disconnect();
    router.push("/login");
  };

  return (
    <div className="app-mesh flex h-[100dvh] overflow-hidden">
      <div className="app-grid pointer-events-none fixed inset-0 opacity-30" />

      <div className="relative hidden lg:block">
        <Sidebar
          identity={identity}
          isLive={isLive}
          onDisconnect={handleDisconnect}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-[min(280px,85vw)] shadow-2xl">
            <Sidebar
              identity={identity}
              isLive={isLive}
              onDisconnect={handleDisconnect}
              onNavigate={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <SimulationBanner />
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] px-3 sm:h-14 sm:px-4 lg:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="min-w-0 lg:hidden">
              <Logo size="sm" showWordmark={false} />
            </div>
            <div className="hidden lg:block" />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 border-white/10 bg-white/[0.02] font-mono text-xs text-muted-foreground"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Command</span>
            <kbd className="hidden rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] sm:inline">
              ⌘K
            </kbd>
          </Button>
        </header>
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-[1400px] px-3 pb-24 pt-4 sm:px-5 sm:pb-10 sm:pt-6 lg:p-8 lg:pb-8">
            {children}
          </div>
        </main>
        <MobileNav />
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
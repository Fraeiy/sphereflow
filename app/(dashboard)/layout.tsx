"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SimulationBanner } from "@/components/layout/SimulationBanner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useTreasury } from "@/hooks/use-treasury";
import { useRouter } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="app-mesh flex h-screen overflow-hidden">
      <div className="app-grid pointer-events-none fixed inset-0 opacity-30" />

      <div className="relative hidden lg:block">
        <Sidebar
          identity={identity}
          isLive={isLive}
          onDisconnect={handleDisconnect}
        />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-[260px]">
            <Sidebar
              identity={identity}
              isLive={isLive}
              onDisconnect={handleDisconnect}
            />
          </div>
        </div>
      )}

      <div className="relative flex flex-1 flex-col overflow-hidden">
        <SimulationBanner />
        <header className="flex h-14 items-center justify-between border-b border-white/[0.06] px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden lg:block" />
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
        <main className="relative flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1400px] p-6 lg:p-8">{children}</div>
        </main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
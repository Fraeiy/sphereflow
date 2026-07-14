"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { SimulationBanner } from "@/components/layout/SimulationBanner";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useTreasury } from "@/hooks/use-treasury";
import { clearSphereSession } from "@/sphere/client";
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
  const { identity } = useTreasury();
  const router = useRouter();

  useKeyboardShortcuts(() => setCommandOpen(true));

  const handleDisconnect = () => {
    clearSphereSession();
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden lg:block">
        <Sidebar identity={identity} onDisconnect={handleDisconnect} />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 h-full w-64">
            <Sidebar identity={identity} onDisconnect={handleDisconnect} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <SimulationBanner />
        <header className="flex h-14 items-center justify-between border-b border-border px-4 lg:px-6">
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
            className="gap-2 text-muted-foreground"
            onClick={() => setCommandOpen(true)}
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden rounded border border-border px-1.5 text-xs sm:inline">
              ⌘K
            </kbd>
          </Button>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </div>
  );
}
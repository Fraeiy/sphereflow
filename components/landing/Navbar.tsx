"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="glass-panel mx-4 mt-4 rounded-2xl border-gradient lg:mx-auto lg:max-w-6xl">
        <div className="flex h-14 items-center justify-between px-5">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-medium text-muted-foreground md:flex">
            <a href="#features" className="transition-colors hover:text-foreground">
              Capabilities
            </a>
            <a
              href="#architecture"
              className="transition-colors hover:text-foreground"
            >
              Architecture
            </a>
            <a
              href="#how-it-works"
              className="transition-colors hover:text-foreground"
            >
              Workflow
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/login">Connect</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
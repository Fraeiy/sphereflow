"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Magnet } from "@/components/react-bits";

const links = [
  { href: "#features", label: "Capabilities" },
  { href: "#architecture", label: "Architecture" },
  { href: "#how-it-works", label: "Workflow" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full">
      <div className="glass-panel mx-3 mt-3 rounded-2xl border-gradient sm:mx-4 sm:mt-4 lg:mx-auto lg:max-w-6xl">
        <div className="flex h-12 items-center justify-between px-3 sm:h-14 sm:px-5">
          <Link href="/" onClick={() => setOpen(false)}>
            <Logo size="sm" />
          </Link>
          <nav className="hidden items-center gap-8 text-[13px] font-medium text-muted-foreground md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Magnet magnetStrength={5} padding={36}>
              <Button asChild size="sm">
                <Link href="/login">Connect</Link>
              </Button>
            </Magnet>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="border-t border-white/[0.06] px-3 py-3 md:hidden">
            <nav className="flex flex-col gap-1">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.04] hover:text-foreground"
              >
                Dashboard
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
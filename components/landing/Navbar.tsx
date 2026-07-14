"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold">SphereFlow</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#architecture" className="hover:text-foreground">
            Architecture
          </a>
          <a href="#how-it-works" className="hover:text-foreground">
            How it works
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">Demo</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">Connect</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
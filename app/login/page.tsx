"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Wallet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DepthCard } from "@/components/ui/depth-card";
import { Logo } from "@/components/ui/logo";
import { SceneOrb } from "@/components/ui/scene-orb";
import { useTreasury } from "@/hooks/use-treasury";
import { willAutoConnect } from "@/sphere/client";
import { toast } from "sonner";

export default function LoginPage() {
  const { connect, isConnecting, identity, isLive, enterDemoMode } =
    useTreasury();
  const [autoConnecting, setAutoConnecting] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isLive && identity) {
      router.push("/dashboard");
    }
  }, [identity, isLive, router]);

  useEffect(() => {
    async function tryAutoConnect() {
      const canAuto = await willAutoConnect();
      if (canAuto) {
        try {
          await connect();
          router.push("/dashboard");
          return;
        } catch {
          // manual connect
        }
      }
      setAutoConnecting(false);
    }
    void tryAutoConnect();
  }, [connect, router]);

  const handleConnect = async () => {
    try {
      await connect();
      toast.success("Sphere wallet connected");
      router.push("/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to connect wallet"
      );
    }
  };

  const handleDemo = () => {
    enterDemoMode();
    router.push("/dashboard");
  };

  if (autoConnecting) {
    return (
      <div className="app-mesh flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="app-mesh relative flex min-h-screen">
      <div className="app-grid pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative hidden w-1/2 flex-col justify-between border-r border-white/[0.06] p-12 lg:flex">
        <Link href="/">
          <Logo />
        </Link>
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight">
            Treasury operations
            <span className="block text-gradient-gold">on Sphere</span>
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
            Connect your wallet to access live testnet balances, policy
            enforcement, and autonomous settlement.
          </p>
        </div>
        <SceneOrb size="md" className="absolute bottom-12 right-12 opacity-80" />
        <p className="font-mono text-xs text-muted-foreground">
          Sphere Connect v2 · testnet2
        </p>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 sm:mb-8 lg:hidden">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <DepthCard glow tilt={false}>
            <div className="p-5 sm:p-8">
              <h2 className="font-display text-xl font-semibold sm:text-2xl">
                Authenticate
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sphere Connect — keys never leave your wallet
              </p>

              <div className="mt-6 space-y-3 sm:mt-8">
                <Button
                  className="h-12 w-full"
                  size="lg"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wallet className="h-4 w-4" />
                  )}
                  Connect Sphere Wallet
                </Button>
                <Button
                  variant="outline"
                  className="h-12 w-full sm:h-11"
                  onClick={handleDemo}
                >
                  Continue in Demo Mode
                </Button>
              </div>

              <p className="mt-6 text-center font-mono text-[11px] text-muted-foreground">
                network_id: 4 · testnet2 · Astrid gates
              </p>
            </div>
          </DepthCard>
        </motion.div>
      </div>
    </div>
  );
}
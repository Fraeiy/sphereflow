"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Wallet, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
          // Fall through to manual connect
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-semibold">SphereFlow</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Connect Your Treasury</CardTitle>
            <p className="text-sm text-muted-foreground">
              Authenticate via Sphere Connect protocol on testnet2
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full gap-2"
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
              className="w-full"
              onClick={handleDemo}
            >
              Continue with Demo Mode
            </Button>

            <div className="rounded-lg bg-muted/10 p-4">
              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-primary" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Secure Connect Protocol v2.0
                  </p>
                  <p className="mt-1">
                    Private keys never leave your Sphere wallet. SphereFlow
                    requests permissions for balance reads and transfer intents.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <Badge variant="secondary">Network: testnet2</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
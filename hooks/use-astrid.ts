"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ASTRID_CAPABILITIES,
  defaultSessionConfig,
} from "@/lib/astrid/capabilities";
import {
  getAstridReceipts,
  getAstridSession,
  saveAstridSession,
} from "@/lib/astrid/receipts";
import type {
  AstridCapability,
  AstridReceipt,
  AstridSessionConfig,
} from "@/lib/astrid/types";
import { useTreasury } from "@/hooks/use-treasury";

export function useAstrid() {
  const { userId } = useTreasury();
  const [session, setSession] = useState<AstridSessionConfig>(() =>
    defaultSessionConfig()
  );
  const [receipts, setReceipts] = useState<AstridReceipt[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => {
    setSession(getAstridSession(userId));
    setReceipts(getAstridReceipts(userId));
    setReady(true);
  }, [userId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const updateSession = useCallback(
    (patch: Partial<AstridSessionConfig>) => {
      const next = {
        ...getAstridSession(userId),
        ...patch,
        updatedAt: new Date().toISOString(),
      };
      saveAstridSession(userId, next);
      setSession(next);
    },
    [userId]
  );

  const setCapability = useCallback(
    (id: AstridCapability, granted: boolean) => {
      const current = getAstridSession(userId);
      updateSession({
        granted: { ...current.granted, [id]: granted },
      });
    },
    [userId, updateSession]
  );

  return {
    userId,
    session,
    receipts,
    capabilities: ASTRID_CAPABILITIES,
    ready,
    refresh,
    updateSession,
    setCapability,
  };
}
"use client";

import { useCallback, useEffect, useState } from "react";
import type {
  ActivityEntry,
  Payment,
  RecurringPayment,
  TreasuryPolicy,
  TreasurySnapshot,
  WalletIdentity,
} from "@/types/treasury";
import {
  buildSnapshot,
  getActivities,
  getPayments,
  getPolicy,
  getRecurringPayments,
  savePolicy,
  seedDemoData,
} from "@/services/treasury-store";
import {
  connectSphereWallet,
  getSphereBalance,
  getStoredIdentity,
  type SphereConnection,
} from "@/sphere/client";

export function useTreasury() {
  const [identity, setIdentity] = useState<WalletIdentity | null>(null);
  const [connection, setConnection] = useState<SphereConnection | null>(null);
  const [balance, setBalance] = useState(0);
  const [policy, setPolicy] = useState<TreasuryPolicy | null>(null);
  const [snapshot, setSnapshot] = useState<TreasurySnapshot | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [recurring, setRecurring] = useState<RecurringPayment[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const userId = identity?.chainPubkey ?? "demo-user";

  const refresh = useCallback(async (conn?: SphereConnection | null) => {
    const activeConn = conn ?? connection;
    let bal = 0;

    if (activeConn) {
      bal = await getSphereBalance(activeConn.client);
    } else {
      bal = 250;
    }

    setBalance(bal);
    seedDemoData(userId, bal);

    const pol = getPolicy(userId);
    setPolicy(pol);
    setSnapshot(buildSnapshot(userId, bal));
    setPayments(getPayments(userId));
    setActivities(getActivities(userId));
    setRecurring(getRecurringPayments(userId));
  }, [connection, userId]);

  useEffect(() => {
    const stored = getStoredIdentity();
    if (stored) {
      setIdentity(stored);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (identity) {
      void refresh();
    }
  }, [identity, refresh]);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      const conn = await connectSphereWallet(false);
      setConnection(conn);
      setIdentity(conn.identity);
      await refresh(conn);
      return conn;
    } finally {
      setIsConnecting(false);
    }
  }, [refresh]);

  const updatePolicy = useCallback(
    (updates: Partial<TreasuryPolicy>) => {
      if (!policy) return;
      const updated: TreasuryPolicy = {
        ...policy,
        ...updates,
        updatedAt: new Date().toISOString(),
        version: policy.version + 1,
      };
      savePolicy(updated);
      setPolicy(updated);
      setSnapshot(buildSnapshot(userId, balance));
    },
    [policy, userId, balance]
  );

  return {
    identity,
    connection,
    balance,
    policy,
    snapshot,
    payments,
    activities,
    recurring,
    isConnecting,
    isLoading,
    userId,
    connect,
    refresh,
    updatePolicy,
    setPayments,
    setActivities,
    setPolicy,
    setSnapshot,
  };
}
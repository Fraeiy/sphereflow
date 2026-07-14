"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
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
  syncHistoryToPayments,
} from "@/services/treasury-store";
import {
  connectSphereWallet,
  clearSphereSession,
  fetchSphereHistory,
  getSphereBalance,
  getStoredIdentity,
  reconnectSphereWallet,
  type SphereConnection,
} from "@/sphere/client";
import {
  getTreasuryMode,
  setTreasuryMode,
  type TreasuryMode,
} from "@/lib/treasury-mode";

interface TreasuryContextValue {
  identity: WalletIdentity | null;
  connection: SphereConnection | null;
  mode: TreasuryMode;
  balance: number;
  policy: TreasuryPolicy | null;
  snapshot: TreasurySnapshot | null;
  payments: Payment[];
  activities: ActivityEntry[];
  recurring: RecurringPayment[];
  isConnecting: boolean;
  isLoading: boolean;
  isLive: boolean;
  userId: string;
  connect: () => Promise<SphereConnection>;
  disconnect: () => void;
  enterDemoMode: () => void;
  refresh: () => Promise<void>;
  updatePolicy: (updates: Partial<TreasuryPolicy>) => void;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setActivities: React.Dispatch<React.SetStateAction<ActivityEntry[]>>;
  setPolicy: React.Dispatch<React.SetStateAction<TreasuryPolicy | null>>;
  setSnapshot: React.Dispatch<React.SetStateAction<TreasurySnapshot | null>>;
}

const TreasuryContext = createContext<TreasuryContextValue | null>(null);

export function TreasuryProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<TreasuryMode>("demo");
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

  const isLive = mode === "live" && !!connection;
  const userId =
    isLive && identity?.chainPubkey
      ? identity.chainPubkey
      : mode === "demo"
        ? "demo-user"
        : identity?.chainPubkey ?? "demo-user";

  const refresh = useCallback(
    async (conn?: SphereConnection | null) => {
      const activeConn = conn ?? connection;
      let bal = 0;

      if (isLive && activeConn) {
        bal = await getSphereBalance(activeConn.client);

        const history = await fetchSphereHistory(activeConn.client);
        if (history.length > 0) {
          syncHistoryToPayments(userId, history);
        }
      } else if (mode === "demo") {
        bal = 250;
        seedDemoData(userId, bal);
      }

      setBalance(bal);

      const pol = getPolicy(userId);
      setPolicy(pol);
      setSnapshot(buildSnapshot(userId, bal));
      setPayments(getPayments(userId));
      setActivities(getActivities(userId));
      setRecurring(getRecurringPayments(userId));
    },
    [connection, isLive, mode, userId]
  );

  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      setTreasuryMode("live");
      setMode("live");
      const conn = await connectSphereWallet(false);
      setConnection(conn);
      setIdentity(conn.identity);
      await refresh(conn);
      return conn;
    } finally {
      setIsConnecting(false);
    }
  }, [refresh]);

  const disconnect = useCallback(() => {
    clearSphereSession();
    setConnection(null);
    setIdentity(null);
    setTreasuryMode("demo");
    setMode("demo");
  }, []);

  const enterDemoMode = useCallback(() => {
    clearSphereSession();
    setConnection(null);
    setTreasuryMode("demo");
    setMode("demo");
    const stored = getStoredIdentity();
    setIdentity(stored);
  }, []);

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

  useEffect(() => {
    let mounted = true;

    async function init() {
      const hasSession =
        typeof window !== "undefined" &&
        !!sessionStorage.getItem("sphereflow-session");

      let storedMode = getTreasuryMode();
      if (hasSession && storedMode !== "live") {
        setTreasuryMode("live");
        storedMode = "live";
      }
      if (!mounted) return;
      setMode(storedMode);

      if (storedMode === "live" || hasSession) {
        setIsConnecting(true);
        try {
          const conn = await reconnectSphereWallet();
          if (!mounted) return;
          if (conn) {
            setTreasuryMode("live");
            setMode("live");
            setConnection(conn);
            setIdentity(conn.identity);

            const bal = await getSphereBalance(conn.client);
            const history = await fetchSphereHistory(conn.client);
            const uid = conn.identity.chainPubkey;
            if (history.length > 0) {
              syncHistoryToPayments(uid, history);
            }

            setBalance(bal);
            setPolicy(getPolicy(uid));
            setSnapshot(buildSnapshot(uid, bal));
            setPayments(getPayments(uid));
            setActivities(getActivities(uid));
            setRecurring(getRecurringPayments(uid));
            setIsLoading(false);
            setIsConnecting(false);
            return;
          }
        } catch {
          // fall through to demo / cached identity
        }
        if (!mounted) return;
        setIsConnecting(false);
        const stored = getStoredIdentity();
        if (stored) setIdentity(stored);
      } else {
        seedDemoData("demo-user", 250);
        setBalance(250);
        setPolicy(getPolicy("demo-user"));
        setSnapshot(buildSnapshot("demo-user", 250));
        setPayments(getPayments("demo-user"));
        setActivities(getActivities("demo-user"));
        setRecurring(getRecurringPayments("demo-user"));
      }

      if (mounted) setIsLoading(false);
    }

    void init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onTransfer = () => {
      void refresh();
    };
    window.addEventListener("sphereflow:transfer", onTransfer);
    return () => window.removeEventListener("sphereflow:transfer", onTransfer);
  }, [refresh]);

  const value = useMemo(
    () => ({
      identity,
      connection,
      mode,
      balance,
      policy,
      snapshot,
      payments,
      activities,
      recurring,
      isConnecting,
      isLoading,
      isLive,
      userId,
      connect,
      disconnect,
      enterDemoMode,
      refresh,
      updatePolicy,
      setPayments,
      setActivities,
      setPolicy,
      setSnapshot,
    }),
    [
      identity,
      connection,
      mode,
      balance,
      policy,
      snapshot,
      payments,
      activities,
      recurring,
      isConnecting,
      isLoading,
      isLive,
      userId,
      connect,
      disconnect,
      enterDemoMode,
      refresh,
      updatePolicy,
    ]
  );

  return (
    <TreasuryContext.Provider value={value}>
      {children}
    </TreasuryContext.Provider>
  );
}

export function useTreasuryContext(): TreasuryContextValue {
  const ctx = useContext(TreasuryContext);
  if (!ctx) {
    throw new Error("useTreasuryContext must be used within TreasuryProvider");
  }
  return ctx;
}
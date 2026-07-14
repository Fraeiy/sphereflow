"use client";

import type { WalletIdentity } from "@/types/treasury";
import { SPHERE_WALLET_URL, UCT_DECIMALS } from "@/lib/constants";

const SESSION_KEY = "sphereflow-session";
const IDENTITY_KEY = "sphereflow-identity";
const COIN_ID_KEY = "sphereflow-uct-coin-id";

export interface SphereAsset {
  coinId: string;
  symbol: string;
  name?: string;
  decimals: number;
  totalAmount: string;
  confirmedAmount: string;
}

export interface SphereSendResult {
  success: boolean;
  transferId?: string;
  status: string;
  deliveryPending?: boolean;
  error?: string;
}

export interface SphereWalletClient {
  query(method: string, params?: unknown): Promise<unknown>;
  intent(action: string, params?: unknown): Promise<unknown>;
  on(event: string, handler: (data: unknown) => void): () => void;
}

type ConnectBrowserModule =
  typeof import("@unicitylabs/sphere-sdk/connect/browser");

let connectModule: ConnectBrowserModule | null = null;
let activeConnection: SphereConnection | null = null;
let cachedUctCoinId: string | null = null;

async function getConnectModule(): Promise<ConnectBrowserModule> {
  if (!connectModule) {
    connectModule = await import("@unicitylabs/sphere-sdk/connect/browser");
  }
  return connectModule;
}

export interface SphereConnection {
  client: SphereWalletClient;
  disconnect: () => Promise<void>;
  identity: WalletIdentity;
  transport?: string;
}

const CONNECT_PERMISSIONS = [
  "identity:read",
  "balance:read",
  "tokens:read",
  "history:read",
  "events:subscribe",
  "transfer:request",
  "resolve:peer",
] as const;

function assetToHuman(asset: SphereAsset): number {
  const raw = asset.confirmedAmount || asset.totalAmount || "0";
  const base = BigInt(raw);
  const divisor = BigInt(10 ** (asset.decimals ?? UCT_DECIMALS));
  return Number(base) / Number(divisor);
}

export function getCachedUctCoinId(): string | null {
  if (cachedUctCoinId) return cachedUctCoinId;
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COIN_ID_KEY);
}

function cacheUctCoinId(coinId: string): void {
  cachedUctCoinId = coinId;
  if (typeof window !== "undefined") {
    localStorage.setItem(COIN_ID_KEY, coinId);
  }
}

export async function resolveUctAsset(
  client: SphereWalletClient
): Promise<SphereAsset | null> {
  try {
    const assets = (await client.query("sphere_getAssets")) as SphereAsset[];
    if (!assets?.length) return null;

    const uct =
      assets.find((a) => a.symbol?.toUpperCase() === "UCT") ?? assets[0];

    if (uct?.coinId) {
      cacheUctCoinId(uct.coinId);
    }

    return uct ?? null;
  } catch {
    return null;
  }
}

export async function getSphereBalance(
  client: SphereWalletClient
): Promise<number> {
  try {
    const asset = await resolveUctAsset(client);
    if (asset) return assetToHuman(asset);

    const balances = (await client.query("sphere_getBalance")) as SphereAsset[];
    if (balances?.length) {
      const uct =
        balances.find((a) => a.symbol?.toUpperCase() === "UCT") ??
        balances[0];
      if (uct?.coinId) cacheUctCoinId(uct.coinId);
      return assetToHuman(uct);
    }

    return 0;
  } catch (error) {
    console.error("[SphereFlow] Balance fetch failed:", error);
    return 0;
  }
}

export async function executeSphereTransfer(
  client: SphereWalletClient,
  params: {
    recipient: string;
    amount: number;
    memo?: string;
  }
): Promise<SphereSendResult> {
  try {
    const asset = await resolveUctAsset(client);
    const decimals = asset?.decimals ?? UCT_DECIMALS;
    const coinId = asset?.coinId ?? getCachedUctCoinId() ?? "UCT";

    const { parseTokenAmount } = await import("@unicitylabs/sphere-sdk");
    const baseAmount = parseTokenAmount(
      params.amount.toString(),
      decimals
    ).toString();

    const payload = {
      to: params.recipient,
      recipient: params.recipient,
      amount: baseAmount,
      coinId,
      memo: params.memo,
    };

    const result = (await client.intent("send", payload)) as {
      success: boolean;
      transferId?: string;
      status: string;
      deliveryPending?: boolean;
    };

    return {
      success: result.success,
      transferId: result.transferId,
      status: result.status,
      deliveryPending: result.deliveryPending,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Transfer failed";
    console.error("[SphereFlow] Transfer failed:", error);
    return {
      success: false,
      status: "failed",
      error: message,
    };
  }
}

export interface SphereHistoryEntry {
  id?: string;
  transferId?: string;
  amount?: string;
  coinId?: string;
  recipient?: string;
  to?: string;
  memo?: string;
  status?: string;
  timestamp?: number | string;
  direction?: "incoming" | "outgoing";
}

export async function fetchSphereHistory(
  client: SphereWalletClient
): Promise<SphereHistoryEntry[]> {
  try {
    const history = (await client.query("sphere_getHistory")) as
      | SphereHistoryEntry[]
      | { entries?: SphereHistoryEntry[] };

    if (Array.isArray(history)) return history;
    return history?.entries ?? [];
  } catch {
    return [];
  }
}

export async function connectSphereWallet(
  silent = false
): Promise<SphereConnection> {
  if (activeConnection) {
    return activeConnection;
  }

  const { autoConnect } = await getConnectModule();
  const { SPHERE_NETWORKS } = await import("@unicitylabs/sphere-sdk/connect");

  const savedSession =
    typeof window !== "undefined"
      ? sessionStorage.getItem(SESSION_KEY)
      : null;

  const result = await autoConnect({
    dapp: {
      name: "SphereFlow",
      description: "Autonomous Treasury Agent for Unicity Sphere",
      url: typeof window !== "undefined" ? window.location.origin : "",
    },
    walletUrl: SPHERE_WALLET_URL,
    network: SPHERE_NETWORKS.testnet2,
    permissions: [...CONNECT_PERMISSIONS],
    silent,
    resumeSessionId: savedSession ?? undefined,
  });

  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_KEY, result.connection.sessionId);
  }

  const identity: WalletIdentity = {
    chainPubkey: result.connection.identity.chainPubkey,
    nametag: result.connection.identity.nametag,
    directAddress: result.connection.identity.directAddress,
    sessionId: result.connection.sessionId,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
  }

  result.client.on("wallet:locked", async () => {
    activeConnection = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(IDENTITY_KEY);
    }
    await result.disconnect();
  });

  result.client.on("transfer:incoming", () => {
    window.dispatchEvent(new CustomEvent("sphereflow:transfer"));
  });

  result.client.on("transfer:confirmed", () => {
    window.dispatchEvent(new CustomEvent("sphereflow:transfer"));
  });

  const connection: SphereConnection = {
    client: result.client as SphereWalletClient,
    disconnect: async () => {
      activeConnection = null;
      await result.disconnect();
    },
    identity,
    transport: result.transport,
  };

  activeConnection = connection;
  return connection;
}

export async function reconnectSphereWallet(): Promise<SphereConnection | null> {
  try {
    return await connectSphereWallet(true);
  } catch {
    return null;
  }
}

export function getActiveConnection(): SphereConnection | null {
  return activeConnection;
}

export function getStoredIdentity(): WalletIdentity | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(IDENTITY_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as WalletIdentity;
  } catch {
    return null;
  }
}

export function clearSphereSession(): void {
  activeConnection = null;
  cachedUctCoinId = null;
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(IDENTITY_KEY);
}

export async function willAutoConnect(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const { hasExtension } = await getConnectModule();
  return !!sessionStorage.getItem(SESSION_KEY) || (await hasExtension());
}
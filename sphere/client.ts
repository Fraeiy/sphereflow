"use client";

/**
 * Sphere Connect client — @unicitylabs/sphere-sdk@0.12.x
 * Connect protocol v2 · network-gated handshake · L3-only (no L1)
 */

import type { WalletIdentity } from "@/types/treasury";
import { SPHERE_WALLET_URL } from "@/lib/constants";
import {
  cacheTokenDecimals,
  fromBaseUnits,
  resolveTokenDecimals,
  toBaseUnits,
} from "@/lib/amounts";

const SESSION_KEY = "sphereflow-session";
const IDENTITY_KEY = "sphereflow-identity";
const COIN_ID_KEY = "sphereflow-uct-coin-id";

/** Canonical 64-char lowercase hex coin id (SDK rejects symbols like "UCT"). */
const HEX_COIN_ID = /^[0-9a-f]{64}$/;

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
  walletNetwork?: { id: number; name?: string } | null;
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
  networkId?: number;
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

function isHexCoinId(id: string | null | undefined): id is string {
  return typeof id === "string" && HEX_COIN_ID.test(id.toLowerCase());
}

function normalizeCoinId(id: string): string {
  return id.toLowerCase();
}

function assetToHuman(asset: SphereAsset): number {
  const decimals = resolveTokenDecimals(asset.decimals);
  cacheTokenDecimals(decimals);
  return fromBaseUnits(
    asset.confirmedAmount || asset.totalAmount || "0",
    decimals
  );
}

export function getCachedUctCoinId(): string | null {
  if (cachedUctCoinId && isHexCoinId(cachedUctCoinId)) {
    return normalizeCoinId(cachedUctCoinId);
  }
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(COIN_ID_KEY);
  if (stored && isHexCoinId(stored)) {
    cachedUctCoinId = normalizeCoinId(stored);
    return cachedUctCoinId;
  }
  // Drop legacy symbol caches (e.g. "UCT") — invalid under SDK 0.12
  if (stored && !isHexCoinId(stored)) {
    localStorage.removeItem(COIN_ID_KEY);
  }
  return null;
}

function cacheUctCoinId(coinId: string): void {
  if (!isHexCoinId(coinId)) return;
  const id = normalizeCoinId(coinId);
  cachedUctCoinId = id;
  if (typeof window !== "undefined") {
    localStorage.setItem(COIN_ID_KEY, id);
  }
}

export async function resolveUctAsset(
  client: SphereWalletClient
): Promise<SphereAsset | null> {
  try {
    const raw = await client.query("sphere_getAssets");
    const assets = normalizeAssets(raw);
    if (!assets.length) return null;

    const uct =
      assets.find((a) => a.symbol?.toUpperCase() === "UCT") ?? assets[0];

    if (uct?.coinId) cacheUctCoinId(uct.coinId);
    if (uct?.decimals != null) {
      cacheTokenDecimals(resolveTokenDecimals(uct.decimals));
    }

    return uct ?? null;
  } catch {
    return null;
  }
}

function normalizeAssets(raw: unknown): SphereAsset[] {
  if (Array.isArray(raw)) return raw as SphereAsset[];
  if (raw && typeof raw === "object") {
    const o = raw as { assets?: SphereAsset[]; balances?: SphereAsset[] };
    if (Array.isArray(o.assets)) return o.assets;
    if (Array.isArray(o.balances)) return o.balances;
  }
  return [];
}

export async function getSphereBalance(
  client: SphereWalletClient
): Promise<number> {
  try {
    const asset = await resolveUctAsset(client);
    if (asset) return assetToHuman(asset);

    const raw = await client.query("sphere_getBalance");
    const balances = normalizeAssets(raw);
    if (balances.length) {
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
    const decimals = resolveTokenDecimals(asset?.decimals);
    const coinId = asset?.coinId
      ? normalizeCoinId(asset.coinId)
      : getCachedUctCoinId();

    if (!coinId || !isHexCoinId(coinId)) {
      return {
        success: false,
        status: "failed",
        error:
          "Could not resolve UCT coinId (64-hex). Open Sphere wallet, ensure UCT is loaded, then reconnect.",
      };
    }

    // SDK 0.12: amount is base units as a decimal string; coinId is lowercase 64-hex
    const baseAmount = await toBaseUnits(params.amount, decimals);

    const payload = {
      to: params.recipient,
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
    const message = formatConnectError(error);
    console.error("[SphereFlow] Transfer failed:", error);
    return {
      success: false,
      status: "failed",
      error: message,
    };
  }
}

/** Map ConnectError codes (SDK ≥0.9 / 0.12) to readable messages. */
export function formatConnectError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return error instanceof Error ? error.message : "Sphere request failed";
  }
  const e = error as {
    code?: number;
    message?: string;
    data?: {
      reason?: string;
      walletNetwork?: { id: number };
      clientNetwork?: { id: number } | null;
    };
  };

  switch (e.code) {
    case 4007:
      return "Sphere wallet protocol mismatch — update SphereFlow / wallet to the latest SDK.";
    case 4008:
      return `Network mismatch — app targets testnet2 (id 4); wallet is on network ${e.data?.walletNetwork?.id ?? "?"}. Switch the wallet network.`;
    case 4003:
      return "Request rejected in the Sphere wallet.";
    case 4004:
      return "Sphere session expired — connect again.";
    case 4100:
      return "Insufficient balance for this transfer.";
    case 4101:
      return "Invalid recipient — could not resolve peer identity.";
    case 4102:
      return "Transfer failed in the wallet.";
    case 4200:
      return "Wallet UI closed before confirmation.";
    default:
      return e.message || "Sphere request failed";
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
      | { entries?: SphereHistoryEntry[]; items?: SphereHistoryEntry[] };

    if (Array.isArray(history)) return history;
    return history?.entries ?? history?.items ?? [];
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

  // Connect protocol v2: network is required by the compatibility gate
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

  const client = result.client as unknown as SphereWalletClient;

  client.on("wallet:locked", async () => {
    activeConnection = null;
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(IDENTITY_KEY);
    }
    await result.disconnect();
  });

  client.on("transfer:incoming", () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sphereflow:transfer"));
    }
  });

  client.on("transfer:confirmed", () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("sphereflow:transfer"));
    }
  });

  // Prefetch UCT asset / coinId for faster first send
  void resolveUctAsset(client);

  const networkId =
    (client as { walletNetwork?: { id: number } | null }).walletNetwork?.id ??
    SPHERE_NETWORKS.testnet2.id;

  const connection: SphereConnection = {
    client,
    disconnect: async () => {
      activeConnection = null;
      await result.disconnect();
    },
    identity,
    transport: result.transport,
    networkId,
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

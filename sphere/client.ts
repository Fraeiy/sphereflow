"use client";

import type { WalletIdentity } from "@/types/treasury";
import { SPHERE_WALLET_URL } from "@/lib/constants";

const SESSION_KEY = "sphereflow-session";
const IDENTITY_KEY = "sphereflow-identity";

export interface SphereBalance {
  coinId: string;
  amount: string;
  symbol?: string;
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
}

export async function connectSphereWallet(
  silent = false
): Promise<SphereConnection> {
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
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(IDENTITY_KEY);
    }
    await result.disconnect();
  });

  return {
    client: result.client as SphereWalletClient,
    disconnect: result.disconnect,
    identity,
  };
}

export async function getSphereBalance(
  client: SphereWalletClient
): Promise<number> {
  try {
    const assets = (await client.query("sphere_getAssets")) as SphereBalance[];
    if (!assets?.length) return 0;

    const uct =
      assets.find((a) => a.symbol === "UCT" || a.coinId === "UCT") ??
      assets[0];

    const raw = parseFloat(uct.amount);
    return isNaN(raw) ? 0 : raw / 1_000_000;
  } catch {
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
    const baseAmount = Math.round(params.amount * 1_000_000).toString();

    const result = (await client.intent("send", {
      to: params.recipient,
      amount: baseAmount,
      coinId: "UCT",
      memo: params.memo,
    })) as {
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
    return {
      success: false,
      status: "failed",
      error: error instanceof Error ? error.message : "Transfer failed",
    };
  }
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
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(IDENTITY_KEY);
}

export async function willAutoConnect(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const { hasExtension } = await getConnectModule();
  return !!sessionStorage.getItem(SESSION_KEY) || (await hasExtension());
}
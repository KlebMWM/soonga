"use client";

import { useEffect, useState } from "react";
import { Check, ChevronRight, Copy, Loader2, LogOut, Sparkles, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n/LocaleProvider";
import { useDisplayName } from "@/lib/useDisplayName";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const MOCK_ADDRESS = "0xM3gA4F2e9b...c7d2";
const MOCK_USDC_BALANCE = 2847.32;
const CONNECTED_KEY = "soon-wallet-connected";
const PROVIDER_KEY = "soon-wallet-provider";

type ProviderId = "coinbase" | "metamask" | "rainbow" | "walletconnect";

type ProviderDef = {
  id: ProviderId;
  nameKey: string;
  descKey: string;
  /** Tailwind-safe class for the icon tile background. */
  tileClass: string;
  /** Short label shown inside the icon tile. */
  monogram: string;
  recommended?: boolean;
};

const PROVIDERS: ProviderDef[] = [
  {
    id: "coinbase",
    nameKey: "wallet.provider.coinbase.name",
    descKey: "wallet.provider.coinbase.desc",
    tileClass: "bg-[#0052FF] text-white",
    monogram: "CB",
    recommended: true,
  },
  {
    id: "metamask",
    nameKey: "wallet.provider.metamask.name",
    descKey: "wallet.provider.metamask.desc",
    tileClass: "bg-[#F6851B] text-white",
    monogram: "🦊",
  },
  {
    id: "rainbow",
    nameKey: "wallet.provider.rainbow.name",
    descKey: "wallet.provider.rainbow.desc",
    tileClass: "bg-gradient-to-br from-red-500 via-yellow-400 to-blue-500 text-white",
    monogram: "🌈",
  },
  {
    id: "walletconnect",
    nameKey: "wallet.provider.walletconnect.name",
    descKey: "wallet.provider.walletconnect.desc",
    tileClass: "bg-[#3B99FC] text-white",
    monogram: "WC",
  },
];

const providerById = (id: string | null): ProviderDef | null =>
  PROVIDERS.find((p) => p.id === id) ?? null;

export function WalletPill({ variant = "sidebar" }: { variant?: "sidebar" | "mobile" }) {
  const t = useT();
  const { name: displayName } = useDisplayName();
  const exchangeAccountId = `${displayName.toLowerCase()}@trader`;
  const [connected, setConnected] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [connectingId, setConnectingId] = useState<ProviderId | null>(null);
  const [provider, setProvider] = useState<ProviderId | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
      const isConnected =
        typeof window !== "undefined" && window.localStorage.getItem(CONNECTED_KEY) === "1";
      setConnected(isConnected);
      if (isConnected) {
        const stored = window.localStorage.getItem(PROVIDER_KEY);
        if (stored && PROVIDERS.some((p) => p.id === stored)) {
          setProvider(stored as ProviderId);
        } else {
          setProvider("coinbase");
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div className={variant === "sidebar" ? "h-[76px]" : "h-8"} aria-hidden />;
  }

  const connectWith = (id: ProviderId) => {
    setConnectingId(id);
    // Simulate wallet-handshake latency for demo realism
    setTimeout(() => {
      setConnected(true);
      setProvider(id);
      window.localStorage.setItem(CONNECTED_KEY, "1");
      window.localStorage.setItem(PROVIDER_KEY, id);
      const name = t(PROVIDERS.find((p) => p.id === id)!.nameKey);
      toast.success(t("wallet.connected"), {
        description: `${name}．${MOCK_ADDRESS}．${MOCK_USDC_BALANCE.toFixed(2)} USDC`,
      });
      setConnectingId(null);
      setPickerOpen(false);
    }, 1400);
  };

  const disconnect = () => {
    setConnected(false);
    setProvider(null);
    window.localStorage.removeItem(CONNECTED_KEY);
    window.localStorage.removeItem(PROVIDER_KEY);
    toast.message(t("wallet.disconnected"));
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(MOCK_ADDRESS).catch(() => {});
    toast.success(t("wallet.addressCopied"));
  };

  const currentProvider = providerById(provider);

  // --------------- Picker dialog ---------------
  const picker = (
    <Dialog
      open={pickerOpen}
      onOpenChange={(v) => {
        if (connectingId) return; // block close during the fake handshake
        setPickerOpen(v);
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("wallet.picker.title")}</DialogTitle>
          <DialogDescription>{t("wallet.picker.desc")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-1">
          {PROVIDERS.map((p) => {
            const isLoading = connectingId === p.id;
            const disabled = connectingId !== null && !isLoading;
            return (
              <button
                key={p.id}
                onClick={() => connectWith(p.id)}
                disabled={disabled || isLoading}
                className={cn(
                  "group w-full text-left rounded-lg border border-border bg-card p-3 flex items-center gap-3 transition-colors",
                  disabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-muted/40 hover:border-foreground/20",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg font-bold text-[13px]",
                    p.tileClass,
                  )}
                >
                  {p.monogram}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-semibold">{t(p.nameKey)}</span>
                    {p.recommended && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-accent/15 text-accent px-1.5 py-0.5 text-[10px] font-medium">
                        <Sparkles className="h-2.5 w-2.5" />
                        {t("wallet.picker.recommended")}
                      </span>
                    )}
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-0.5 leading-relaxed">
                    {t(p.descKey)}
                  </div>
                </div>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-2 pt-3 border-t border-border/60 text-[12px] text-muted-foreground leading-relaxed">
          {t("wallet.picker.footer")}
        </div>
      </DialogContent>
    </Dialog>
  );

  // --------------- Not connected states ---------------
  if (!connected) {
    const trigger =
      variant === "sidebar" ? (
        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="block w-full text-left rounded-md p-2.5 transition-transform hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: "var(--yellow)",
            border: "1.5px solid var(--ikea-blue-darker)",
            color: "var(--ikea-blue-darker)",
            boxShadow: "0 3px 0 var(--ikea-blue-darker)",
          }}
        >
          <div className="flex items-center justify-between gap-2 text-[11px]">
            <span className="font-bold uppercase tracking-[0.06em] text-[9px]">
              {t("wallet.row.exchange")}
            </span>
            <span className="font-mono font-semibold text-[10px] flex items-center gap-1">
              <span style={{ color: "var(--sage)" }}>●</span>
              {exchangeAccountId}
            </span>
          </div>
          <div
            className="flex items-center justify-between gap-2 text-[11px] mt-1 pt-1"
            style={{ borderTop: "1px dashed rgba(31, 84, 160, 0.3)" }}
          >
            <span className="font-bold uppercase tracking-[0.06em] text-[9px]">
              {t("wallet.row.onchain")}
            </span>
            <span className="font-mono font-semibold text-[10px] flex items-center gap-1 opacity-60">
              <span>○</span>
              {t("wallet.row.onchain.notLinked")}
            </span>
          </div>
          <div
            className="mt-1.5 text-center font-bold tracking-[0.04em] py-1 rounded-sm text-[11px]"
            style={{
              background: "var(--ikea-blue-darker)",
              color: "var(--yellow)",
            }}
          >
            {t("wallet.row.linkCta")}
          </div>
          <div className="mt-1.5 text-[10px] font-medium opacity-85 leading-snug">
            {t("wallet.connectSub")}
          </div>
        </button>
      ) : (
        <button
          onClick={() => setPickerOpen(true)}
          className="flex min-h-8 max-w-[104px] items-center gap-1.5 rounded-full bg-sidebar-primary/15 px-3 text-[12px] font-medium text-sidebar-primary transition-colors hover:bg-sidebar-primary/25"
        >
          <Wallet className="h-3 w-3" />
          <span className="truncate whitespace-nowrap">{t("wallet.connect")}</span>
        </button>
      );

    return (
      <>
        {trigger}
        {picker}
      </>
    );
  }

  // --------------- Connected states ---------------
  if (variant === "mobile") {
    return (
      <>
        <button
          onClick={copyAddress}
          className="flex min-h-8 max-w-[112px] items-center gap-1.5 rounded-full bg-success/15 px-2.5 text-[12px] font-medium tabular-nums text-success"
          title={MOCK_ADDRESS}
        >
          {currentProvider && (
            <span
              className={cn(
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold",
                currentProvider.tileClass,
              )}
            >
              {currentProvider.monogram}
            </span>
          )}
          <span className="truncate whitespace-nowrap">
            {MOCK_USDC_BALANCE.toFixed(0)} USDC
          </span>
        </button>
        {picker}
      </>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-sidebar-border/60 bg-sidebar-accent/40 overflow-hidden">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-sidebar-accent/70 transition-colors"
        >
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/20 text-success">
            <Wallet className="h-4 w-4" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full border-2 border-sidebar bg-success" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {currentProvider && (
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm text-[9px] font-bold",
                    currentProvider.tileClass,
                  )}
                >
                  {currentProvider.monogram}
                </span>
              )}
              <div className="text-sm font-medium font-mono truncate">{MOCK_ADDRESS}</div>
            </div>
            <div className="text-[12px] text-sidebar-foreground/60 tabular-nums">
              {MOCK_USDC_BALANCE.toFixed(2)} {t("wallet.balance")}
              {currentProvider && (
                <>
                  <span className="mx-1.5">·</span>
                  {t(currentProvider.nameKey)}
                </>
              )}
            </div>
          </div>
        </button>
        <div className={cn("grid transition-all", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
          <div className="overflow-hidden">
            <div className="border-t border-sidebar-border/60 p-2 flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyAddress}
                className="flex-1 justify-start gap-1.5 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8"
              >
                <Copy className="h-3.5 w-3.5" />
                {t("wallet.copyAddress")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={disconnect}
                className="gap-1.5 text-sidebar-foreground/80 hover:bg-destructive/15 hover:text-destructive h-8"
              >
                <LogOut className="h-3.5 w-3.5" />
                {t("wallet.disconnect")}
              </Button>
            </div>
            <div className="border-t border-sidebar-border/60 px-3 py-2 text-[12px] text-sidebar-foreground/50 flex items-center gap-1.5">
              <Check className="h-3 w-3 text-success" />
              {t("wallet.authorized")}
            </div>
          </div>
        </div>
      </div>
      {picker}
    </>
  );
}

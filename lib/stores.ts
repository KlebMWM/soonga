"use client";

import { useSyncExternalStore } from "react";
import {
  auditLog as initialAuditLog,
  pendingApprovals as initialPending,
  type AuditEntry,
  type PendingApproval,
} from "./mockData";

/**
 * Module-level stores for the two pieces of mutable state that need to be
 * shared across pages: the pending-approvals queue and the audit log.
 *
 * Lifted out of per-page useState so that:
 *   - Resolving an approval in /approvals immediately drops the dashboard
 *     hero count + sidebar badge.
 *   - Approving / rejecting in /approvals auto-prepends an audit entry,
 *     visible the moment the user navigates to /audit.
 *   - DemoControls' "approve one" / "reset" / "toggle empty" buttons mutate
 *     the same source of truth that every consumer renders.
 *
 * Implemented with `useSyncExternalStore` over a module-scoped variable —
 * lighter than Context, and keeps SSR snapshots stable (third arg returns
 * the initial mock so server render matches first client paint).
 */

// ---------------- Pending approvals ----------------

let pendingState: PendingApproval[] = [...initialPending];
const pendingListeners = new Set<() => void>();

function emitPending() {
  pendingListeners.forEach((cb) => cb());
}

export const pendingStore = {
  getSnapshot: () => pendingState,
  subscribe: (cb: () => void) => {
    pendingListeners.add(cb);
    return () => {
      pendingListeners.delete(cb);
    };
  },
  /** Imperative read for non-hook contexts (event listeners, simulators). */
  getAll: () => pendingState,
  /** Remove a pending approval by id. No-op if not present. */
  remove(id: string) {
    const before = pendingState.length;
    pendingState = pendingState.filter((a) => a.id !== id);
    if (pendingState.length !== before) emitPending();
  },
  /** Prepend a new approval (used by simulator + counter-offer flow). */
  add(approval: PendingApproval) {
    pendingState = [approval, ...pendingState];
    emitPending();
  },
  /** Replace state — used by toggle-empty (drain) and reset. */
  setAll(next: PendingApproval[]) {
    pendingState = next;
    emitPending();
  },
  reset() {
    pendingState = [...initialPending];
    emitPending();
  },
};

export function usePendingApprovals(): PendingApproval[] {
  return useSyncExternalStore(
    pendingStore.subscribe,
    pendingStore.getSnapshot,
    () => initialPending,
  );
}

// ---------------- Audit log ----------------

let auditState: AuditEntry[] = [...initialAuditLog];
const auditListeners = new Set<() => void>();

function emitAudit() {
  auditListeners.forEach((cb) => cb());
}

export const auditStore = {
  getSnapshot: () => auditState,
  subscribe: (cb: () => void) => {
    auditListeners.add(cb);
    return () => {
      auditListeners.delete(cb);
    };
  },
  getAll: () => auditState,
  /** Prepend a new audit entry — fires when an approval is resolved. */
  prepend(entry: AuditEntry) {
    auditState = [entry, ...auditState];
    emitAudit();
  },
  reset() {
    auditState = [...initialAuditLog];
    emitAudit();
  },
};

export function useAuditLog(): AuditEntry[] {
  return useSyncExternalStore(
    auditStore.subscribe,
    auditStore.getSnapshot,
    () => initialAuditLog,
  );
}

// ---------------- Helpers ----------------

/** Build an audit entry from a resolved approval — closes the loop so a
 *  decision in /approvals shows up in /audit on next render. */
export function approvalToAuditEntry(
  approval: PendingApproval,
  outcome: "approved" | "allowed" | "rejected",
  reasoningSuffix?: { zh: string; en: string },
): AuditEntry {
  const decision: AuditEntry["decision"] =
    outcome === "rejected" ? "rejected" : "approved";
  const userAction =
    outcome === "approved"
      ? { zh: "核准一次", en: "Approved once" }
      : outcome === "allowed"
        ? { zh: "核准並加入信任名單", en: "Approved & allowlisted" }
        : { zh: "拒絕", en: "Rejected" };
  return {
    id: `audit_${Date.now()}_${approval.id}`,
    timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
    agent: approval.agent,
    agentAvatar: approval.agentAvatar,
    merchant: approval.merchant,
    amount: approval.amount,
    decision,
    approvedBy: "user",
    reasoning: reasoningSuffix ?? approval.why,
    userAction,
    txHash: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`,
    gasFee: 0.0014,
  };
}

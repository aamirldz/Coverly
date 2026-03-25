"use client";

import { ToastProvider } from "@/components/ui/Toast";

// ═══════════════════════════════════════════
// CLIENT PROVIDERS — Wraps all client-side
// context providers (Toast, etc.)
// Used in root layout to provide global state
// ═══════════════════════════════════════════

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}

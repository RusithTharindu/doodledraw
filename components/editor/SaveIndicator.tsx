"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { SaveStatus } from "@/types/design";

export function SaveIndicator({ status }: { status: SaveStatus }) {
  const label =
    status === "saving" ? "Saving..." : status === "error" ? "Save failed" : "Saved";
  const Icon =
    status === "saving" ? Loader2 : status === "error" ? AlertCircle : CheckCircle2;

  return (
    <div
      className="inline-grid size-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm"
      title={label}
    >
      <Icon
        className={`size-4 ${status === "saving" ? "animate-spin" : ""} ${
          status === "error" ? "text-red-500" : "text-emerald-600"
        }`}
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

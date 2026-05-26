import Link from "next/link";
import { PenLine } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-[var(--dd-radius-lg)] border border-dashed border-[var(--dd-border-hover)] bg-[var(--dd-surface)] p-8 text-center">
      <div className="grid size-12 place-items-center rounded-[var(--dd-radius-md)] bg-[var(--dd-bg-2)] text-[var(--dd-text-muted)]">
        <PenLine className="size-6" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-[var(--dd-text)]">No saved drawings</h2>
        <p className="mt-1 text-sm text-[var(--dd-text-muted)]">Create your first design.</p>
      </div>
      <Link
        className="inline-flex h-10 items-center justify-center rounded-[var(--dd-radius-md)] bg-[var(--dd-text)] px-4 text-sm font-medium text-[var(--dd-bg)] transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
        href="/editor"
      >
        New Drawing
      </Link>
    </div>
  );
}

import Link from "next/link";
import { PenLine } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
      <div className="grid size-12 place-items-center rounded-md bg-zinc-100 text-zinc-700">
        <PenLine className="size-6" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-zinc-950">No saved drawings</h2>
        <p className="mt-1 text-sm text-zinc-600">Create your first design.</p>
      </div>
      <Link
        className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
        href="/editor"
      >
        New Drawing
      </Link>
    </div>
  );
}

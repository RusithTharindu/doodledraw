"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DesignGrid } from "@/components/designs/DesignGrid";
import { EmptyState } from "@/components/designs/EmptyState";
import {
  deleteDesign,
  duplicateDesign,
  getAllDesigns,
  renameDesign,
} from "@/lib/design-storage";
import type { SavedDesign } from "@/types/design";

type DeleteDialogProps = {
  design: SavedDesign;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteDialog({ design, onCancel, onConfirm }: DeleteDialogProps) {
  return (
    <div
      className="dd-fade fixed inset-0 z-[1000] flex items-center justify-center bg-black/45 p-5 backdrop-blur-md"
      onClick={onCancel}
    >
      <div
        className="dd-scale w-full max-w-[360px] rounded-[var(--dd-radius-xl)] border border-[var(--dd-border)] bg-[var(--dd-surface)] px-7 pb-6 pt-7 shadow-[0_24px_64px_rgba(0,0,0,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 grid size-10 place-items-center rounded-full border border-[#f0bfbf] bg-[#fff0f0] text-[#c94040]">
          <Trash2 className="size-4" aria-hidden="true" />
        </div>
        <h2 className="dd-display text-lg font-medium text-[var(--dd-text)]">Delete drawing?</h2>
        <p className="mt-2 text-sm leading-[1.6] text-[var(--dd-text-muted)]">
          <strong className="font-semibold text-[var(--dd-text)]">{design.name}</strong> will be
          permanently deleted. This action cannot be undone.
        </p>
        <div className="mt-[22px] flex justify-end gap-2">
          <button
            className="rounded-[var(--dd-radius-md)] border border-[var(--dd-border)] bg-[var(--dd-bg)] px-[18px] py-[9px] text-sm font-medium text-[var(--dd-text)] transition hover:bg-[var(--dd-bg-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-[var(--dd-radius-md)] bg-[#c94040] px-[18px] py-[9px] text-sm font-medium text-white transition hover:bg-[#b03535] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c94040]"
            onClick={onConfirm}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DesignsPage() {
  const router = useRouter();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<SavedDesign | null>(null);

  const loadDesigns = useCallback(async () => {
    const items = await getAllDesigns();
    setDesigns(items);
    setLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    getAllDesigns().then((items) => {
      if (active) {
        setDesigns(items);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const filteredDesigns = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) {
      return designs;
    }

    return designs.filter((design) => design.name.toLowerCase().includes(normalized));
  }, [designs, query]);

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-[var(--dd-bg)] px-5 pb-[60px] text-[var(--dd-text)] sm:px-12">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-7 flex items-center justify-between border-b border-[var(--dd-border)] py-8 pb-[26px]">
          <h1 className="dd-display text-[28px] font-semibold leading-tight tracking-normal text-[var(--dd-text)]">
            Designs
          </h1>
          <Link
            aria-label="New drawing"
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-[var(--dd-radius-md)] bg-[var(--dd-text)] px-[18px] py-[9px] text-[13px] font-medium text-[var(--dd-bg)] transition hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(0,0,0,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
            href="/editor"
          >
            <Plus className="size-3.5" aria-hidden="true" />
            New Drawing
          </Link>
        </header>

        <section className="mb-7">
          <label className="relative block max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[var(--dd-text-soft)]"
              aria-hidden="true"
            />
            <input
              className="h-10 w-full rounded-[var(--dd-radius-md)] border border-[var(--dd-border)] bg-[var(--dd-surface)] pl-9 pr-3 text-sm text-[var(--dd-text)] outline-none transition focus:border-[var(--dd-accent)] focus:shadow-[0_0_0_3px_var(--dd-accent-bg)]"
              placeholder="Search drawings..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </section>

        {loading ? (
          <div className="grid min-h-72 place-items-center text-sm text-[var(--dd-text-muted)]">
            Loading designs...
          </div>
        ) : filteredDesigns.length > 0 ? (
          <DesignGrid
            designs={filteredDesigns}
            onOpen={(id) => router.push(`/design/${id}`)}
            onRename={async (design) => {
              await renameDesign(design.id, design.name);
              await loadDesigns();
            }}
            onDuplicate={async (id) => {
              await duplicateDesign(id);
              await loadDesigns();
            }}
            onDelete={(id) => {
              setDeleteTarget(designs.find((design) => design.id === id) ?? null);
            }}
          />
        ) : query.trim() ? (
          <div className="py-20 text-center text-sm text-[var(--dd-text-soft)]">
            No drawings match <em>{query}</em>
          </div>
        ) : (
          <EmptyState />
        )}
      </div>

      {deleteTarget ? (
        <DeleteDialog
          design={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            await deleteDesign(deleteTarget.id);
            setDeleteTarget(null);
            await loadDesigns();
          }}
        />
      ) : null}
    </div>
  );
}

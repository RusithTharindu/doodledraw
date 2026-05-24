"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DesignGrid } from "@/components/designs/DesignGrid";
import { EmptyState } from "@/components/designs/EmptyState";
import { Icon } from "@/components/Icon";
import {
  deleteDesign,
  duplicateDesign,
  getAllDesigns,
  renameDesign,
} from "@/lib/design-storage";
import type { SavedDesign } from "@/types/design";

export default function DesignsPage() {
  const router = useRouter();
  const [designs, setDesigns] = useState<SavedDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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
    <main className="min-h-dvh bg-zinc-100 text-zinc-950">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link
              aria-label="DoodleDraw home"
              className="inline-flex h-10 items-center rounded-md text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
              href="/"
              title="DoodleDraw"
            >
              <Icon
                className="size-9"
                showIconTitle
                titleClassName="text-xl font-semibold tracking-tight"
              />
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">Designs</h1>
          </div>
          <Link
            aria-label="New drawing"
            className="inline-grid size-10 place-items-center rounded-md bg-zinc-950 text-white shadow-sm transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400"
            href="/editor"
            title="New drawing"
          >
            <Plus className="size-4" aria-hidden="true" />
          </Link>
        </header>
        <section className="py-6">
          <label className="relative block max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
              aria-hidden="true"
            />
            <input
              className="h-11 w-full rounded-md border border-zinc-200 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-zinc-400"
              placeholder="Search drawings"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
        </section>
        {loading ? (
          <div className="grid min-h-72 place-items-center text-sm text-zinc-600">
            Loading designs...
          </div>
        ) : filteredDesigns.length > 0 ? (
          <DesignGrid
            designs={filteredDesigns}
            onOpen={(id) => router.push(`/design/${id}`)}
            onRename={async (design) => {
              const nextName = window.prompt("Rename drawing", design.name);

              if (nextName && nextName.trim()) {
                await renameDesign(design.id, nextName);
                await loadDesigns();
              }
            }}
            onDuplicate={async (id) => {
              await duplicateDesign(id);
              await loadDesigns();
            }}
            onDelete={async (id) => {
              if (window.confirm("Delete this drawing?")) {
                await deleteDesign(id);
                await loadDesigns();
              }
            }}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </main>
  );
}

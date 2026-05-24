"use client";

import { formatDistanceToNow } from "date-fns";
import { Copy, FolderOpen, Pencil, Trash2 } from "lucide-react";
import type { SavedDesign } from "@/types/design";

type DesignCardProps = {
  design: SavedDesign;
  onOpen: (id: string) => void;
  onRename: (design: SavedDesign) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

const iconButton =
  "inline-grid size-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-50 hover:text-zinc-950";

export function DesignCard({
  design,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: DesignCardProps) {
  return (
    <article className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
      <button
        className="block aspect-[4/3] w-full bg-zinc-100 text-left"
        onClick={() => onOpen(design.id)}
        type="button"
      >
        {design.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="h-full w-full object-contain"
            src={design.thumbnail}
            alt={`${design.name} preview`}
          />
        ) : (
          <div className="grid h-full place-items-center text-sm font-medium text-zinc-500">
            No Preview
          </div>
        )}
      </button>
      <div className="space-y-3 p-4">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold text-zinc-950">{design.name}</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Updated{" "}
            {formatDistanceToNow(new Date(design.updatedAt), {
              addSuffix: true,
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className={iconButton} onClick={() => onOpen(design.id)} type="button">
            <FolderOpen className="size-4" aria-hidden="true" />
            <span className="sr-only">Open</span>
          </button>
          <button className={iconButton} onClick={() => onRename(design)} type="button">
            <Pencil className="size-4" aria-hidden="true" />
            <span className="sr-only">Rename</span>
          </button>
          <button className={iconButton} onClick={() => onDuplicate(design.id)} type="button">
            <Copy className="size-4" aria-hidden="true" />
            <span className="sr-only">Duplicate</span>
          </button>
          <button
            className={`${iconButton} hover:border-red-200 hover:bg-red-50 hover:text-red-600`}
            onClick={() => onDelete(design.id)}
            type="button"
          >
            <Trash2 className="size-4" aria-hidden="true" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
}

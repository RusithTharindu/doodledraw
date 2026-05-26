"use client";

import { formatDistanceToNow } from "date-fns";
import { Copy, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SavedDesign } from "@/types/design";

type DesignCardProps = {
  design: SavedDesign;
  onOpen: (id: string) => void;
  onRename: (design: SavedDesign) => void | Promise<void>;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
};

type ThumbnailSketchProps = {
  variant: number;
};

const actionButton =
  "grid size-7 place-items-center rounded-[var(--dd-radius-sm)] border border-[var(--dd-border)] bg-[var(--dd-surface)] text-[var(--dd-text-muted)] transition hover:border-[var(--dd-border-hover)] hover:bg-[var(--dd-bg-2)] hover:text-[var(--dd-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]";

function sketchVariant(id: string) {
  return [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5;
}

function ThumbnailSketch({ variant }: ThumbnailSketchProps) {
  const accentBg = "var(--dd-accent-bg)";
  const accentStroke = "var(--dd-accent)";

  const sketches = [
    <>
      <rect x="8" y="14" width="42" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="90" y="14" width="42" height="28" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="49" y="60" width="42" height="24" rx="3" fill={accentBg} stroke={accentStroke} strokeWidth="1.2" />
      <line x1="50" y1="28" x2="90" y2="28" stroke="currentColor" strokeWidth="1.1" />
      <polygon points="87,25.5 91.5,28 87,30.5" fill="currentColor" />
      <line x1="29" y1="42" x2="70" y2="60" stroke="currentColor" strokeDasharray="3,2" strokeWidth="1.1" />
      <line x1="111" y1="42" x2="70" y2="60" stroke="currentColor" strokeDasharray="3,2" strokeWidth="1.1" />
    </>,
    <>
      <rect x="8" y="10" width="124" height="14" rx="2" fill="currentColor" opacity="0.18" />
      <rect x="8" y="30" width="34" height="54" rx="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <rect x="48" y="30" width="84" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <rect x="48" y="60" width="38" height="24" rx="2" fill={accentBg} stroke={accentStroke} strokeWidth="1.1" />
      <rect x="94" y="60" width="38" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="1.1" />
    </>,
    <>
      <circle cx="27" cy="50" r="18" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <line x1="45" y1="50" x2="67" y2="50" stroke="currentColor" strokeWidth="1.1" />
      <polygon points="64,47.5 68.5,50 64,52.5" fill="currentColor" />
      <rect x="70" y="37" width="26" height="26" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" transform="rotate(45 83 50)" />
      <line x1="102" y1="50" x2="120" y2="50" stroke="currentColor" strokeWidth="1.1" />
      <polygon points="117,47.5 121.5,50 117,52.5" fill="currentColor" />
      <circle cx="131" cy="50" r="14" fill={accentBg} stroke={accentStroke} strokeWidth="1.2" />
    </>,
    <>
      <ellipse cx="70" cy="50" rx="20" ry="13" fill={accentBg} stroke={accentStroke} strokeWidth="1.2" />
      <circle cx="18" cy="22" r="11" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <line x1="50" y1="40" x2="29" y2="30" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="122" cy="22" r="11" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <line x1="90" y1="40" x2="111" y2="30" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="18" cy="78" r="11" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <line x1="50" y1="60" x2="29" y2="70" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="122" cy="78" r="11" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <line x1="90" y1="60" x2="111" y2="70" stroke="currentColor" strokeWidth="1.1" />
    </>,
    <>
      <rect x="8" y="10" width="124" height="20" rx="4" fill="none" stroke="currentColor" strokeWidth="1.2" />
      <rect x="8" y="10" width="40" height="20" rx="4" fill={accentBg} stroke={accentStroke} strokeWidth="1.2" />
      <rect x="8" y="40" width="56" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <rect x="76" y="40" width="56" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <rect x="8" y="72" width="124" height="8" rx="2" fill="currentColor" opacity="0.15" />
    </>,
  ];

  return (
    <svg className="h-full w-full text-[var(--dd-text-muted)]" viewBox="0 0 140 100">
      {sketches[variant]}
    </svg>
  );
}

export function DesignCard({
  design,
  onOpen,
  onRename,
  onDuplicate,
  onDelete,
}: DesignCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [draftName, setDraftName] = useState(design.name);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const variant = useMemo(() => sketchVariant(design.id), [design.id]);

  useEffect(() => {
    if (isRenaming) {
      inputRef.current?.select();
    }
  }, [isRenaming]);

  const finishRename = async () => {
    if (!isRenaming) {
      return;
    }

    const nextName = draftName.trim();
    setIsRenaming(false);

    if (nextName && nextName !== design.name) {
      await onRename({ ...design, name: nextName });
    } else {
      setDraftName(design.name);
    }
  };

  return (
    <article className="group overflow-hidden rounded-[var(--dd-radius-lg)] border border-[var(--dd-border)] bg-[var(--dd-surface)] shadow-[0_1px_4px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5 hover:border-[var(--dd-border-hover)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)]">
      <div className="relative flex h-[150px] items-center justify-center overflow-hidden border-b border-[var(--dd-border)] bg-[var(--dd-bg)] p-4">
        <button
          aria-label={`Open ${design.name}`}
          className="absolute inset-0 z-10"
          onClick={() => onOpen(design.id)}
          type="button"
        />
        {design.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="relative z-0 h-full w-full object-contain"
            src={design.thumbnail}
            alt={`${design.name} preview`}
          />
        ) : (
          <ThumbnailSketch variant={variant} />
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex translate-y-1 gap-1.5 bg-gradient-to-t from-[var(--dd-bg)] from-55% to-transparent p-2.5 opacity-0 transition group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
          <button className={actionButton} onClick={() => onOpen(design.id)} title="Open" type="button">
            <ExternalLink className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Open</span>
          </button>
          <button
            className={actionButton}
            onClick={() => {
              setDraftName(design.name);
              setIsRenaming(true);
            }}
            title="Rename"
            type="button"
          >
            <Pencil className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Rename</span>
          </button>
          <button className={actionButton} onClick={() => onDuplicate(design.id)} title="Duplicate" type="button">
            <Copy className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Duplicate</span>
          </button>
          <button
            className={`${actionButton} text-[#c94040] hover:border-[#f0bfbf] hover:bg-[#fff0f0] hover:text-[#c94040]`}
            onClick={() => onDelete(design.id)}
            title="Delete"
            type="button"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </div>
      <div className="px-3.5 py-3">
        {isRenaming ? (
          <input
            className="w-full border-0 border-b-[1.5px] border-[var(--dd-accent)] bg-transparent px-0 py-px text-sm font-medium text-[var(--dd-text)] outline-none"
            onBlur={() => void finishRename()}
            onChange={(event) => setDraftName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }

              if (event.key === "Escape") {
                setDraftName(design.name);
                setIsRenaming(false);
              }
            }}
            ref={inputRef}
            value={draftName}
          />
        ) : (
          <h2 className="truncate text-sm font-medium text-[var(--dd-text)]">{design.name}</h2>
        )}
        <p className="mt-1 text-xs text-[var(--dd-text-soft)]">
          Updated{" "}
          {formatDistanceToNow(new Date(design.updatedAt), {
            addSuffix: true,
          })}
        </p>
      </div>
    </article>
  );
}

"use client";

import {
  Download,
  FileJson,
  FolderOpen,
  ImageDown,
  Save,
  Upload,
} from "lucide-react";
import type { ComponentType, InputHTMLAttributes } from "react";

type SaveToolbarProps = {
  name: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onImport: (file: File) => void;
  onExportJson: () => void;
  onExportExcalidraw: () => void;
  onExportPng: () => void;
  onExportSvg: () => void;
};

type IconButtonProps = {
  label: string;
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  onClick?: () => void;
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
};

const iconButtonClass =
  "inline-grid size-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-300";

function IconButton({ label, icon: Icon, onClick, inputProps }: IconButtonProps) {
  if (inputProps) {
    return (
      <label className={iconButtonClass} title={label}>
        <Icon className="size-4" aria-hidden={true} />
        <span className="sr-only">{label}</span>
        <input className="sr-only" {...inputProps} />
      </label>
    );
  }

  return (
    <button
      aria-label={label}
      className={iconButtonClass}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon className="size-4" aria-hidden={true} />
    </button>
  );
}

export function SaveToolbar({
  name,
  onNameChange,
  onSave,
  onImport,
  onExportJson,
  onExportExcalidraw,
  onExportPng,
  onExportSvg,
}: SaveToolbarProps) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-2">
      <input
        className="h-9 w-48 max-w-[55vw] rounded-md border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-900 outline-none transition focus:border-zinc-400"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        aria-label="Drawing name"
      />
      <div className="flex items-center gap-1">
        <IconButton label="Save" icon={Save} onClick={onSave} />
        <IconButton
          label="Import"
          icon={Upload}
          inputProps={{
            type: "file",
            accept: ".excalidraw,.json,application/json",
            onChange: (event) => {
              const file = event.currentTarget.files?.[0];
              if (file) {
                onImport(file);
                event.currentTarget.value = "";
              }
            },
          }}
        />
      </div>
      <div className="flex items-center gap-1 border-l border-zinc-200 pl-2">
        <IconButton
          label="Export Excalidraw"
          icon={FolderOpen}
          onClick={onExportExcalidraw}
        />
        <IconButton label="Export JSON" icon={FileJson} onClick={onExportJson} />
        <IconButton label="Export PNG" icon={ImageDown} onClick={onExportPng} />
        <IconButton label="Export SVG" icon={Download} onClick={onExportSvg} />
      </div>
    </div>
  );
}

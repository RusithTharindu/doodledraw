"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { FilePlus2, Images } from "lucide-react";
import type {
  AppState,
  BinaryFiles,
  ExcalidrawImperativeAPI,
  ExcalidrawInitialDataState,
  UIOptions,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import {
  exportSceneAsJson,
  exportSceneAsPng,
  exportSceneAsSvg,
  importSceneFromFile,
} from "@/lib/export";
import { sceneFromDesign } from "@/lib/excalidraw";
import { useAutosave } from "@/hooks/useAutosave";
import type { DoodleScene, SavedDesign } from "@/types/design";
import { Icon } from "@/components/Icon";
import { SaveIndicator } from "@/components/editor/SaveIndicator";
import { SaveToolbar } from "@/components/editor/SaveToolbar";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  {
    ssr: false,
    loading: () => (
      <div className="grid h-full place-items-center bg-white text-sm text-zinc-500">
        Loading canvas...
      </div>
    ),
  },
);

type ExcalidrawEditorProps = {
  initialDesign?: SavedDesign;
};

const blankScene: DoodleScene = {
  elements: [],
  appState: {
    viewBackgroundColor: "#ffffff",
  },
  files: {},
};

const excalidrawUIOptions: Partial<UIOptions> = {
  canvasActions: {
    loadScene: false,
    saveToActiveFile: false,
    export: false,
  },
  tools: {
    image: true,
  },
};

function hasDrawableContent(scene: DoodleScene) {
  return scene.elements.some((element) => !element.isDeleted);
}

export function ExcalidrawEditor({ initialDesign }: ExcalidrawEditorProps) {
  const router = useRouter();
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const hasReceivedInitialSceneRef = useRef(false);
  const [initialScene] = useState<DoodleScene>(() =>
    initialDesign ? sceneFromDesign(initialDesign) : blankScene,
  );
  const sceneRef = useRef<DoodleScene>(initialScene);
  const [designId, setDesignId] = useState(initialDesign?.id);
  const [name, setName] = useState(initialDesign?.name ?? "Untitled drawing");
  const [message, setMessage] = useState<string | null>(null);

  const [initialData] = useState<ExcalidrawInitialDataState>(
    () => ({
      elements: initialScene.elements,
      appState: initialScene.appState,
      files: initialScene.files,
    }),
  );

  const getCurrentScene = useCallback(() => sceneRef.current, []);

  const { status, saveNow, scheduleSave, setStatus } = useAutosave({
    getScene: getCurrentScene,
    designId,
    name,
    onSaved: (saved) => {
      setDesignId(saved.id);

      if (!designId) {
        router.replace(`/design/${saved.id}`);
      }
    },
  });

  const currentDesign = useCallback(
    () => ({
      name,
      ...sceneRef.current,
    }),
    [name],
  );

  const handleChange = useCallback(
    (
      elements: readonly ExcalidrawElement[],
      appState: AppState,
      files: BinaryFiles,
    ) => {
      sceneRef.current = { elements, appState, files };

      if (!hasReceivedInitialSceneRef.current) {
        hasReceivedInitialSceneRef.current = true;
        return;
      }

      if (!designId && !hasDrawableContent(sceneRef.current)) {
        return;
      }

      scheduleSave();
    },
    [designId, scheduleSave],
  );

  const handleManualSave = useCallback(async () => {
    const saved = await saveNow();
    if (saved) {
      setMessage("Saved locally");
      window.setTimeout(() => setMessage(null), 1800);
    }
  }, [saveNow]);

  const handleImport = useCallback(
    async (file: File) => {
      try {
        const importedScene = await importSceneFromFile(file);
        apiRef.current?.updateScene({
          elements: importedScene.elements,
          appState: importedScene.appState as AppState,
        });
        apiRef.current?.addFiles(Object.values(importedScene.files));
        sceneRef.current = importedScene;
        setStatus("saving");
        if (designId || hasDrawableContent(importedScene)) {
          scheduleSave();
        }
        setMessage("Imported scene");
        window.setTimeout(() => setMessage(null), 1800);
      } catch (error) {
        console.error(error);
        setStatus("error");
        setMessage(error instanceof Error ? error.message : "Import failed");
      }
    },
    [designId, scheduleSave, setStatus],
  );

  return (
    <div className="grid h-dvh grid-rows-[auto_minmax(0,1fr)] bg-zinc-100 text-zinc-950">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-3 py-2">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <Link
            aria-label="DoodleDraw home"
            className="inline-grid size-9 shrink-0 place-items-center rounded-md text-zinc-950 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            href="/"
            title="DoodleDraw"
          >
            <Icon className="size-8" />
          </Link>
          <SaveToolbar
            name={name}
            onNameChange={(value) => {
              setName(value);
              if (designId || hasDrawableContent(sceneRef.current)) {
                scheduleSave();
              }
            }}
            onSave={handleManualSave}
            onImport={handleImport}
            onExportJson={() => void exportSceneAsJson(currentDesign(), "json")}
            onExportExcalidraw={() =>
              void exportSceneAsJson(currentDesign(), "excalidraw")
            }
            onExportPng={() => void exportSceneAsPng(currentDesign())}
            onExportSvg={() => void exportSceneAsSvg(currentDesign())}
          />
          {message ? (
            <div className="w-fit rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-700 shadow-sm">
              {message}
            </div>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <nav className="flex items-center gap-1">
            <Link
              aria-label="New drawing"
              className="inline-grid size-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-300"
              href="/editor"
              title="New drawing"
            >
              <FilePlus2 className="size-4" aria-hidden="true" />
            </Link>
            <Link
              aria-label="Designs"
              className="inline-grid size-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-300"
              href="/designs"
              title="Designs"
            >
              <Images className="size-4" aria-hidden="true" />
            </Link>
          </nav>
          <SaveIndicator status={status === "idle" ? "saved" : status} />
        </div>
      </header>
      <main className="relative min-h-0 overflow-hidden">
        <div className="h-full min-h-0 w-full">
          <Excalidraw
            initialData={initialData}
            excalidrawAPI={(api) => {
              apiRef.current = api;
            }}
            onChange={handleChange}
            UIOptions={excalidrawUIOptions}
          />
        </div>
      </main>
    </div>
  );
}

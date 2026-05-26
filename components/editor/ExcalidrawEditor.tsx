"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useRef, useState, type ComponentProps } from "react";
import { AlertTriangle, FilePlus2, Images, Loader2 } from "lucide-react";
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

type NavigationIntent = {
  href: "/" | "/editor" | "/designs";
  label: string;
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

function getSceneChangeKey(scene: DoodleScene) {
  return JSON.stringify({
    elements: scene.elements,
    fileIds: Object.keys(scene.files).sort(),
    viewBackgroundColor: scene.appState.viewBackgroundColor,
  });
}

function PendingSaveDialog({
  targetLabel,
  saving,
  onCancel,
  onContinue,
  onStayAndSave,
}: {
  targetLabel: string;
  saving: boolean;
  onCancel: () => void;
  onContinue: () => void;
  onStayAndSave: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/35 px-4 backdrop-blur-sm">
      <section
        aria-labelledby="pending-save-title"
        aria-describedby="pending-save-description"
        aria-modal="true"
        className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-5 text-zinc-950 shadow-2xl"
        role="dialog"
      >
        <div className="flex items-start gap-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
            <AlertTriangle className="size-4" aria-hidden="true" />
          </div>
          <div>
            <h2 id="pending-save-title" className="text-base font-semibold">
              Drawing is still saving
            </h2>
            <p
              id="pending-save-description"
              className="mt-1 text-sm leading-6 text-zinc-600"
            >
              Your latest changes have not finished saving. Continue to{" "}
              {targetLabel} now, or stay here until the save completes.
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-[0.85fr_1fr_1.15fr]">
          <button
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={saving}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button
            className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={saving}
            onClick={onContinue}
            type="button"
          >
            Continue now
          </button>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 disabled:cursor-wait disabled:bg-zinc-700"
            disabled={saving}
            onClick={onStayAndSave}
            type="button"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Stay and save
          </button>
        </div>
      </section>
    </div>
  );
}

export function ExcalidrawEditor({ initialDesign }: ExcalidrawEditorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const hasReceivedInitialSceneRef = useRef(false);
  const allowPostSaveRedirectRef = useRef(true);
  const [initialScene] = useState<DoodleScene>(() =>
    initialDesign ? sceneFromDesign(initialDesign) : blankScene,
  );
  const sceneRef = useRef<DoodleScene>(initialScene);
  const lastScheduledSceneKeyRef = useRef(getSceneChangeKey(initialScene));
  const [designId, setDesignId] = useState(initialDesign?.id);
  const [name, setName] = useState(initialDesign?.name ?? "Untitled drawing");
  const [message, setMessage] = useState<string | null>(null);
  const [navigationIntent, setNavigationIntent] =
    useState<NavigationIntent | null>(null);
  const [isResolvingNavigation, setIsResolvingNavigation] = useState(false);

  const [initialData] = useState<ExcalidrawInitialDataState>(
    () => ({
      elements: initialScene.elements,
      appState: initialScene.appState,
      files: initialScene.files,
    }),
  );

  const getCurrentScene = useCallback(() => sceneRef.current, []);

  const {
    status,
    hasPendingSave,
    saveNow,
    flushSave,
    scheduleSave,
    setStatus,
  } = useAutosave({
    getScene: getCurrentScene,
    designId,
    name,
    onSaved: (saved) => {
      if (!allowPostSaveRedirectRef.current) {
        return;
      }

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
      const nextSceneKey = getSceneChangeKey(sceneRef.current);

      if (!hasReceivedInitialSceneRef.current) {
        hasReceivedInitialSceneRef.current = true;
        lastScheduledSceneKeyRef.current = nextSceneKey;
        return;
      }

      if (nextSceneKey === lastScheduledSceneKeyRef.current) {
        return;
      }

      lastScheduledSceneKeyRef.current = nextSceneKey;

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

  const guardNavigation = useCallback(
    (
      intent: NavigationIntent,
    ): NonNullable<ComponentProps<typeof Link>["onNavigate"]> =>
      (event) => {
        if (hasPendingSave || status === "saving") {
          event.preventDefault();
          setNavigationIntent(intent);
        }
      },
    [hasPendingSave, status],
  );

  const continuePendingNavigation = useCallback(() => {
    if (!navigationIntent) {
      return;
    }

    const { href } = navigationIntent;
    allowPostSaveRedirectRef.current = pathname === href;
    setNavigationIntent(null);
    router.push(href);
  }, [navigationIntent, pathname, router]);

  const stayAndSaveBeforeNavigation = useCallback(async () => {
    setIsResolvingNavigation(true);
    const saved = await flushSave();
    setIsResolvingNavigation(false);

    if (saved) {
      setNavigationIntent(null);
      setMessage("Saved locally");
      window.setTimeout(() => setMessage(null), 1800);
    }
  }, [flushSave]);

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
        lastScheduledSceneKeyRef.current = getSceneChangeKey(importedScene);
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
            onNavigate={guardNavigation({ href: "/", label: "home" })}
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
              onNavigate={guardNavigation({
                href: "/editor",
                label: "a new drawing",
              })}
              title="New drawing"
            >
              <FilePlus2 className="size-4" aria-hidden="true" />
            </Link>
            <Link
              aria-label="Designs"
              className="inline-grid size-9 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-300"
              href="/designs"
              onNavigate={guardNavigation({ href: "/designs", label: "Designs" })}
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
      {navigationIntent ? (
        <PendingSaveDialog
          targetLabel={navigationIntent.label}
          saving={isResolvingNavigation}
          onCancel={() => setNavigationIntent(null)}
          onContinue={continuePendingNavigation}
          onStayAndSave={stayAndSaveBeforeNavigation}
        />
      ) : null}
    </div>
  );
}

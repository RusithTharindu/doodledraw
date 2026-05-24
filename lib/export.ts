import type { DoodleScene, SavedDesign } from "@/types/design";

type ImportedScenePayload = {
  type?: string;
  elements?: DoodleScene["elements"];
  appState?: DoodleScene["appState"];
  files?: DoodleScene["files"];
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function safeFilename(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]+/g, "-") || "doodledraw";
}

export async function exportSceneAsJson(
  design: Pick<SavedDesign, "name"> & DoodleScene,
  extension: "json" | "excalidraw",
) {
  const { serializeAsJSON } = await import("@excalidraw/excalidraw");
  const json = serializeAsJSON(design.elements, design.appState, design.files, "local");
  downloadBlob(
    new Blob([json], { type: "application/json" }),
    `${safeFilename(design.name)}.${extension}`,
  );
}

export async function exportSceneAsPng(design: Pick<SavedDesign, "name"> & DoodleScene) {
  const { exportToCanvas } = await import("@excalidraw/excalidraw");
  const canvas = await exportToCanvas({
    elements: design.elements.filter((element) => !element.isDeleted),
    appState: {
      ...design.appState,
      exportBackground: true,
      viewBackgroundColor: design.appState.viewBackgroundColor ?? "#ffffff",
    },
    files: design.files,
    maxWidthOrHeight: 2400,
  });

  canvas.toBlob((blob: Blob | null) => {
    if (blob) {
      downloadBlob(blob, `${safeFilename(design.name)}.png`);
    }
  }, "image/png");
}

export async function exportSceneAsSvg(design: Pick<SavedDesign, "name"> & DoodleScene) {
  const { exportToSvg } = await import("@excalidraw/excalidraw");
  const svg = await exportToSvg({
    elements: design.elements.filter((element) => !element.isDeleted),
    appState: {
      ...design.appState,
      exportBackground: true,
      viewBackgroundColor: design.appState.viewBackgroundColor ?? "#ffffff",
    },
    files: design.files,
  });

  downloadBlob(
    new Blob([svg.outerHTML], { type: "image/svg+xml" }),
    `${safeFilename(design.name)}.svg`,
  );
}

export async function importSceneFromFile(file: File): Promise<DoodleScene> {
  const payload = JSON.parse(await file.text()) as ImportedScenePayload;

  if (!Array.isArray(payload.elements)) {
    throw new Error("The selected file does not contain an Excalidraw scene.");
  }

  return {
    elements: payload.elements,
    appState: payload.appState ?? {},
    files: payload.files ?? {},
  };
}

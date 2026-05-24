import type { AppState, BinaryFiles } from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";
import type { DoodleScene } from "@/types/design";

type SerializedScene = {
  elements?: readonly ExcalidrawElement[];
  appState?: Partial<AppState>;
  files?: BinaryFiles;
};

export async function serializeSceneForStorage(scene: DoodleScene): Promise<DoodleScene> {
  const { serializeAsJSON } = await import("@excalidraw/excalidraw");
  const serialized = serializeAsJSON(
    scene.elements,
    scene.appState,
    scene.files,
    "local",
  );
  const parsed = JSON.parse(serialized) as SerializedScene;

  return {
    elements: parsed.elements ?? [],
    appState: parsed.appState ?? {},
    files: parsed.files ?? {},
  };
}

export function sceneFromDesign(design: DoodleScene): DoodleScene {
  return {
    elements: design.elements ?? [],
    appState: design.appState ?? {},
    files: design.files ?? {},
  };
}

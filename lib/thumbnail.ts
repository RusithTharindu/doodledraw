import type { DoodleScene } from "@/types/design";

export async function createThumbnail(scene: DoodleScene): Promise<string | undefined> {
  const visibleElements = scene.elements.filter((element) => !element.isDeleted);

  if (visibleElements.length === 0) {
    return undefined;
  }

  try {
    const { exportToCanvas } = await import("@excalidraw/excalidraw");
    const canvas = await exportToCanvas({
      elements: visibleElements,
      appState: {
        ...scene.appState,
        exportBackground: true,
        viewBackgroundColor: scene.appState.viewBackgroundColor ?? "#ffffff",
      },
      files: scene.files,
      maxWidthOrHeight: 640,
    });

    return canvas.toDataURL("image/png");
  } catch (error) {
    console.error("Unable to generate thumbnail", error);
    return undefined;
  }
}

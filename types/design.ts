import type {
  AppState,
  BinaryFiles,
} from "@excalidraw/excalidraw/types";
import type { ExcalidrawElement } from "@excalidraw/excalidraw/element/types";

export type DoodleScene = {
  elements: readonly ExcalidrawElement[];
  appState: Partial<AppState>;
  files: BinaryFiles;
};

export type SavedDesign = DoodleScene & {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
};

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export interface DesignStorage {
  save(design: Omit<SavedDesign, "id" | "createdAt" | "updatedAt">): Promise<SavedDesign>;
  update(id: string, design: Partial<Omit<SavedDesign, "id" | "createdAt">>): Promise<SavedDesign>;
  delete(id: string): Promise<void>;
  duplicate(id: string): Promise<SavedDesign>;
  get(id: string): Promise<SavedDesign | undefined>;
  list(): Promise<SavedDesign[]>;
}

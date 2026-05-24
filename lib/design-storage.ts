import { v4 as uuid } from "uuid";
import { DESIGN_STORE, getDatabase } from "@/lib/db";
import { serializeSceneForStorage } from "@/lib/excalidraw";
import type { DesignStorage, SavedDesign } from "@/types/design";

type SaveInput = Omit<SavedDesign, "id" | "createdAt" | "updatedAt">;
type UpdateInput = Partial<Omit<SavedDesign, "id" | "createdAt">>;

export class IndexedDBStorage implements DesignStorage {
  async save(input: SaveInput): Promise<SavedDesign> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const scene = await serializeSceneForStorage(input);
    const design: SavedDesign = {
      ...scene,
      id: uuid(),
      name: input.name.trim() || "Untitled drawing",
      thumbnail: input.thumbnail,
      createdAt: now,
      updatedAt: now,
    };

    await db.put(DESIGN_STORE, design);
    return design;
  }

  async update(id: string, input: UpdateInput): Promise<SavedDesign> {
    const db = await getDatabase();
    const existing = await db.get(DESIGN_STORE, id);

    if (!existing) {
      throw new Error("Design not found");
    }

    const scene =
      input.elements || input.appState || input.files
        ? await serializeSceneForStorage({
            elements: input.elements ?? existing.elements,
            appState: input.appState ?? existing.appState,
            files: input.files ?? existing.files,
          })
        : {
            elements: existing.elements,
            appState: existing.appState,
            files: existing.files,
          };

    const updated: SavedDesign = {
      ...existing,
      ...scene,
      name: input.name?.trim() || existing.name,
      thumbnail: input.thumbnail ?? existing.thumbnail,
      updatedAt: new Date().toISOString(),
    };

    await db.put(DESIGN_STORE, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.delete(DESIGN_STORE, id);
  }

  async duplicate(id: string): Promise<SavedDesign> {
    const design = await this.get(id);

    if (!design) {
      throw new Error("Design not found");
    }

    return this.save({
      name: `${design.name} copy`,
      elements: design.elements,
      appState: design.appState,
      files: design.files,
      thumbnail: design.thumbnail,
    });
  }

  async get(id: string): Promise<SavedDesign | undefined> {
    const db = await getDatabase();
    return db.get(DESIGN_STORE, id);
  }

  async list(): Promise<SavedDesign[]> {
    const db = await getDatabase();
    const designs = await db.getAll(DESIGN_STORE);

    return designs.sort(
      (left, right) =>
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime(),
    );
  }
}

export const designStorage = new IndexedDBStorage();

export const saveDesign = (input: SaveInput) => designStorage.save(input);
export const updateDesign = (id: string, input: UpdateInput) =>
  designStorage.update(id, input);
export const deleteDesign = (id: string) => designStorage.delete(id);
export const duplicateDesign = (id: string) => designStorage.duplicate(id);
export const getDesign = (id: string) => designStorage.get(id);
export const getAllDesigns = () => designStorage.list();
export const renameDesign = (id: string, name: string) =>
  designStorage.update(id, { name });

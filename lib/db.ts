import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { SavedDesign } from "@/types/design";

const DB_NAME = "doodledraw-db";
const DB_VERSION = 1;
export const DESIGN_STORE = "designs";

interface DoodleDrawDB extends DBSchema {
  designs: {
    key: string;
    value: SavedDesign;
    indexes: {
      "by-updated": string;
      "by-name": string;
    };
  };
}

let dbPromise: Promise<IDBPDatabase<DoodleDrawDB>> | undefined;

export function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<DoodleDrawDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(DESIGN_STORE)) {
          const store = db.createObjectStore(DESIGN_STORE, { keyPath: "id" });
          store.createIndex("by-updated", "updatedAt");
          store.createIndex("by-name", "name");
        }
      },
    });
  }

  return dbPromise;
}

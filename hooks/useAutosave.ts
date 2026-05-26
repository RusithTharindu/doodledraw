"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { saveDesign, updateDesign } from "@/lib/design-storage";
import { createThumbnail } from "@/lib/thumbnail";
import type { DoodleScene, SavedDesign, SaveStatus } from "@/types/design";

type AutosaveOptions = {
  getScene: () => DoodleScene | null;
  designId?: string;
  name: string;
  delay?: number;
  onSaved: (design: SavedDesign) => void;
};

export function useAutosave({
  getScene,
  designId,
  name,
  delay = 2000,
  onSaved,
}: AutosaveOptions) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [hasPendingSave, setHasPendingSave] = useState(false);
  const getSceneRef = useRef(getScene);
  const designIdRef = useRef(designId);
  const nameRef = useRef(name);
  const dirtyVersionRef = useRef(0);
  const savedVersionRef = useRef(0);
  const savingPromiseRef = useRef<Promise<SavedDesign | null> | null>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    getSceneRef.current = getScene;
  }, [getScene]);

  useEffect(() => {
    designIdRef.current = designId;
  }, [designId]);

  useEffect(() => {
    nameRef.current = name;
  }, [name]);

  const performSave = useCallback(async () => {
    const currentScene = getSceneRef.current();

    if (!currentScene) {
      return null;
    }

    const versionToSave = dirtyVersionRef.current;
    setStatus("saving");

    const savingPromise = (async () => {
      try {
        const thumbnail = await createThumbnail(currentScene);
        const currentId = designIdRef.current;
        const saved = currentId
          ? await updateDesign(currentId, {
              name: nameRef.current,
              ...currentScene,
              thumbnail,
            })
          : await saveDesign({
              name: nameRef.current,
              ...currentScene,
              thumbnail,
            });

        designIdRef.current = saved.id;
        savedVersionRef.current = Math.max(
          savedVersionRef.current,
          versionToSave,
        );
        onSaved(saved);

        if (dirtyVersionRef.current <= savedVersionRef.current) {
          setHasPendingSave(false);
          setStatus("saved");
        } else {
          setStatus("saving");
        }

        return saved;
      } catch (error) {
        console.error("Autosave failed", error);
        setStatus("error");
        return null;
      } finally {
        savingPromiseRef.current = null;
      }
    })();

    savingPromiseRef.current = savingPromise;
    return savingPromise;
  }, [onSaved]);

  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (savingPromiseRef.current) {
      const saved = await savingPromiseRef.current;

      if (!saved || dirtyVersionRef.current <= savedVersionRef.current) {
        return saved;
      }
    }

    return performSave();
  }, [performSave]);

  const flushSave = useCallback(async () => {
    const saved = await saveNow();

    if (saved) {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      savedVersionRef.current = dirtyVersionRef.current;
      setHasPendingSave(false);
      setStatus("saved");
    }

    return saved;
  }, [saveNow]);

  const scheduleSave = useCallback(() => {
    dirtyVersionRef.current += 1;
    setHasPendingSave(true);
    setStatus("saving");

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      void saveNow();
    }, delay);
  }, [delay, saveNow]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { status, hasPendingSave, saveNow, flushSave, scheduleSave, setStatus };
}

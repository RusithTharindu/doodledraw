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
  const getSceneRef = useRef(getScene);
  const designIdRef = useRef(designId);
  const nameRef = useRef(name);
  const savingRef = useRef(false);
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

  const saveNow = useCallback(async () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const currentScene = getSceneRef.current();

    if (!currentScene || savingRef.current) {
      return null;
    }

    savingRef.current = true;
    setStatus("saving");

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
      onSaved(saved);
      setStatus("saved");
      return saved;
    } catch (error) {
      console.error("Autosave failed", error);
      setStatus("error");
      return null;
    } finally {
      savingRef.current = false;
    }
  }, [onSaved]);

  const scheduleSave = useCallback(() => {
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

  return { status, saveNow, scheduleSave, setStatus };
}

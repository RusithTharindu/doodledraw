"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDesign } from "@/lib/design-storage";
import type { SavedDesign } from "@/types/design";

const ClientEditor = dynamic(
  async () => (await import("@/components/editor/ExcalidrawEditor")).ExcalidrawEditor,
  { ssr: false },
);

export default function DesignEditorPage() {
  const params = useParams<{ id: string }>();
  const [design, setDesign] = useState<SavedDesign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDesign() {
      const result = await getDesign(params.id);

      if (active) {
        setDesign(result ?? null);
        setLoading(false);
      }
    }

    void loadDesign();

    return () => {
      active = false;
    };
  }, [params.id]);

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-zinc-100 text-sm text-zinc-600">
        Loading drawing...
      </div>
    );
  }

  if (!design) {
    return (
      <main className="grid min-h-dvh place-items-center bg-zinc-100 p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-950">Drawing not found</h1>
          <p className="mt-2 text-zinc-600">It may have been deleted from this browser.</p>
          <Link
            className="mt-6 inline-flex h-10 items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white"
            href="/designs"
          >
            Back to Designs
          </Link>
        </div>
      </main>
    );
  }

  return <ClientEditor initialDesign={design} />;
}

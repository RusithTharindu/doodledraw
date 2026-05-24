"use client";

import dynamic from "next/dynamic";

const ClientEditor = dynamic(
  async () => (await import("@/components/editor/ExcalidrawEditor")).ExcalidrawEditor,
  { ssr: false },
);

export default function EditorPage() {
  return <ClientEditor />;
}

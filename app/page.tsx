import Link from "next/link";
import { FolderOpen, Images, PenLine } from "lucide-react";
import { Icon } from "@/components/Icon";

export default function Home() {
  return (
    <main className="min-h-dvh bg-[#f7f7f4] text-zinc-950">
      <section className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-between px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link
            aria-label="DoodleDraw home"
            className="inline-flex h-10 items-center rounded-md text-zinc-950 transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-300"
            href="/"
            title="DoodleDraw"
          >
            <Icon
              className="size-9"
              showIconTitle
              titleClassName="text-xl font-semibold tracking-tight"
            />
          </Link>
          <Link
            aria-label="Designs"
            className="inline-grid size-10 place-items-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-300"
            href="/designs"
            title="Designs"
          >
            <Images className="size-4" aria-hidden="true" />
          </Link>
        </header>
        <div className="grid gap-10 py-16 lg:grid-cols-[1fr_440px] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700">
              Local-first canvas
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl">
              DoodleDraw
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
              Sketch ideas, annotate diagrams, and keep every drawing in your browser
              with offline IndexedDB storage.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800"
                href="/editor"
              >
                <PenLine className="size-4" aria-hidden="true" />
                New Drawing
              </Link>
              <Link
                className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-5 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50"
                href="/designs"
              >
                <FolderOpen className="size-4" aria-hidden="true" />
                Open Designs
              </Link>
            </div>
          </div>
          <div className="min-h-[300px] rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="grid h-full min-h-[300px] grid-cols-3 grid-rows-3 gap-3">
              <div className="col-span-2 rounded-md border-2 border-dashed border-emerald-500 bg-emerald-50" />
              <div className="rounded-full border-2 border-zinc-900 bg-amber-100" />
              <div className="rounded-md border-2 border-zinc-900 bg-white" />
              <div className="col-span-2 rounded-md border-2 border-zinc-900 bg-sky-100" />
              <div className="col-span-3 flex items-end">
                <div className="h-1 w-full rounded-full bg-zinc-900" />
              </div>
            </div>
          </div>
        </div>
        <footer className="text-sm text-zinc-600">
          No backend. No sign-in. Your drawings stay on this device.
        </footer>
      </section>
    </main>
  );
}

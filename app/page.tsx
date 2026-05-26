import Link from "next/link";
import { FolderOpen, PenLine } from "lucide-react";
import { SystemArchitectureDoodle } from "@/components/home/SystemArchitectureDoodle";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100dvh-56px)] flex-col bg-[var(--dd-bg)] text-[var(--dd-text)]">
      <section className="flex flex-col items-center px-5 pb-11 pt-[72px] text-center sm:px-10">
        <div className="inline-flex items-center rounded-full border border-[var(--dd-accent-border)] bg-[var(--dd-accent-bg)] px-[13px] py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--dd-accent-text)]">
          Local-first canvas
        </div>
        <h1 className="dd-display mt-[26px] text-[clamp(48px,6vw,70px)] font-semibold leading-[1.07] text-[var(--dd-text)]">
          DoodleDraw
        </h1>
        <p className="mt-[18px] max-w-[400px] text-[17px] leading-[1.7] text-[var(--dd-text-muted)] [text-wrap:pretty]">
          Sketch ideas, annotate diagrams, and keep every drawing in your browser with
          no account and no cloud required.
        </p>
        <div className="mt-[34px] flex flex-wrap justify-center gap-2.5">
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--dd-radius-md)] bg-[var(--dd-text)] px-[22px] py-[11px] text-sm font-medium text-[var(--dd-bg)] transition hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
            href="/editor"
          >
            <PenLine className="size-4" aria-hidden="true" />
            New Drawing
          </Link>
          <Link
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--dd-radius-md)] border border-[var(--dd-border)] bg-[var(--dd-surface)] px-[22px] py-[11px] text-sm font-medium text-[var(--dd-text)] transition hover:border-[var(--dd-border-hover)] hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--dd-accent)]"
            href="/designs"
          >
            <FolderOpen className="size-4" aria-hidden="true" />
            Open Designs
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[960px] px-5 pb-[52px] sm:px-12">
        <div className="overflow-hidden rounded-[var(--dd-radius-xl)] border border-[var(--dd-border)] shadow-[0_2px_32px_rgba(0,0,0,0.06),0_1px_6px_rgba(0,0,0,0.04)]">
          <div className="theme-transition flex items-center gap-1.5 border-b border-[var(--dd-border)] bg-[var(--dd-bg-2)] px-4 py-[9px]">
            <span className="size-[9px] rounded-full bg-[#f05438]" />
            <span className="size-[9px] rounded-full bg-[#f5b731]" />
            <span className="size-[9px] rounded-full bg-[#27c93f]" />
            <span className="ml-2.5 text-xs tracking-[0.01em] text-[var(--dd-text-soft)]">
              system-architecture.doodle
            </span>
          </div>
          <SystemArchitectureDoodle />
        </div>
      </section>

      <section className="mx-auto w-full max-w-[960px] px-5 sm:px-12">
        <div className="mb-[52px] grid border-y border-[var(--dd-border)] sm:grid-cols-3">
          {[
            {
              title: "Offline first",
              desc: "All drawings live in IndexedDB, so the canvas keeps working locally.",
            },
            {
              title: "No account needed",
              desc: "Open the app and start sketching without signing in.",
            },
            {
              title: "Excalidraw inside",
              desc: "The familiar hand-drawn canvas, with thumbnail and export support.",
            },
          ].map((feature) => (
            <div
              className="border-[var(--dd-border)] px-0 py-[22px] sm:border-l sm:px-7 sm:first:border-l-0"
              key={feature.title}
            >
              <h2 className="text-sm font-medium text-[var(--dd-text)]">{feature.title}</h2>
              <p className="mt-1 text-[13px] leading-[1.6] text-[var(--dd-text-muted)]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex-1" />
      <footer className="theme-transition border-t border-[var(--dd-border)] px-5 py-[15px] text-center text-[13px] text-[var(--dd-text-soft)] sm:px-12">
        No backend. No sign-in. Your drawings stay on this device
      </footer>
    </div>
  );
}

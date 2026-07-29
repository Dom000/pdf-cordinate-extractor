import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import Crosshair from "@/components/Crosshair";

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-20 md:pt-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:gap-8">
        <div className="max-w-xl text-center md:text-left">
          <h1 className="animate-bounce-in font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl md:text-7xl">
            X marks
            <br />
            the spot.
          </h1>
          <p className="mt-6 text-lg text-ink/70 sm:text-xl">
            Point at anything on a PDF and get its exact coordinates —
            in points, inches, millimetres, or centimetres. No guessing,
            no rulers.
          </p>
          <div className="mt-9 flex flex-col items-center gap-4 sm:flex-row md:justify-start">
            <Link
              href="/app"
              className="group inline-flex items-center gap-2 rounded-2xl border-4 border-ink bg-coral px-7 py-3.5 font-display text-lg font-semibold text-ink shadow-hard transition-transform hover:-translate-y-0.5 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
            >
              Get started
              <ArrowRight
                size={20}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 font-medium text-ink/70 underline decoration-ink/30 decoration-2 underline-offset-4 hover:text-ink"
            >
              See how it works
              <ArrowDown size={16} className="animate-hop" />
            </a>
          </div>
        </div>

        <div className="relative flex w-full max-w-sm items-center justify-center md:max-w-md">
          <div
            aria-hidden="true"
            className="absolute h-64 w-64 rounded-full bg-teal/20 blur-2xl md:h-80 md:w-80"
          />
          <div className="relative w-full -rotate-2 rounded-3xl border-4 border-ink bg-white p-4 shadow-hard-lg">
            <div className="flex items-center gap-1.5 border-b-2 border-ink/10 pb-3">
              <span className="h-3 w-3 rounded-full bg-coral" />
              <span className="h-3 w-3 rounded-full bg-amber" />
              <span className="h-3 w-3 rounded-full bg-teal" />
              <span className="ml-auto font-data text-xs text-ink/40">
                page.pdf
              </span>
            </div>
            <div className="relative mt-4 aspect-[3/4] rounded-xl bg-paper">
              <div className="absolute inset-4 space-y-2">
                <div className="h-2 w-2/3 rounded bg-ink/10" />
                <div className="h-2 w-full rounded bg-ink/10" />
                <div className="h-2 w-5/6 rounded bg-ink/10" />
                <div className="h-2 w-1/2 rounded bg-ink/10" />
              </div>
              <Crosshair className="absolute left-[38%] top-[46%] h-16 w-16 -translate-x-1/2 -translate-y-1/2 animate-wobble text-coral drop-shadow" />
              <div className="absolute left-[38%] top-[46%] translate-x-3 translate-y-3 rounded-md bg-ink px-2 py-1 font-data text-[11px] text-white shadow-hard-sm">
                X: 214 pt, Y: 388 pt
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

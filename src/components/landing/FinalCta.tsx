import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import Crosshair from "@/components/Crosshair";

export default function FinalCta() {
  return (
    <section className="px-6 pb-28 pt-4">
      <Reveal className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl border-4 border-ink bg-violet px-8 py-16 text-center shadow-hard-lg">
          <Crosshair className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 text-white/20" />
          <Crosshair className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 text-white/20" />
          <h2 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Ready to find your coordinates?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            It&apos;s free, runs entirely in your browser, and takes about ten
            seconds to open your first PDF.
          </p>
          <Link
            href="/app"
            className="group mt-9 inline-flex items-center gap-2 rounded-2xl border-4 border-ink bg-white px-7 py-3.5 font-display text-lg font-semibold text-ink shadow-hard transition-transform hover:-translate-y-0.5 active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            Open the tool
            <ArrowRight
              size={20}
              strokeWidth={3}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}

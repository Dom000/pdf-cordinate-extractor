import { Upload, MousePointerClick, MousePointerSquareDashed } from "lucide-react";
import Reveal from "@/components/Reveal";

const steps = [
  {
    icon: Upload,
    accent: "bg-coral",
    rotate: "-rotate-2",
    title: "Drop your PDF",
    body: "Drag a file in, or click to choose one. It opens right in the browser — nothing gets uploaded anywhere.",
  },
  {
    icon: MousePointerClick,
    accent: "bg-amber",
    rotate: "rotate-1",
    title: "Hover to find it",
    body: "Move your cursor across the page and watch the live readout and magnified lens track every pixel.",
  },
  {
    icon: MousePointerSquareDashed,
    accent: "bg-teal",
    rotate: "-rotate-1",
    title: "Click, drag, done",
    body: "Click to drop a point, drag to measure a rectangle. Export the whole list as JSON or CSV when you're ready.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            Three steps. That&apos;s it.
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 120}>
              <div
                className={`h-full rounded-3xl border-4 border-ink bg-white p-6 shadow-hard ${step.rotate}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-full border-4 border-ink font-display text-lg font-semibold text-ink ${step.accent}`}
                  >
                    {i + 1}
                  </span>
                  <step.icon size={26} strokeWidth={2.5} className="text-ink" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-ink/70">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

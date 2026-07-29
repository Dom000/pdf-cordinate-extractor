import { ZoomIn, ArrowUpDown, Table2, Download } from "lucide-react";
import Reveal from "@/components/Reveal";

const features = [
  {
    icon: ZoomIn,
    title: "Real zoom",
    body: "Scroll or use the +/- controls to zoom the actual page, not a blurry screenshot.",
  },
  {
    icon: ArrowUpDown,
    title: "Either origin",
    body: "Switch between top-left screen coordinates and bottom-left, PDF-native ones.",
  },
  {
    icon: Table2,
    title: "A running list",
    body: "Every point and box you capture stays in a table until you're ready to leave.",
  },
  {
    icon: Download,
    title: "Export in a click",
    body: "Send your coordinates out as JSON or CSV, ready for a pdf-lib script.",
  },
];

export default function Toolkit() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-4xl font-semibold text-ink sm:text-5xl">
            Everything the readout needs
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 90}>
              <div className="flex h-full gap-4 rounded-2xl border-4 border-ink bg-white p-6 shadow-hard-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-ink bg-violet/20">
                  <feature.icon size={22} strokeWidth={2.5} className="text-violet" />
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold text-ink">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-ink/70">{feature.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

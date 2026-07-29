"use client";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useState, useEffect, useRef, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import CoordinateDisplay from "./CoordinateDisplay";
import SavedPointsPanel from "./SavedPointsPanel";
import { DocumentCallback, PageCallback } from "react-pdf/src/shared/types.js";
import { getPdfDimentions } from "@/lib/utils";
import DimensionSeperator from "./dimension-seperator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DTData, OriginMode, SavedEntry } from "../../types";

interface PDFViewerProps {
  file: File;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 4;
const DRAG_THRESHOLD_PX = 4;

type ScreenPoint = { x: number; y: number };

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfdata, setPdfData] = useState<DTData>();
  const [pdfYinfo, setPdfYinfo] = useState("");
  const [pdfXinfo, setPdfXinfo] = useState("");

  // Page size in PDF points (unscaled), independent of the zoom level.
  const [basePageSize, setBasePageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  // Rendered page size in CSS pixels at the *current* zoom level, used to
  // align the magnifier lens with the live canvas snapshot below.
  const [renderedPageSize, setRenderedPageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [scale, setScale] = useState(1);
  const [origin, setOrigin] = useState<OriginMode>("bottom-left");

  const [hoverRaw, setHoverRaw] = useState<ScreenPoint | null>(null);
  const [dragStart, setDragStart] = useState<ScreenPoint | null>(null);
  const [dragCurrent, setDragCurrent] = useState<ScreenPoint | null>(null);

  const [entries, setEntries] = useState<SavedEntry[]>([]);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  // Wheel-to-zoom over the PDF. Needs a non-passive listener since React's
  // synthetic onWheel can't reliably preventDefault (page scroll) otherwise.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setScale((prev) => {
        const next = prev * (1 - e.deltaY * 0.001);
        return Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
      });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const onDocumentLoadSuccess = async (document: DocumentCallback) => {
    setNumPages(document.numPages);
    const { data } = await getPdfDimentions(file);
    setPdfData(data);
    setPdfXinfo(`${data.centimeters.x} cm`);
    setPdfYinfo(`${data.centimeters.y} cm`);
  };

  // Fires on every render (initial load, page change, zoom change). Grabs a
  // fresh snapshot directly off the actual rendered canvas via toDataURL(),
  // so the magnifier is always showing exactly what's currently on screen
  // instead of a stale, fixed-delay capture.
  const onPageRenderSuccess = (page: PageCallback) => {
    setBasePageSize({ width: page.originalWidth, height: page.originalHeight });
    setRenderedPageSize({ width: page.width, height: page.height });

    const canvas = document.querySelector<HTMLCanvasElement>(
      "#pdf-container-node canvas"
    );
    if (canvas) {
      setPreviewUrl(canvas.toDataURL());
    }
  };

  // Converts a screen-space point (relative to the rendered, possibly
  // zoomed, page) into canonical PDF points with a bottom-left origin.
  const toCanonical = useCallback(
    (raw: ScreenPoint) => {
      const baseX = raw.x / scale;
      const baseY = raw.y / scale;
      return { x: baseX, y: (basePageSize?.height ?? 0) - baseY };
    },
    [scale, basePageSize]
  );

  const addPointEntry = useCallback(
    (raw: ScreenPoint) => {
      const { x, y } = toCanonical(raw);
      setEntries((prev) => [
        ...prev,
        { id: crypto.randomUUID(), kind: "point", page: pageNumber, x, y },
      ]);
    },
    [toCanonical, pageNumber]
  );

  const addRectEntry = useCallback(
    (a: ScreenPoint, b: ScreenPoint) => {
      const pa = toCanonical(a);
      const pb = toCanonical(b);
      setEntries((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          kind: "rect",
          page: pageNumber,
          x: Math.min(pa.x, pb.x),
          y: Math.min(pa.y, pb.y),
          width: Math.abs(pb.x - pa.x),
          height: Math.abs(pb.y - pa.y),
        },
      ]);
    },
    [toCanonical, pageNumber]
  );

  const relativePoint = (
    e: { clientX: number; clientY: number },
    rect: DOMRect
  ): ScreenPoint => ({ x: e.clientX - rect.left, y: e.clientY - rect.top });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const raw = relativePoint(e, rect);
    setDragStart(raw);
    setDragCurrent(raw);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const raw = relativePoint(e, rect);
    setHoverRaw(raw);
    if (dragStart) setDragCurrent(raw);
  };

  // A window-level listener so a drag still ends correctly even if the
  // cursor is released outside the PDF container.
  useEffect(() => {
    if (!dragStart) return;

    const finishDrag = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) {
        setDragStart(null);
        setDragCurrent(null);
        return;
      }
      const rect = container.getBoundingClientRect();
      const end = relativePoint(e, rect);
      const dx = Math.abs(end.x - dragStart.x);
      const dy = Math.abs(end.y - dragStart.y);

      if (dx < DRAG_THRESHOLD_PX && dy < DRAG_THRESHOLD_PX) {
        addPointEntry(dragStart);
      } else {
        addRectEntry(dragStart, end);
      }
      setDragStart(null);
      setDragCurrent(null);
    };

    window.addEventListener("mouseup", finishDrag);
    return () => window.removeEventListener("mouseup", finishDrag);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStart, addPointEntry, addRectEntry]);

  const handleChangeUnit = (e: string) => {
    if (e === "centimeters") {
      setPdfXinfo(`${pdfdata?.centimeters.x} cm`);
      setPdfYinfo(`${pdfdata?.centimeters.y} cm`);
    }
    if (e === "inches") {
      setPdfXinfo(`${pdfdata?.inches.x} in`);
      setPdfYinfo(`${pdfdata?.inches.y} in`);
    }
    if (e === "points") {
      setPdfXinfo(`${pdfdata?.points.x} pt`);
      setPdfYinfo(`${pdfdata?.points.y} pt`);
    }
    if (e === "millimeters") {
      setPdfXinfo(`${pdfdata?.millimeters.x} mm`);
      setPdfYinfo(`${pdfdata?.millimeters.y} mm`);
    }
  };

  const hoverCanonical = hoverRaw ? toCanonical(hoverRaw) : null;
  const hoverDisplayY =
    hoverCanonical && basePageSize
      ? origin === "bottom-left"
        ? hoverCanonical.y
        : basePageSize.height - hoverCanonical.y
      : 0;

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border-4 border-ink bg-white p-3 shadow-hard-sm">
        <Select onValueChange={handleChangeUnit}>
          <SelectTrigger className="w-[180px] rounded-xl border-2 border-ink font-data text-sm">
            <SelectValue
              placeholder="Centimeter (cm)"
              defaultValue={"centimeters"}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="centimeters">Centimeter (cm)</SelectItem>
            <SelectItem value="inches">Inch (in)</SelectItem>
            <SelectItem value="millimeters">Millimeter (mm)</SelectItem>
            <SelectItem value="points">Point (pt)</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5 rounded-xl border-2 border-ink px-1.5 py-1">
          <button
            onClick={() =>
              setScale((s) => Math.max(MIN_SCALE, +(s - 0.25).toFixed(2)))
            }
            className="h-7 w-7 rounded-lg font-display font-semibold text-ink hover:bg-amber/40"
            aria-label="Zoom out"
          >
            −
          </button>
          <span className="w-12 text-center font-data text-sm">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() =>
              setScale((s) => Math.min(MAX_SCALE, +(s + 0.25).toFixed(2)))
            }
            className="h-7 w-7 rounded-lg font-display font-semibold text-ink hover:bg-amber/40"
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => setScale(1)}
            className="ml-1 rounded-lg px-2 py-1 text-xs font-medium text-ink/70 hover:bg-amber/40 hover:text-ink"
          >
            Reset
          </button>
        </div>

        <button
          onClick={() =>
            setOrigin((o) => (o === "bottom-left" ? "top-left" : "bottom-left"))
          }
          className="rounded-xl border-2 border-ink bg-violet/15 px-3 py-1.5 text-sm font-medium text-ink hover:bg-violet/25"
        >
          Origin: {origin === "bottom-left" ? "Bottom-left (PDF)" : "Top-left"}
        </button>
      </div>

      <div className="w-full cursor-none flex flex-col justify-center items-center mt-16">
        <div
          className="custom-cursor"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        ></div>
        <div className="flex  relative w-fit h-fit  ">
          {/* Y axis */}
          <DimensionSeperator
            orientation="vertical"
            seperatorClassName="w-[850px]"
            topText={pdfdata?.documentType}
            bottomText={pdfYinfo}
            className="   -left-20 -top-8 absolute h-full  w-20"
          />
          <div>
            {/* X axise */}
            <DimensionSeperator
              topText={pdfdata?.documentType}
              bottomText={pdfXinfo}
              className="absolute h-10 -mt-16 w-full"
            />
            <div
              id="pdf-container-node"
              className="w-fit rounded-2xl border-4 border-ink bg-white p-3 shadow-hard"
            >
              <Document
                className="w-fit"
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <div
                  ref={containerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setHoverRaw(null)}
                  className="relative caret-transparent  inline-block"
                >
                  <Page
                    pageNumber={pageNumber}
                    scale={scale}
                    onRenderSuccess={onPageRenderSuccess}
                  />
                  {hoverRaw && hoverCanonical && renderedPageSize && !dragStart && (
                    <CoordinateDisplay
                      screenX={hoverRaw.x}
                      screenY={hoverRaw.y}
                      x={hoverCanonical.x}
                      y={hoverDisplayY}
                      previewUrl={previewUrl}
                      pageWidth={renderedPageSize.width}
                      pageHeight={renderedPageSize.height}
                    />
                  )}
                  {dragStart && dragCurrent && (
                    <div
                      className="pointer-events-none absolute border-4 border-teal bg-teal/10"
                      style={{
                        left: Math.min(dragStart.x, dragCurrent.x),
                        top: Math.min(dragStart.y, dragCurrent.y),
                        width: Math.abs(dragCurrent.x - dragStart.x),
                        height: Math.abs(dragCurrent.y - dragStart.y),
                      }}
                    >
                      <span className="absolute -top-7 left-0 whitespace-nowrap rounded-md border-2 border-ink bg-teal px-1.5 py-0.5 font-data text-xs text-ink">
                        {Math.round(
                          Math.abs(dragCurrent.x - dragStart.x) / scale
                        )}{" "}
                        ×{" "}
                        {Math.round(
                          Math.abs(dragCurrent.y - dragStart.y) / scale
                        )}{" "}
                        pt
                      </span>
                    </div>
                  )}
                </div>
              </Document>
            </div>
          </div>
        </div>
        <p className="mt-5 font-data text-sm text-ink/60">
          Page {pageNumber} of {numPages}
        </p>
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="rounded-xl border-4 border-ink bg-white px-4 py-2 font-medium text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
            }
            disabled={pageNumber >= (numPages || 1)}
            className="rounded-xl border-4 border-ink bg-coral px-4 py-2 font-medium text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none"
          >
            Next
          </button>
        </div>

        <SavedPointsPanel
          entries={entries}
          onRemove={(id) =>
            setEntries((prev) => prev.filter((entry) => entry.id !== id))
          }
          onClear={() => setEntries([])}
        />
      </div>
    </>
  );
}

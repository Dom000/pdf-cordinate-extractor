"use client";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { useState, useEffect, type MouseEvent, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import CoordinateDisplay from "./CoordinateDisplay";
import { DocumentCallback, PageCallback } from "react-pdf/src/shared/types.js";
import { getPdfDimentions } from "@/lib/utils";
import { Separator } from "./ui/separator";
import DimensionSeperator from "./dimension-seperator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DTData } from "../../types";

interface PDFViewerProps {
  file: File;
}

export default function PDFViewer({ file }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const pdfRef = useRef(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfdata, setPdfData] = useState<DTData>();
  const [pdfYinfo, setPdfYinfo] = useState("");
  const [pdfXinfo, setPdfXinfo] = useState("");
  // Actual rendered size of the PDF page canvas, in CSS pixels. Used (not the
  // physical point/mm size) for anything involving screen coordinates, since
  // the two are different unit systems.
  const [pageSize, setPageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const [previewUrl, setpreviewUrl] = useState("");
  const [coordinates, setCoordinates] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      "pdfjs-dist/build/pdf.worker.min.mjs",
      import.meta.url
    ).toString();

    const moveCursor = (e: any) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", moveCursor);
    return () => document.removeEventListener("mousemove", moveCursor);
  }, []);

  const onDocumentLoadSuccess = async (document: DocumentCallback) => {
    setNumPages(document.numPages);
    const { data } = await getPdfDimentions(file);
    setPdfData(data);
    setPdfXinfo(`${data.centimeters.x} cm`);
    setPdfYinfo(`${data.centimeters.y} cm`);
  };

  // Captures the page's rendered pixel size and a fresh snapshot of the
  // canvas for the magnifier as soon as rendering finishes (and again on
  // every page change), so the magnifier is always in sync with what's on
  // screen instead of a one-off snapshot taken on a fixed delay.
  const onPageRenderSuccess = (page: PageCallback) => {
    setPageSize({ width: page.width, height: page.height });
    const canvas = document.querySelector<HTMLCanvasElement>(
      "#pdf-container-node canvas"
    );
    if (canvas) {
      setpreviewUrl(canvas.toDataURL());
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    setCoordinates({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoordinates({ x, y });

    // PDFs use a bottom-left origin, so flip the y-axis using the actual
    // rendered page height.
    const flippedY = (pageSize?.height ?? 0) - y;
    const coordsText = `X: ${Math.round(x)}, Y: ${Math.round(flippedY)}`;

    navigator.clipboard
      .writeText(coordsText)
      .then(() => {
        alert(`Copied: ${coordsText}`);
      })
      .catch((err) => {
        console.error("Failed to copy!", err);
      });
  };

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

  return (
    <>
      <Select onValueChange={handleChangeUnit}>
        <SelectTrigger className="w-[180px]">
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
      <div className="w-full cursor-none flex flex-col justify-center items-center mt-40">
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
            <div id="pdf-container-node" className="w-fit">
              <Document
                ref={pdfRef}
                className="border  border-black w-fit "
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <div
                  onClick={handleClick}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => setCoordinates(null)}
                  className="relative caret-transparent  inline-block"
                >
                  <Page
                    pageNumber={pageNumber}
                    onRenderSuccess={onPageRenderSuccess}
                  />
                  {coordinates && pageSize && (
                    <CoordinateDisplay
                      pageWidth={pageSize.width}
                      pageHeight={pageSize.height}
                      previewUrl={previewUrl}
                      coordinates={coordinates}
                    />
                  )}
                </div>
              </Document>
            </div>
          </div>
        </div>
        <p className="mt-4">
          Page {pageNumber} of {numPages}
        </p>
        <div className="mt-4 space-x-4">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages || 1))
            }
            disabled={pageNumber >= (numPages || 1)}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

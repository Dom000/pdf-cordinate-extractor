import { clsx, type ClassValue } from "clsx";
import { PDFDocument } from "pdf-lib";
import { twMerge } from "tailwind-merge";
import { DocumentType, DT, DTData } from "../../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getPdfDimentions(file: File): Promise<DT> {
  const arrayBuffer = await file.arrayBuffer();
  const existingPdfDoc = await PDFDocument.load(arrayBuffer);

  const [copiedPage] = await existingPdfDoc.copyPages(existingPdfDoc, [0]);

  const { width, height } = copiedPage.getSize();

  const pdfData: DT = {
    width,
    height,
    data: buildDimensionData(width, height),
  };

  return pdfData;
}

const POINTS_PER_INCH = 72;
const MM_PER_INCH = 25.4;

const round = (value: number, decimals = 1) => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

// Standard ISO 216 "A" sizes in PDF points, as (short edge, long edge) so
// detection works regardless of portrait/landscape orientation.
const A_SERIES_POINTS: { type: DocumentType; short: number; long: number }[] = [
  { type: DocumentType.A10, short: 74, long: 105 },
  { type: DocumentType.A9, short: 105, long: 147 },
  { type: DocumentType.A8, short: 147, long: 210 },
  { type: DocumentType.A7, short: 210, long: 298 },
  { type: DocumentType.A6, short: 298, long: 420 },
  { type: DocumentType.A5, short: 420, long: 595 },
  { type: DocumentType.A4, short: 595, long: 842 },
  { type: DocumentType.A3, short: 842, long: 1190 },
  { type: DocumentType.A2, short: 1190, long: 1684 },
  { type: DocumentType.A1, short: 1684, long: 2384 },
  { type: DocumentType.A0, short: 2384, long: 3370 },
];

// Small tolerance to absorb rounding differences in real-world PDF page sizes.
const SIZE_TOLERANCE_POINTS = 2;

const matchDocumentType = (width: number, height: number): DocumentType => {
  const shortEdge = Math.min(width, height);
  const longEdge = Math.max(width, height);

  const match = A_SERIES_POINTS.find(
    (size) =>
      shortEdge <= size.short + SIZE_TOLERANCE_POINTS &&
      longEdge <= size.long + SIZE_TOLERANCE_POINTS
  );

  return match ? match.type : DocumentType.Custom;
};

const buildDimensionData = (width: number, height: number): DTData => {
  const millimeters = {
    x: round(width * (MM_PER_INCH / POINTS_PER_INCH)),
    y: round(height * (MM_PER_INCH / POINTS_PER_INCH)),
  };

  return {
    documentType: matchDocumentType(width, height),
    points: { x: Math.round(width), y: Math.round(height) },
    inches: {
      x: round(width / POINTS_PER_INCH),
      y: round(height / POINTS_PER_INCH),
    },
    millimeters,
    centimeters: {
      x: round(millimeters.x / 10),
      y: round(millimeters.y / 10),
    },
  };
};

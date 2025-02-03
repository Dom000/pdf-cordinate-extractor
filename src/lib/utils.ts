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

  // const PDF type e:g A4, A5, A6, etc.

  /**
   * 
  Size	Millimeters (mm)	Inches (in)	Points (pt)
  A0	| 841 × 1189 |	33.1 × 46.8	 | 2384 × 3370
  A1	594 × 841	23.4 × 33.1	1684 × 2384
  A2	420 × 594	16.5 × 23.4	1191 × 1684
  A3	297 × 420	11.7 × 16.5	842 × 1190
  A4	210 × 297	8.3 × 11.7	595 × 842
  A5	148 × 210	5.8 × 8.3	420 × 595
  A6	105 × 148	4.1 × 5.8	298 × 420
  A7	74 × 105	2.9 × 4.1	210 × 298
  A8	52 × 74	2.0 × 2.9	147 × 210
  A9	37 × 52	1.5 × 2.0	105 × 147
  A10	26 × 37	1.0 × 1.5	74 × 105
   */
  const pdfData: DT = {
    width,
    height,
    data: matchDocumentType(width, height),
  };

  return pdfData;
}

const matchDocumentType = (width: number, height: number): DTData => {
  if (width <= 74 && height <= 105)
    return {
      documentType: DocumentType.A10,
      points: { x: 74, y: 105 },
      inches: {
        x: 1.0,
        y: 1.5,
      },
      millimeters: {
        x: 26,
        y: 37,
      },
      centimeters: {
        x: 2.6,
        y: 3.7,
      },
    };
  if (width <= 105 && height <= 147)
    return {
      documentType: DocumentType.A9,
      points: { x: 105, y: 147 },
      inches: {
        x: 1.5,
        y: 2.0,
      },
      millimeters: {
        x: 37,
        y: 52,
      },
      centimeters: {
        x: 3.7,
        y: 5.2,
      },
    };
  if (width <= 147 && height <= 210)
    return {
      documentType: DocumentType.A8,
      points: { x: 147, y: 210 },
      inches: {
        x: 2.0,
        y: 2.9,
      },
      millimeters: {
        x: 52,
        y: 74,
      },
      centimeters: {
        x: 5.2,
        y: 7.4,
      },
    };
  if (width <= 210 && height <= 297)
    return {
      documentType: DocumentType.A7,
      points: { x: 210, y: 297 },
      inches: {
        x: 2.9,
        y: 4.1,
      },
      millimeters: {
        x: 74,
        y: 105,
      },
      centimeters: {
        x: 7.4,
        y: 10.5,
      },
    };
  if (width <= 297 && height <= 420)
    return {
      documentType: DocumentType.A6,
      points: { x: 297, y: 420 },
      inches: {
        x: 4.1,
        y: 5.8,
      },
      millimeters: {
        x: 105,
        y: 148,
      },
      centimeters: {
        x: 10.5,
        y: 14.8,
      },
    };
  if (width <= 420 && height <= 594)
    return {
      documentType: DocumentType.A5,
      points: { x: 420, y: 594 },
      inches: {
        x: 5.8,
        y: 8.3,
      },
      millimeters: {
        x: 148,
        y: 210,
      },
      centimeters: {
        x: 14.8,
        y: 20.3,
      },
    };
  if (width <= 596 && height <= 843)
    return {
      documentType: DocumentType.A4,
      points: { x: Math.round(width), y: Math.round(height) },
      inches: {
        x: 8.3,
        y: 11.7,
      },
      millimeters: {
        x: 210,
        y: 297,
      },
      centimeters: {
        x: 20.3,
        y: 29.7,
      },
    };
  if (width <= 841 && height <= 1189)
    return {
      documentType: DocumentType.A3,
      points: { x: 841, y: 1189 },
      inches: {
        x: 11.7,
        y: 16.5,
      },
      millimeters: {
        x: 297,
        y: 420,
      },
      centimeters: {
        x: 29.7,
        y: 42.0,
      },
    };
  if (width <= 1189 && height <= 1684)
    return {
      documentType: DocumentType.A2,
      points: { x: 1189, y: 1684 },
      inches: {
        x: 16.5,
        y: 23.4,
      },
      millimeters: {
        x: 420,
        y: 594,
      },
      centimeters: {
        x: 42.0,
        y: 59.4,
      },
    };
  if (width <= 1684 && height <= 2384)
    return {
      documentType: DocumentType.A1,
      points: { x: 1684, y: 2384 },
      inches: {
        x: 23.4,
        y: 33.1,
      },
      millimeters: {
        x: 594,
        y: 841,
      },
      centimeters: {
        x: 59.4,
        y: 84.1,
      },
    };
  if (width <= 2384 && height <= 3370)
    return {
      documentType: DocumentType.A0,
      points: { x: 2384, y: 3370 },
      inches: {
        x: 33.1,
        y: 46.8,
      },
      millimeters: {
        x: 841,
        y: 1189,
      },
      centimeters: {
        x: 84.1,
        y: 118.9,
      },
    };
  return {} as DTData;
};

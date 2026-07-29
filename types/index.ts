export enum DocumentType {
  A0 = "A0",
  A1 = "A1",
  A2 = "A2",
  A3 = "A3",
  A4 = "A4",
  A5 = "A5",
  A6 = "A6",
  A7 = "A7",
  A8 = "A8",
  A9 = "A9",
  A10 = "A10",
  Custom = "Custom",
}

export type DT = {
  width: number;
  height: number;
  data: {
    documentType: DocumentType;
    points: {
      x: number;
      y: number;
    };
    inches: {
      x: number;
      y: number;
    };
    millimeters: {
      x: number;
      y: number;
    };
    centimeters: {
      x: number;
      y: number;
    };
  };
};


export type DTData = DT["data"];

export type OriginMode = "top-left" | "bottom-left";

// Points/rects are stored in canonical bottom-left-origin PDF points
// regardless of the display OriginMode, so exports stay meaningful
// (matches the (x, y, width, height) convention pdf-lib itself uses).
export type SavedPoint = {
  id: string;
  kind: "point";
  page: number;
  x: number;
  y: number;
};

export type SavedRect = {
  id: string;
  kind: "rect";
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type SavedEntry = SavedPoint | SavedRect;
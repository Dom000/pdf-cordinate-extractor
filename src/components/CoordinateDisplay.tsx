interface CoordinateDisplayProps {
  screenX: number;
  screenY: number;
  x: number;
  y: number;
  previewUrl: string;
  pageWidth: number;
  pageHeight: number;
}

const MAGNIFIER_SIZE = 150;
const MAGNIFIER_ZOOM = 2.5;

export default function CoordinateDisplay({
  screenX,
  screenY,
  x,
  y,
  previewUrl,
  pageWidth,
  pageHeight,
}: CoordinateDisplayProps) {
  // previewUrl is a snapshot of the actual rendered PDF canvas at the
  // current zoom level, so screenX/screenY (also current-zoom screen
  // space) map onto it directly with a single, consistent scale factor.
  const backgroundX = screenX * MAGNIFIER_ZOOM - MAGNIFIER_SIZE / 2;
  const backgroundY = screenY * MAGNIFIER_ZOOM - MAGNIFIER_SIZE / 2;

  return (
    <>
      <div
        className="pointer-events-none absolute overflow-hidden rounded-full border-4 border-ink bg-paper shadow-hard-sm"
        style={{
          left: screenX + 16,
          top: screenY + 16,
          width: MAGNIFIER_SIZE,
          height: MAGNIFIER_SIZE,
          backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
          backgroundRepeat: "no-repeat",
          backgroundSize: `${pageWidth * MAGNIFIER_ZOOM}px ${
            pageHeight * MAGNIFIER_ZOOM
          }px`,
          backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
        }}
      >
        {/* crosshair marking the exact cursor position within the lens */}
        <div className="absolute left-1/2 top-1/2 h-4 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral" />
        <div className="absolute left-1/2 top-1/2 h-0.5 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral" />
      </div>
      <div
        className="pointer-events-none absolute whitespace-nowrap rounded-lg border-2 border-ink bg-ink px-2 py-1 font-data text-xs text-white"
        style={{ left: screenX + 16, top: screenY + 16 + MAGNIFIER_SIZE + 6 }}
      >
        X: {Math.round(x)} pt, Y: {Math.round(y)} pt
      </div>
    </>
  );
}

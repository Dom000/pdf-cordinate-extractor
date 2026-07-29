interface CoordinateDisplayProps {
  coordinates: { x: number; y: number };
  previewUrl: string;
  pageWidth: number;
  pageHeight: number;
}

export default function CoordinateDisplay({
  coordinates,
  previewUrl,
  pageWidth,
  pageHeight,
}: CoordinateDisplayProps) {
  const magnifierSize = 150;
  const zoomScale = 2.5;

  // Position the zoomed-in point under the cursor at the center of the lens.
  const backgroundX = coordinates.x * zoomScale - magnifierSize / 2;
  const backgroundY = coordinates.y * zoomScale - magnifierSize / 2;

  const magnifierStyle: React.CSSProperties = {
    pointerEvents: "none",
    position: "absolute",
    left: coordinates.x + 16,
    top: coordinates.y + 16,
    width: magnifierSize,
    height: magnifierSize,
    border: "2px solid #333",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
    backgroundImage: previewUrl ? `url(${previewUrl})` : undefined,
    backgroundRepeat: "no-repeat",
    backgroundSize: `${pageWidth * zoomScale}px ${pageHeight * zoomScale}px`,
    backgroundPosition: `-${backgroundX}px -${backgroundY}px`,
  };

  return (
    <div style={magnifierStyle}>
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
        X: {Math.round(coordinates.x)}, Y: {Math.round(pageHeight - coordinates.y)}
      </div>
    </div>
  );
}

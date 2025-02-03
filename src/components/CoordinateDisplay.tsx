interface CoordinateDisplayProps {
  coordinates: { x: number; y: number };
  previewUrl: string;
  pdfHeight: number;
}

export default function CoordinateDisplay({
  coordinates,
  previewUrl,
  pdfHeight,
}: CoordinateDisplayProps) {
  const containerWidth = 600;
  const containerHeight = 800;
  const magnifierSize = 150;
  const zoomScale = 1.7;

  const magnifierStyle: React.CSSProperties = {
    pointerEvents: "none",
    position: "absolute",
    // Position the lens near the mouse; adjust offset as needed
    left: coordinates.x + 5,
    top: coordinates.y + 5,
    width: magnifierSize,
    height: magnifierSize,
    border: "2px solid #333",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
  };

  // The inner content of the magnifier
  // We use a div whose background is the same as the container’s, but scaled up.
  const magnifiedInnerStyle = {
    width: containerWidth,
    height: containerHeight,
    backgroundImage: `url(${previewUrl})`,
    backgroundSize: `${containerWidth * zoomScale}px ${
      containerHeight * zoomScale
    }px`,
    // Set the transform origin to the mouse position scaled up accordingly.
    transform: `scale(${zoomScale})`,
    transformOrigin: `${coordinates.x + 150}px ${coordinates.y + 100}px`,
  };

  return (
    <div style={magnifierStyle}>
      <div style={magnifiedInnerStyle}></div>{" "}
      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
        X: {Math.round(coordinates.x)}, Y:
        {Math.round(pdfHeight - coordinates.y)}
      </div>
    </div>
    // <div
    //   className="absolute bg-transparent border border-gray-300 shadow-lg overflow-hidden"
    //   style={{
    //     width: size,
    //     height: size,
    //     left: coordinates.x + 20,
    //     top: coordinates.y + 20,
    //   }}
    // >
    //   <div
    //     className="relative"
    //     style={{
    //       width: size * scale,
    //       height: size * scale,
    //       transform: `scale(${1 / scale})`,
    //       transformOrigin: "top left",
    //     }}
    //   >
    //     <div
    //       className="absolute border border-red-500"
    //       style={{
    //         width: size / scale,
    //         height: size / scale,
    //         left: coordinates.x * scale - size / 2,
    //         top: coordinates.y * scale - size / 2,
    //       }}
    //     />
    //   </div>
    //   <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
    //     X: {Math.round(coordinates.x)}, Y: {Math.round(coordinates.y + scaleY)}
    //   </div>
    // </div>
  );
}

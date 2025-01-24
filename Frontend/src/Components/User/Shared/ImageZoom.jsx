import React from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

function ImageZoom({ selectedZoomImage, setSelectedZoomImage }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}>
      {/* Close Button */}
      <button
        onClick={() => setSelectedZoomImage("")}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          border: "none",
          padding: "10px",
          borderRadius: "5px",
          cursor: "pointer",
          fontSize: "16px",
          zIndex: 1001,
        }}>
        Close
      </button>

      {/* Zoomable and Scrollable Image */}
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
        minScale={0.5}
        maxScale={4}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}>
        {({ state, zoomIn, zoomOut, resetTransform }) => (
          <>
            {/* Zoom Controls */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: "10px",
                zIndex: 1001,
              }}>
              <button onClick={() => zoomIn()} style={buttonStyle}>
                Zoom In
              </button>
              <button onClick={() => zoomOut()} style={buttonStyle}>
                Zoom Out
              </button>
              <button onClick={() => resetTransform()} style={buttonStyle}>
                Reset
              </button>
            </div>

            {/* Zoomable Image */}
            <TransformComponent>
              <div
                style={{
                  maxHeight: "90vh",
                  maxWidth: "90vw",
                  overflow: state?.scale > 1 ? "auto" : "hidden", // Enable scroll on zoom
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "10px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}>
                <img
                  src={selectedZoomImage || "/placeholder.svg"}
                  alt="Zoomed"
                  style={{
                    width: state?.scale > 1 ? `${state.scale * 100}%` : "100%", // Adjust width based on zoom
                    height: state?.scale > 1 ? `${state.scale * 100}%` : "100%", // Adjust height based on zoom
                    objectFit: "contain",
                    borderRadius: "10px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.5)",
                  }}
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

const buttonStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
};

export default ImageZoom;

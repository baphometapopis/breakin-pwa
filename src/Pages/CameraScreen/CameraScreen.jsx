import React, { useState, useEffect, useRef } from "react";
import Webcam from "webcam-easy"; // Import Webcam from webcam-easy

const CameraScreen = () => {
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const webcamInstance = useRef(null);

  useEffect(() => {
    // Initialize webcam instance
    webcamInstance.current = new Webcam(webcamRef.current);

    // Start webcam
    webcamInstance.current
      .start()
      .catch((err) => console.error("Error starting webcam:", err));

    // Request full screen mode
    document.documentElement.requestFullscreen();

    return () => {
      // Cleanup webcam
      webcamInstance.current.stop();

      // Exit full screen mode when component unmounts
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const handleCapture = () => {
    // Capture image from webcam
    const imageSrc = webcamInstance.current.snap();
    setCapturedImage(imageSrc);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
        <video
          ref={webcamRef}
          autoPlay
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <button
          onClick={handleCapture}
          style={{
            position: "absolute",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1,
          }}
        >
          Capture
        </button>
        {capturedImage && (
          <img
            src={capturedImage}
            alt="Captured"
            style={{
              position: "absolute",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              maxWidth: "100%",
              zIndex: 1,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CameraScreen;

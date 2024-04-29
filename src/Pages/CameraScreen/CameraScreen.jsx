/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";

const CameraScreen = () => {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const constraints = { video: { facingMode: "environment" } }; // Use rear-facing camera by default

    const initializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
      }
    };

    initializeCamera();

    // Cleanup function
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // Add event listener to handle orientation change
  useEffect(() => {
    const handleOrientationChange = () => {
      if (videoRef.current) {
        const angle = window.orientation || 0;
        videoRef.current.style.transform = `rotate(${angle}deg)`;
      }
    };

    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  const handleCapture = () => {
    // Capture logic goes here
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      // Now you can use the canvas image data as you wish
      const capturedImage = canvas.toDataURL("image/png");
      console.log("Captured Image:", capturedImage);
    }
  };

  return (
    <div style={{ backgroundColor: "red", position: "relative" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
        }}
      />
      <button
        onClick={handleCapture}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          fontSize: "16px",
          borderRadius: "5px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          cursor: "pointer",
        }}
      >
        Capture
      </button>
    </div>
  );
};

export default CameraScreen;

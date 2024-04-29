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

  return (
    <div style={{ backgroundColor: "red" }}>
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
    </div>
  );
};

export default CameraScreen;

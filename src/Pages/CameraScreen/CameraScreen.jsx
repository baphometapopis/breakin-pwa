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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Function to toggle fullscreen mode
  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (!document.fullscreenElement) {
        videoRef.current.requestFullscreen().catch((err) => {
          console.error("Error attempting to enable full-screen mode:", err);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div
      style={{
        backgroundColor: "red",
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        onClick={toggleFullScreen}
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "auto",
          height: "auto",
          transform: "rotate(90deg)", // Rotate video to landscape mode
          cursor: "pointer", // Add cursor pointer to indicate video can be clicked for fullscreen
        }}
      />
    </div>
  );
};

export default CameraScreen;

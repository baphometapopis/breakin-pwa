/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";

const VideoRecorder = () => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const lockOrientation = async () => {
      try {
        // Check if the screen orientation API is available
        if (screen.orientation) {
          // Check if the document is in fullscreen mode
          if (document.fullscreenElement) {
            // Attempt to lock the screen orientation to landscape
            await screen.orientation.lock("landscape");
            console.log("Orientation locked successfully.");
          } else {
            console.log("Page needs to be fullscreen.");
          }
        } else {
          console.log("Screen orientation API not available.");
        }
      } catch (error) {
        console.error("Failed to lock orientation:", error.message);
      }
    };

    lockOrientation();

    // Cleanup function to unlock the orientation when component unmounts
    return () => {
      if (screen.orientation) {
        // Unlock the screen orientation
        screen.orientation.unlock();
        console.log("Orientation unlocked.");
      }
    };
  }, []);

  const handleFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.log("Failed to enter fullscreen:", err.message);
      });
    }
  };

  return (
    <div className="camera-container">
      <div style={{ padding: "10px" }}>
        <button onClick={handleFullscreen}>Fullscreen</button>
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            screenshotFormat="image/webp"
            screenshotQuality={0.9}
            width="100%"
            className="camera-video"
            videoConstraints={{
              facingMode: "environment", // Use 'user' for front camera, 'environment' for rear camera
            }}
          />
          {/* <button className="camera-button" onClick={handleCapture}>
            Capture
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default VideoRecorder;

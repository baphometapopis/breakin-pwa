/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import "./VideoRecorder.css";

const VideoRecorder = () => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const lockOrientation = async () => {
      try {
        // Check if the screen orientation API is available
        if (screen.orientation) {
          // Attempt to lock the screen orientation to landscape
          await screen.orientation.lock('landscape');
          console.log('Orientation locked successfully.');
        } else {
          console.log('Screen orientation API not available.');
        }
      } catch (error) {
        console.error('Failed to lock orientation:', error.message);
      }
    };

    lockOrientation();

    // Cleanup function to unlock the orientation when component unmounts
    return () => {
      if (screen.orientation) {
        // Unlock the screen orientation
        screen.orientation.unlock();
        console.log('Orientation unlocked.');
      }
    };
  }, []);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "red",
        // height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ padding: "10px" }}>
        <Webcam
          className="videoRecord"
          audio={false}
          ref={webcamRef}
          videoConstraints={{
            facingMode: "environment",
          }}
        />
      </div>
    </div>
  );
};

export default VideoRecorder;

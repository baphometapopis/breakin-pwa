import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

const CameraScreen = ({ onCapture }) => {
  const [isCameraAllowed, setIsCameraAllowed] = useState(false);
  const webcamRef = useRef(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      onCapture(imageSrc);
    }
  };

  const requestCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setIsCameraAllowed(true);
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  return (
    <div>
      {!isCameraAllowed ? (
        <div>
          <p>Please allow access to your camera:</p>
          <button onClick={requestCameraAccess}>Allow Camera Access</button>
        </div>
      ) : (
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            width="100%"
            videoConstraints={{
              facingMode: "environment", // Use 'user' for front camera, 'environment' for rear camera
            }}
            style={{
              maxHeight: "80vh", // Limit the height of the video to ensure it fits on mobile screens
              objectFit: "cover", // Ensure the video fills the entire container on mobile screens
            }}
          />
          <button onClick={handleCapture}>Capture</button>
        </div>
      )}
    </div>
  );
};

export default CameraScreen;

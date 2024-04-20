import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import "./CameraScreen.css"; // Import the CSS file

const CameraScreen = () => {
  const [isCameraAllowed, setIsCameraAllowed] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const savePhoto = () => {
    console.log(capturedImage, "Capture");
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

  const handleImageClick = () => {
    // Open the captured image in full screen
    if (capturedImage) {
      const fullScreenImg = window.open("", "_blank");
      fullScreenImg.document.write(
        `<img src="${capturedImage}" style="width: 100vw; height: 100vh; object-fit: contain;" />`
      );
      fullScreenImg.document.close();
    }
  };

  return (
    <div className="camera-container">
      {!isCameraAllowed ? (
        <div>
          <p className="camera-message">Please allow access to your camera:</p>
          <button className="camera-button" onClick={requestCameraAccess}>
            Allow Camera Access
          </button>
        </div>
      ) : (
        <div>
          {!capturedImage ? (
            <div>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width="100%"
                className="camera-video"
                videoConstraints={{
                  facingMode: "environment", // Use 'user' for front camera, 'environment' for rear camera
                }}
              />
              <button className="camera-button" onClick={handleCapture}>
                Capture
              </button>
            </div>
          ) : (
            <div>
              <img
                src={capturedImage}
                alt="Captured"
                className="captured-image"
                onClick={handleImageClick} // Handle click to view in full screen
              />
              <div className="save-button-container">
                <button className="save-button" onClick={savePhoto}>
                  Save
                </button>
                <button className="retake-button" onClick={retakePhoto}>
                  Retake
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CameraScreen;

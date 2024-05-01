import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";

const Camera = () => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    console.log(imageSrc); // You can use this image source as you need
  }, [webcamRef]);

  const videoConstraints = {
    facingMode: { exact: "environment" }, // This will use the back camera if available
  };

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture</button>
    </>
  );
};

export default Camera;

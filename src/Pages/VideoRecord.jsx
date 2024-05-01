import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
// import "./VideoCapture.css"; // Import the CSS file

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);

  const videoConstraints = {
    facingMode: { exact: "environment" }, // This will use the back camera if available
  };
  const startVideoCapture = () => {
    setCapturing(true);
    const stream = webcamRef.current.video.srcObject;
    const options = { mimeType: "video/webm" };
    mediaRecorderRef.current = new MediaRecorder(stream, options);
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();
  };

  const stopVideoCapture = () => {
    setCapturing(false);
    mediaRecorderRef.current.stop();
  };

  const handleDataAvailable = ({ data }) => {
    if (data.size > 0) {
      setRecordedChunks((prev) => [...prev, data]);
    }
  };

  const downloadVideo = () => {
    const blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "react-webcam-video.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="video-capture-container">
      <div className="video-container">
        {capturing && (
          <Webcam
            audio={true}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="video-element"
          />
        )}
      </div>
      <div className="video-controls">
        {!capturing && (
          <button onClick={startVideoCapture}>Start Video Capture</button>
        )}
        {capturing && (
          <button onClick={stopVideoCapture}>Stop Video Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={downloadVideo}>Download Video</button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;

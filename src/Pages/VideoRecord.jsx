/* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigation = useNavigate();
  const videoConstraints = {
    facingMode: { exact: "environment" }, // This will use the back camera if available
    // facingMode: 'user', // This will use the back camera if available

  };

  const startVideoCapture = () => {
    setCapturing(true);
    const stream = webcamRef.current.video.srcObject;
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      const options = { mimeType: "video/webm" };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
    }
  };
  
  

  const stopVideoCapture = () => {
    setCapturing(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
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
    console.log(url);
    navigation("/VideoPreview", {
      state: {
        videoUri: url,
        proposalInfo: "info",
      },
    });

    // const a = document.createElement("a");
    // document.body.appendChild(a);
    // a.style = "display: none";
    // a.href = url;
    // a.download = "react-webcam-video.webm";
    // a.click();
    // window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener to window resize event
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures that effect only runs on mount and unmount

  return (
    
    <div className="camera-container">
    
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            // width={windowSize.w}
            height={windowSize.height}
            videoConstraints={videoConstraints}
          />
          <div className="capture-button-container">
            <div onClick={startVideoCapture} className="capture-button"></div>
          </div>
        </div>
 
    </div>
  );
};

export default VideoRecorder;

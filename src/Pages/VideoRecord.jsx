// In VideoRecorder.js
/* eslint-disable */

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import './VideoRecorder.css'

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
    // facingMode: 'user',
    facingMode: { exact: "environment" }, // This will use the back camera if available

  };

  const MAX_VIDEO_DURATION = 90; // Maximum video duration in seconds (1 minute and 30 seconds)
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timerId;
    if (capturing) {
      timerId = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000); // Update elapsed time every second
    } else {
      clearInterval(timerId);
      setElapsedTime(0); // Reset elapsed time when capturing stops
    }

    return () => clearInterval(timerId); // Cleanup timer on component unmount or when capturing stops
  }, [capturing]);

  const startVideoCapture = () => {
    console.log('clicked')
    setCapturing(true);
    const stream = webcamRef.current.video.srcObject;
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      const options = { mimeType: "video/webm" };
      mediaRecorderRef.current = new MediaRecorder(stream, options);
      mediaRecorderRef.current.ondataavailable = handleDataAvailable;
      mediaRecorderRef.current.start();
    }

    // Automatically stop video capture after maximum duration
    setTimeout(stopVideoCapture, MAX_VIDEO_DURATION * 1000);
  };

  const stopVideoCapture = () => {
    setCapturing(false);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    const blob = new Blob(recordedChunks, {
      type: "video/webm",
    });
    const url = URL.createObjectURL(blob);
    navigation("/VideoPreview", {
      state: {
        videoUri: url,
        proposalInfo: "info",
      },
    });
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
    navigation("/VideoPreview", {
      state: {
        videoUri: url,
        proposalInfo: "info",
      },
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  useEffect(()=>{},[capturing])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="camera-container">
      <div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          height={windowSize.height}
          videoConstraints={videoConstraints}
        />
        {<div className="capture-button-container">

       {!capturing ?  <div onClick={startVideoCapture} className="capture-button"></div>:
          <div onClick={stopVideoCapture} className="video-duration">
            <div onClick={startVideoCapture} className="capture-button">
              <div className="stop-rec"/>
            </div>
           <p className="duration-timer">  {formatTime(elapsedTime)} / {formatTime(MAX_VIDEO_DURATION)}</p>
          </div>}
        </div>}
      </div>
    </div>
  );
};

export default VideoRecorder;

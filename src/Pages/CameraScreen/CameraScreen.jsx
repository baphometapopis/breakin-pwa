import React, { useState } from "react";
// import { FACING_MODES } from "react-html5-camera-photo";
// import Webcam from "webcam-easy"; // Import Webcam from webcam-easy

const CameraScreen = () => {
  const [playing, setPlaying] = useState(false);

  const HEIGHT = 300;
  const WIDTH = 300;

  const startVideo = () => {
    setPlaying(true);
    const constraints = {
      audio: false,
      video: { width: HEIGHT, height: HEIGHT },
      FACING_MODES: { exact: "environment" },
    };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        let video = document.getElementsByClassName("app__videoFeed")[0];
        if (video) {
          video.srcObject = stream;
        }
      })
      .catch((error) => {
        console.log("WTS WHYYYYYY", error);
      });
  };

  const stopVideo = () => {
    setPlaying(false);
    let video = document.getElementsByClassName("app__videoFeed")[0];
    video.srcObject.getTracks()[0].stop();
  };

  return (
    <div className="app">
      <div className="app__input">
        {playing ? (
          <button onClick={stopVideo}>Stop</button>
        ) : (
          <button onClick={startVideo}>Start</button>
        )}
      </div>
      <div className="app__container">
        <video
          height={`${HEIGHT}px`}
          width={`${WIDTH}px`}
          // height={HEIGHT}
          // width={WIDTH}
          playsInline
          autoPlay
          style={{ objectFit: "fill" }}
          className="app__videoFeed"
        ></video>
      </div>
    </div>
  );
};

export default CameraScreen;

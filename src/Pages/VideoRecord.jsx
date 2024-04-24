import React, {  useRef } from "react";
import Webcam from "react-webcam";
import "./VideoRecorder.css";

const VideoRecorder = () => {
  const webcamRef = useRef(null);
  // const mediaRecorderRef = useRef(null);
  // const [capturing, setCapturing] = useState(false);
  // const [recordedChunks, setRecordedChunks] = useState([]);
  // const [videoLength, setVideoLength] = useState(0);

  // const handleStartCaptureClick = useCallback(() => {
  //   // setCapturing(true);
  //   mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
  //     mimeType: "video/webm",
  //   });
  //   mediaRecorderRef.current.addEventListener(
  //     "dataavailable",
  //     handleDataAvailable
  //   );
  //   mediaRecorderRef.current.start();
  // }, [webcamRef, mediaRecorderRef]);

  // const handleDataAvailable = useCallback(
  //   ({ data }) => {
  //     if (data.size > 0) {
  //       setRecordedChunks((prev) => prev.concat(data));
  //       const recordedTime = recordedChunks.reduce(
  //         (total, chunk) => total + chunk.duration,
  //         0
  //       );
  //       setVideoLength(recordedTime);
  //     }
  //   },
  //   [setRecordedChunks, recordedChunks, setVideoLength]
  // );

  // const handleStopCaptureClick = useCallback(() => {
  //   mediaRecorderRef.current.stop();
  //   // setCapturing(false);
  // }, [mediaRecorderRef]);

  // const handleDownload = useCallback(() => {
  //   if (recordedChunks.length) {
  //     const blob = new Blob(recordedChunks, {
  //       type: "video/webm",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     document.body.appendChild(a);
  //     a.style = "display: none";
  //     a.href = url;
  //     a.download = "recorded-video.webm";
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     setRecordedChunks([]);
  //   }
  // }, [recordedChunks]);

  // useEffect(() => {}, [videoLength]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "red",
        // height: "100vh",
        width: "100vw",
      }}
    >
      <div style={{ backgroundColor: "green", padding: "10px" }}>
        <Webcam
          className="videoRecord "
          audio={false}
          ref={webcamRef}
          // videoConstraints={
          //   {
          //     width:100000,
          //     height:10000
          //   }
          // }
          // mirrored={true}
          // style={{ width: "100vh", height: "100%" }}
        />
      </div>
      {/* <div>
        {!capturing && (
          <button onClick={handleStartCaptureClick}>Start Capture</button>
        )}
        {capturing && (
          <button onClick={handleStopCaptureClick}>Stop Capture</button>
        )}
        {recordedChunks.length > 0 && (
          <button onClick={handleDownload}>Download</button>
        )}
      </div>
      {capturing && (
        <p>
          Video Length: {Math.floor(videoLength / 60)}:{videoLength % 60}
        </p>
      )} */}
    </div>
  );
};

export default VideoRecorder;

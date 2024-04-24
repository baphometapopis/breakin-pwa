import React from "react";
import { useLocation } from "react-router-dom";

const VideoPreview = () => {
  const handleSubmit = () => {
    // Handle form submission logic here
  };
  const { state } = useLocation();
  const { videoUri } = state;
  console.log(state)

  return (
    <div>
      <video controls>
        <source src={videoUri} type="video/webm" />
      </video>
      {/* <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p> */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default VideoPreview;

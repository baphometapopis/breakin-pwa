import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./VideoPreview.css"; // Import CSS file for styling

const VideoPreview = () => {
  const { state } = useLocation();
  const { videoUri } = state;
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [odometerReading, setOdometerReading] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Get device ID
    const id = navigator.userAgent;
    setDeviceId(id);

    // Get user's current position
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    } else {
      console.error("Geolocation not supported");
    }
  }, []);

  const handleSubmit = () => {
    // Handle form submission logic here
    setSubmitted(true); // Update state to indicate submission
  };

  const handleRetake = () => {
    // Handle retake logic here
    // You can redirect or reset the form state, etc.
  };

  return (
    <div className="video-preview-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Odometer Reading"
          value={odometerReading}
          onChange={(e) => setOdometerReading(e.target.value)}
        />
      </div>
      <video controls>
        <source src={videoUri} type="video/webm" />
      </video>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      <p>Device ID: {deviceId}</p>
      {submitted ? (
        <p>Video Submitted!</p>
      ) : (
        <div className="button-container">
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={handleRetake}>Retake</button>
        </div>
      )}
    </div>
  );
};

export default VideoPreview;

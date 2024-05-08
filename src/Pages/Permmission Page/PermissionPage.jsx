import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PermissionPage.css'; // Import CSS file for styling

const PermissionPage = () => {
  const navigate=useNavigate()
  const [isMobile, setIsMobile] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);
  const [canStartInspection, setCanStartInspection] = useState(false);

  useEffect(() => {
    // Check if the page is accessed on a mobile device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log(userAgent)
    setIsMobile(/android|iphone|ipad|ipod/i.test(userAgent));

    // Check for camera permission
    if (isMobile) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setCameraPermission(true))
        .catch(() => setCameraPermission(false));
    }

    // Check for geolocation permission
    if (isMobile) {
      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  }, [isMobile]);

  useEffect(() => {
    // Check if both camera and location permissions are granted
    if (cameraPermission === true && locationPermission === true) {
      setCanStartInspection(true);
    } else {
      setCanStartInspection(false);
    }
  }, [cameraPermission, locationPermission]);

  const requestPermissions = () => {
    // Request camera and geolocation permissions
    if (isMobile) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setCameraPermission(true))
        .catch(() => setCameraPermission(false));

      navigator.geolocation.getCurrentPosition(
        () => setLocationPermission(true),
        () => setLocationPermission(false)
      );
    }
  };

  return (
    <div className="container">
      <div className="permission-content">
        <ul>
          <li>{cameraPermission ? '✅ Camera permission granted' : '❌ Camera permission denied'}</li>
          <li>{locationPermission ? '✅ Location permission granted' : '❌ Location permission denied'}</li>
          <li>{isMobile ? '✅ Mobile device detected' : '❌ Not a mobile device'}</li>
        </ul>
        <button onClick={requestPermissions} type='submit'>Request Permissions</button>
        {canStartInspection && <button onClick={()=>navigate('/InspectionCheckpoint', { replace: true })}>Start Inspection</button>}
      </div>
    </div>
  );
};

export default PermissionPage;

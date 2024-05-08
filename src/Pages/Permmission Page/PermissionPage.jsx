import React, { useState, useEffect } from 'react';
import './PermissionPage.css'; // Import CSS file for styling

const PermissionPage = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [locationPermission, setLocationPermission] = useState(null);

  useEffect(() => {
    // Check if the page is accessed on a mobile device
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
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

  // if (!isMobile) {
  //   alert('This page is accessible only on mobile devices.');
  //   return null;
  // }

  return (
    <div className="container">
      <div className="permission-content">
        <ul>
          <li>{cameraPermission ? '✅ Camera permission granted' : '❌ Camera permission denied'}</li>
          <li>{locationPermission ? '✅ Location permission granted' : '❌ Location permission denied'}</li>
          <li>{isMobile ? '✅ Mobile device detected' : '❌ Not a mobile device'}</li>
        </ul>
        <button onClick={requestPermissions}>Request Permissions</button>
      </div>
    </div>
  );
};

export default PermissionPage;

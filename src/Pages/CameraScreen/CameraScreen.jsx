/* eslint-disable no-restricted-globals */
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./CameraScreen.css"; // Import the CSS file
import { useNavigate } from "react-router-dom";

const CameraScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraAllowed, setIsCameraAllowed] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [allcapturedImage, setAllCapturedImage] = useState([]);
  const navigation = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [images, setImages] = useState([
    {
      id: "1",
      name: "Odometer with Engine on Position",
      is_mand: "1",
      sample_image_url:
        "https://bp.mypolicynow.com/api/images/breakin_sample_image/ODOMETER.jpeg",
    },
    {
      id: "2",
      name: "Windscreen Inside to Outside",
      is_mand: "1",
      sample_image_url:
        "https://bp.mypolicynow.com/api/images/breakin_sample_image/Windscreen-Inside-to-Outside.jpg",
    },
    {
      id: "3",
      name: "Windscreen Outside to Inside",
      is_mand: "1",
      sample_image_url:
        "https://bp.mypolicynow.com/api/images/breakin_sample_image/Windscreen-Outside-to-Inside.jpg",
    },
  ]);

  const webcamRef = useRef(null);

  const handleCapture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      const data = {
        name: images[currentImageIndex - 1]?.name,
        image: imageSrc,
      };
      setAllCapturedImage([...allcapturedImage, data]);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  const savePhoto = () => {
    if (currentImageIndex <= images.length - 1) {
      console.log(allcapturedImage, "Capture");
      setCapturedImage(null);
      setIsModalOpen(true);
    } else {
      console.log(allcapturedImage, "Capture");
      navigation("/ShowInspectionImages", {
        state: {
          capturedImagesWithOverlay: allcapturedImage,
          proposalInfo: "info",
        },
      });
      console.log("done");
    }
  };

  // const savePhoto = async () => {
  //   if (currentImageIndex < images.length) {
  //     // onImageSave(fileData);
  //     // console.log('File information:', fileData);
  //   }
  //   const overlayText = images[currentImageIndex]?.name;
  //   const overlayTextid = images[currentImageIndex]?.id;
  //   const textimage = capturedImage;

  //   const fileName = `${overlayText}.jpg`;
  //   const fileData = {
  //     uri: textimage, // Use the last captured image URI
  //     type: "image/jpeg",
  //     name: fileName,
  //     part: overlayText,
  //     image_id: overlayTextid,
  //   };
  //   setAllCapturedImage([...allcapturedImage, fileData]);
  //   // showNextOverlay();
  // };

  const requestCameraAccess = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setIsCameraAllowed(true);
        setIsModalOpen(true);
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentImageIndex(currentImageIndex + 1); // Move to the next image
  };

  useEffect(() => {
    const lockOrientation = async () => {
      try {
        // Check if the screen orientation API is available
        if (screen.orientation) {
          // Check if the document is in fullscreen mode
          if (document.fullscreenElement) {
            // Attempt to lock the screen orientation to landscape
            await screen.orientation.lock("landscape");
            console.log("Orientation locked successfully.");
          } else {
            console.log("Page needs to be fullscreen.");
          }
        } else {
          console.log("Screen orientation API not available.");
        }
      } catch (error) {
        console.error("Failed to lock orientation:", error.message);
      }
    };

    lockOrientation();

    // Cleanup function to unlock the orientation when component unmounts
    return () => {
      if (screen.orientation) {
        // Unlock the screen orientation
        screen.orientation.unlock();
        console.log("Orientation unlocked.");
      }
    };
  }, []);

  useEffect(() => {
    // Fetch the array of images when component mounts
    // Replace this with your actual API call to fetch images
    const fetchData = async () => {
      try {
        const response = await fetch("your_api_endpoint_here");
        const data = await response.json();
        setImages(data);
        setIsModalOpen(true); // Open modal once images are fetched
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="camera-container">
      {isModalOpen && images.length > 0 && (
        <div className="modal">
          <div style={{ flex: 0.4 }}>
            <img
              src={images[currentImageIndex]?.sample_image_url}
              alt={images[currentImageIndex]?.name}
              style={{ width: "100%", height: "80%" }}
            />
            <p className="modalText">{images[currentImageIndex]?.name}</p>
            <p className="modalText">
              {currentImageIndex}/{images.length - 1}
            </p>
          </div>
          <div style={{ flex: 0.6 }}>
            <h5 className="modalText">
              Please follow the instructions to capture Image
            </h5>

            <p className="instructionText">
              {"\u2022"} The Image has to be captured during the daylight. Image
              captured in basements or shades (ex. tree shades) will not be
              valid.
            </p>
            <p className="instructionText">
              {"\u2022"} Please keep your car Turned ON for 10 seconds and then
              Start Taking Images
            </p>
            <p className="instructionText">
              {"\u2022"} A Reference Image is placed in the Middle of the Camera
              while capturing Image
            </p>
            <p className="instructionText">
              {"\u2022"} Click on Ok When Your are Ready
            </p>

            <div onClick={handleModalClose} className="ok-button">
              Start Camera
            </div>
          </div>
        </div>
      )}
      {!isCameraAllowed && (
        <div>
          <p className="camera-message">Please allow access to your camera:</p>
          <button className="camera-buttons" onClick={requestCameraAccess}>
            Allow Camera Access
          </button>
        </div>
      )}
      {isCameraAllowed && !isModalOpen && !capturedImage && (
        <div>
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored={true}
            screenshotFormat="image/webp"
            screenshotQuality={0.9}
            width="100%"
            className="camera-video"
            videoConstraints={{
              facingMode: "environment", // Use 'user' for front camera, 'environment' for rear camera
            }}
          />
          <button className="camera-button" onClick={handleCapture}>
            Capture
          </button>
        </div>
      )}
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" className="captured-image" />
          <div className="save-button-container">
            <button className="save-button" onClick={savePhoto}>
              Save
            </button>
            <button className="retake-button" onClick={retakePhoto}>
              Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraScreen;

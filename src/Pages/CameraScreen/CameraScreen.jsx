// import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-html5-camera-photo/build/css/index.css";
// import { Camera } from "react-html5-camera-photo";
import "./CameraScreen.css"; // Import the CSS file
import { fetch_Image_inspection_question } from "../../Api/fetchQuestion";

const CameraScreen = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [allCapturedImages, setAllCapturedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigate();
  const webcamRef = useRef(null);

  const videoConstraints = {
    // facingMode: { exact: "environment" }, // This will use the back camera if available
    facingMode: { exact: "environment" }, // This will use the back camera if available

  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
  };
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const handleSavePhoto = () => {
    if (capturedImage) {
      const data = {
        images: capturedImage,
        imagename: images[currentImageIndex]?.name,
      };
      setAllCapturedImages([...allCapturedImages, data]);

      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setCapturedImage(null);
        setIsModalOpen(true);
      } else {
        navigation("/ShowInspectionImages", {
          state: {
            capturedImagesWithOverlay: allCapturedImages,
            proposalInfo: "info",
          },
        });
      }
    }
  };

  const fetchInspectionImages = async () => {
    const imageRes = await fetch_Image_inspection_question();
    console.log(imageRes.data);
    setImages(imageRes.data);
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

  useEffect(() => {}, [isModalOpen, images]);
  useEffect(() => {
    fetchInspectionImages();
  }, []);
  return (
    <div className="camera-container">
      {isModalOpen && (
        <div className="modal">
          <div style={{ flex: 0.4 }}>
            <img
              src={images[currentImageIndex]?.sample_image_url}
              alt={images[currentImageIndex]?.name}
              style={{ width: "100%", height: "80%" }}
            />
            <p className="modalText">{images[currentImageIndex]?.name}</p>
            <p className="modalText">
              {currentImageIndex + 1}/{images.length}
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

            <div onClick={() => setIsModalOpen(false)} className="ok-button">
              Start Camera
            </div>
          </div>
        </div>
      )}
      {!isModalOpen && !capturedImage && (
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
            <div onClick={capture} className="capture-button"></div>
          </div>{" "}
        </div>
      )}
      {capturedImage && (
        <div>
          <img src={capturedImage} alt="Captured" className="captured-image" />

          <div className="save-button-container">
            <button className="save-button" onClick={handleSavePhoto}>
              Save
            </button>
            <button className="retake-button" onClick={handleRetakePhoto}>
              Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraScreen;

// const Camera = () => {
//   const webcamRef = useRef(null);

//   const capture = useCallback(() => {
//     const imageSrc = webcamRef.current.getScreenshot();
//     console.log(imageSrc); // You can use this image source as you need
//   }, [webcamRef]);

//   const videoConstraints = {
//     facingMode: { exact: "environment" }, // This will use the back camera if available
//   };

//   return (
//     <>
//       <Webcam
//         audio={false}
//         ref={webcamRef}
//         screenshotFormat="image/jpeg"
//         videoConstraints={videoConstraints}
//       />
//       <button onClick={capture}>Capture</button>
//     </>
//   );
// };

// export default Camera;

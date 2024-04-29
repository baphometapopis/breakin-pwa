import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-html5-camera-photo/build/css/index.css";
import { Camera } from "react-html5-camera-photo";
import "./CameraScreen.css"; // Import the CSS file

const CameraScreen = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [allCapturedImages, setAllCapturedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigate();

  const handleTakePhoto = (dataUri) => {
    setCapturedImage(dataUri);
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
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

  const images = [
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
  ];

  useEffect(() => {}, [isModalOpen]);
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
          <Camera
            onTakePhoto={(dataUri) => handleTakePhoto(dataUri)}
            idealFacingMode="environment"
            isMaxResolution={true}
            imageType="jpg"
            isFullscreen={true}
            imageCompression={0.97}
            isImageMirror={true}
          />
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

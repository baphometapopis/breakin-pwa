import React, { useEffect, useState } from "react";
import "./ShowMandatoryInspectionimages.css"; // Import your CSS file
import { useLocation } from "react-router-dom";

const ShowinspectionImages = ({ route }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const { state } = useLocation();
  const { capturedImagesWithOverlay } = state;

  console.log(state);

  const handleSubmit = () => {
    setIsLoading(true); // Simulate loading

    // Simulate submission success
    setTimeout(() => {
      setIsLoading(false);
      //   setRequestDone(true);
    }, 2000);
  };

  const handleImagePress = (uri) => {
    setSelectedImage(uri);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    // Fetch data here if needed
  }, []);

  return (
    <div className="container1">
      <div className="imageGrid">
        {capturedImagesWithOverlay?.map((item, index) => (
          <div key={index} className="imageContainer">
            {/* {submittedImages.includes(item.part) && (
              <img className="checkIcon" src={IconCheck} alt="Check Icon" />
            )} */}
            {console.log(item)}
            <img
              className="image"
              src={item?.images}
              alt={item?.imagename}
              onClick={() => handleImagePress(item.images)}
            />
            <p className="overlayText">{item?.imagename}</p>
          </div>
        ))}
      </div>
      <button
        className="submitButton"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
      {isLoading && (
        <div className="loaderContainer">
          <div className="loader"></div>
          <p className="loaderText">Submitting Question</p>
        </div>
      )}
      {selectedImage && (
        <div className="modalContainer">
          <div className="closeButton" onClick={handleModalClose}>
            Close
          </div>
          <img
            className="fullScreenImage"
            src={selectedImage}
            alt="Full Screen"
          />
        </div>
      )}
    </div>
  );
};

export default ShowinspectionImages;

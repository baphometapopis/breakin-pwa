/* eslint-disable */
// import React, { useRef, useCallback } from "react";
import Webcam from "react-webcam";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-html5-camera-photo/build/css/index.css";
// import { Camera } from "react-html5-camera-photo";
import "./CameraScreen.css"; // Import the CSS file
import { fetch_Image_inspection_question } from "../../Api/fetchQuestion";
import { fetchDataLocalStorage } from "../../Utils/LocalStorage";
import { PlaceholderImage } from "../../Constant/ImageConstant";

const CameraScreen = () => {
  const FrontvideoConstraints = {
    facingMode: 'user', // This will use the front camera if available


  };

  const BackvideoConstraints = {

    facingMode: { exact: "environment" }, // This will use the back camera if available

  };


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [latitude, setLatitude] = useState(null);

  const [longitude, setLongitude] = useState(null);
  const [images, setImages] = useState([]);
  const [ProposalInfo, setProposalInfo] = useState([]);
  const [VideoConstraints, setVideoConstraints] = useState(BackvideoConstraints);


  const [isModalOpen, setIsModalOpen] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const [allCapturedImages, setAllCapturedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigation = useNavigate();
  const webcamRef = useRef(null);

  

const skipImage=()=>{
  if (currentImageIndex < images.length - 1) {
    setCurrentImageIndex(currentImageIndex + 1);
    setCapturedImage(null);
    setIsModalOpen(true);
  } else {
    navigation("/ShowInspectionImages", {
      state: {
        capturedImagesWithOverlay: allCapturedImages,
        proposalInfo: ProposalInfo,
      },
    });
  }

}

  const handleRetakePhoto = () => {
    setCapturedImage(null);
  };
  // const capture = () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setCapturedImage(imageSrc);
  // };
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    // Create a new image object to load the captured image
    const image = new Image();
    image.onload = () => {
      // Set canvas dimensions to match the captured image, swapping width and height for rotation
      canvas.width = image.height; // Height becomes width after rotation
      canvas.height = image.width; // Width becomes height after rotation
  
      // Rotate the canvas 90 degrees clockwise
      ctx.rotate(Math.PI / 2); // 90 degrees in radians
  
      // Translate the origin point to the top-right corner (after rotation)
      ctx.translate(0, -canvas.width);
  
      // Draw the captured image onto the canvas (after rotation)
      ctx.drawImage(image, 0, 0);
  
      // Add timestamp text
      ctx.font = '25px Arial';
      ctx.fillStyle = 'red';
      const timestamp = new Date().toLocaleString();
      const text = `Time/Date: ${timestamp}  Lat/Long :${latitude} / s${longitude}`;
      const textWidth = ctx.measureText(text).width;
      const x = 10; // Adjusted for padding
      const y = 20; // Adjusted for position from top
      ctx.fillText(text, x, y); // Adjust position as needed
  
      // Set the captured image with timestamp as the new captured image
      setCapturedImage(canvas.toDataURL('image/jpeg'));
    };
    // Set the captured image source
    image.src = imageSrc;
  };
  
  

  const handleSavePhoto = () => {
    if (capturedImage) {
      const overlayText = images[currentImageIndex]?.name;
      const overlayTextid = images[currentImageIndex]?.id;
  
      const timestamp = new Date().getTime();
      const fileName = `${images[currentImageIndex]?.name}.jpg`;
      const fileData = {
        uri: capturedImage, // Use the last captured image URI
        type: 'image/jpeg',
        name: fileName,
        part: overlayText,
        image_id: overlayTextid,
      };
      // const data = {
      //   images: capturedImage,
      //   imagename: images[currentImageIndex]?.name,
      // };

      console.log(fileData)

      setAllCapturedImages([...allCapturedImages, fileData]);

      if (currentImageIndex < images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
        setCapturedImage(null);
        setIsModalOpen(true);
      } else {
        navigation("/ShowInspectionImages", {
          state: {
            capturedImagesWithOverlay: allCapturedImages,
            proposalInfo: ProposalInfo,
          },
        });
      }
    }
  };

  const fetchInspectionImages = async () => {
    const ProposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')
    setProposalInfo(ProposalInfo)



    const imageRes = await fetch_Image_inspection_question();
    console.log(imageRes.data);
    setImages(imageRes.data);
  };

  useEffect(() => {
    // Get device ID
    const id = navigator.userAgent;

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

  useEffect(() => {}, [isModalOpen, images,ProposalInfo,VideoConstraints]);

  useEffect(()=>{
    if(images[currentImageIndex]?.id==17)
    {
      setVideoConstraints(FrontvideoConstraints)
    }
},[])
  useEffect(() => {
    fetchInspectionImages();
  }, []);
  return (
    <div className="camera-container">
      {isModalOpen && (
        <div className="modal">
          <div style={{ flex: 0.4 }}>
            <img
              src={images[currentImageIndex]?.sample_image_url?images[currentImageIndex]?.sample_image_url:PlaceholderImage}
              alt={images[currentImageIndex]?.name}
              style={{ width: "100%", height: "80%" }}
            />
            <p className="modalText">{images[currentImageIndex]?.name}</p>
            <p className="modalText">{images[currentImageIndex]?.is_mand}</p>

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
            <div style={{display:'flex',flexDirection:'row',gap:10}}>
            <div onClick={() => setIsModalOpen(false)} className="ok-button">
              Start Camera
            </div>
          {images[currentImageIndex]?.is_mand==0 ?  <div onClick={skipImage} className="skip-button">
              Skip
            </div>:null}
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
            videoConstraints={VideoConstraints}
          />
          <div className="capture-button-container">
            <div onClick={capture} className="capture-button"></div>
          </div>
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

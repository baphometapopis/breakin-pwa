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
import { Logo1, PlaceholderImage } from "../../Constant/ImageConstant";

const CameraScreen = () => {
  const canvasRef = useRef(null);

  const FrontvideoConstraints = {
    facingMode: 'user', // This will use the front camera if available


  };

  const BackvideoConstraints = {
    // facingMode: 'user', // This will use the front camera if available


    facingMode: { exact: "environment" }, // This will use the back camera if available

  };


  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [latitude, setLatitude] = useState(null);
  const [CanvaImageData, setCanvaImageData] = useState('');


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
  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);



  };


  
  

  const handleSavePhoto = () => {
  
    const canvas = canvasRef.current;
  
    const ctx = canvas.getContext('2d');
  
    // Set canvas dimensions to match window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    // Draw on the canvas
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Add blue footer bar
    const footerHeight = 80; // Height of the footer bar
    ctx.fillStyle = '#F1FBFF';
    ctx.fillRect(0, canvas.height - footerHeight, canvas.width, footerHeight);
  
    // Draw footer text
    ctx.fillStyle = '#0E445A';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left'; // Align text to the left
    const currentDate = new Date();

    const timeOptions = {
      hour12: true, // Display time in 12-hour format
      hour: 'numeric', // Display hours as digits
      minute: '2-digit', // Display minutes as two digits
      second: '2-digit', // Display seconds as two digits
    };
    
    const formattedTime = currentDate.toLocaleTimeString(undefined, timeOptions);
    const formattedDate = currentDate.toLocaleDateString();
    
    const formattedDateTime = `${formattedDate} ${formattedTime}`;
    
    ctx.fillText(`Date / Time: ${formattedDateTime}`, 20, canvas.height - 50); // Start from the left
    ctx.fillText(`Latitude / Longitude: ${latitude} / ${longitude}`, 20, canvas.height - 20); // Dynamic text
  
    // Load and draw footer logo
    const logo = new Image();
    logo.onload = () => {

      const logoWidth = 130; // Width of the logo
      const logoHeight = 50; // Height of the logo
      const logoX = 700; // X coordinate of the logo
      const logoY = canvas.height - footerHeight + 15; // Y coordinate of the logo
      ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
  
      // Load main image
      const image = new Image();
      image.onload = () => {
        // Draw the main image onto the canvas
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height - footerHeight);
        // Get data URL of the canvas
        const dataURL = canvas.toDataURL('image/jpeg');
        setCanvaImageData(dataURL);
  
        const overlayText = images[currentImageIndex]?.name;
        const overlayTextid = images[currentImageIndex]?.id;
  
        const timestamp = new Date().getTime();
        const fileName = `${images[currentImageIndex]?.name}.jpg`;
        const fileData = {
          uri: dataURL, // Use the canvas data URL
          type: 'image/jpeg',
          name: fileName,
          part: overlayText,
          image_id: overlayTextid,
          date: new Date().toString(), // Store the current date
          latitude: latitude, // Store latitude
          longitude: longitude, // Store longitude
        };
  
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
      };
      image.onerror = (error) => {
        console.error('Error loading image:', error);
      };
      image.src = capturedImage;
    };
    logo.src = Logo1;
};

  

  const fetchInspectionImages = async () => {
    const ProposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')
    setProposalInfo(ProposalInfo)



    const imageRes = await fetch_Image_inspection_question();
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
  useEffect(()=>{},[CanvaImageData])
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
      <canvas ref={canvasRef} style={{ display: 'none' }} />

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

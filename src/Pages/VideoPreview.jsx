/* eslint-disable */

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submit_inspection_Video } from "../Api/submitInspectionQuestion";
import Header from "../Component/Header";
import { fetchDataLocalStorage } from "../Utils/LocalStorage";
import "./VideoPreview.css"; // Import CSS file for styling

const VideoPreview = () => {
  const { state } = useLocation();
  const { videoUri,videoblob } = state;
  const [latitude, setLatitude] = useState(null);
  const [LocalData, setLocaldata] = useState('');
  const [ProposalInfo, setProposalInfo] = useState('');

  const [longitude, setLongitude] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [odometerReading, setOdometerReading] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const navigate=useNavigate()
  const fetchDataFromLocalStorage = async () => {
    const localdata = await fetchDataLocalStorage('Claim_loginDetails')
    const proposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')

    if (localdata && proposalInfo) {
      setLocaldata(localdata?.pos_login_data)
      console.log(localdata,proposalInfo)
      setProposalInfo(proposalInfo)
    }
  }
  const submitVideo= async()=>{
  
    const data={
      pos_id:LocalData?.pos_login_data?.id,
      break_in_case_id:ProposalInfo?.break_in_case_id,
      inspection_type:ProposalInfo?.inspection_type,
      id:ProposalInfo?.id,
      policy_endorsement_id:ProposalInfo?.policy_endorsement_id,
      videouri:videoUri

    }
    console.log(data)
    
    const res= await submit_inspection_Video(data)
    console.log(res)
  }

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



  const handleRetake = () => {
    // Handle retake logic here
    // You can redirect or reset the form state, etc.
    // navigate('/VideoRecord');
    navigate('/VideoRecord', { replace: true, state: { reset: true } });


  };

  useEffect(()=>{fetchDataFromLocalStorage()},[])
  return (

<div className="container">
<Header /> {/* Include the Header component */}


<div className={"optionCard"}>
      <div className="input-container">
        <input
          type="text"
          placeholder="Odometer Reading"
          value={odometerReading}
          onChange={(e) => setOdometerReading(e.target.value)}
        />
      </div>
      <video style={{width:'100%',height:'80%'}} controls>
        <source src={videoblob} type="video/webm" />
      </video>
      <p>Latitude: {latitude}</p>
      <p>Longitude: {longitude}</p>
      {/* <p>Device ID: {deviceId}</p> */}
      {submitted ? (
        <p>Video Submitted!</p>
      ) : (
        <div className="button-container">
          <button onClick={submitVideo}>Submit</button>
          <button onClick={handleRetake}>Retake</button>
        </div>
      )}



</div>
</div> 

  );
};

export default VideoPreview;

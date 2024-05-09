import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { submit_inspection_Video } from "../Api/submitInspectionQuestion";
import Header from "../Component/Header";
import { fetchDataLocalStorage } from "../Utils/LocalStorage";
import "./VideoPreview.css"; // Import CSS file for styling

const VideoPreview = () => {
  const { state } = useLocation();
  const { videoUri, videoblob } = state;
  const [LocalData, setLocaldata] = useState('');
  const [ProposalInfo, setProposalInfo] = useState('');
  const [ProposalNo, setProposalNo] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [odometerReading, setOdometerReading] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [odometerError, setOdometerError] = useState(false); // Track odometer error

  const navigate = useNavigate();

  const fetchDataFromLocalStorage = async () => {
    const localdata = await fetchDataLocalStorage('Claim_loginDetails')
    const proposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')
    const proposalNo = await fetchDataLocalStorage('proposal_no')

    if (localdata && proposalInfo && proposalNo) {
      setLocaldata(localdata?.pos_login_data)
      setProposalInfo(proposalInfo)
      setProposalNo(proposalNo)
    }
  }

  const submitVideo = async () => {
    if (!odometerReading) {
      setOdometerError(true); // Set odometer error if reading is not provided
      return; // Stop submission if odometer reading is missing
    }

    const data = {
      pos_id: LocalData?.pos_login_data?.id,
      break_in_case_id: ProposalInfo?.break_in_case_id,
      inspection_type: ProposalInfo?.inspection_type,
      id: ProposalInfo?.id,
      policy_endorsement_id: ProposalInfo?.policy_endorsement_id,
      videouri: videoUri
    };

    const res = await submit_inspection_Video(data);
    if (res?.status) {
      navigate(`/proposal-info/${ProposalNo}`,{replace:true});
    }
  };

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
    navigate('/VideoRecord',{replace:true});
  };

  useEffect(() => {
    fetchDataFromLocalStorage();
  }, []);

  return (
    <div className="container">
      <Header checkLocal={true} />
      <div className={"optionCard"}>
        <div className="input-container">
          <input
            type="text"
            placeholder="Odometer Reading"
            value={odometerReading}
            onChange={(e) => {
              setOdometerReading(e.target.value);
              setOdometerError(false); // Reset odometer error on input change
            }}
          />
          {odometerError && <p className="error">Odometer reading is required</p>}
        </div>
        <video style={{ width: '100%', height: '80%' }} controls>
          <source src={videoblob} type="video/webm" />
        </video>
        <p>Latitude: {latitude}</p>
        <p>Longitude: {longitude}</p>
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

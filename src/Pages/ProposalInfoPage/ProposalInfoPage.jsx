import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// import { isInspectionImagesFolderEmpty } from "../Utils/checkLocalStoragefordata";
import "./ProposalInfoPage.css"; // Import CSS module
import { CallIcon, StartInspection } from "../../Constant/ImageConstant";
import { fetchProposalDetails } from "../../Api/fetchProposalDetails";
import { url } from "../../Api/ApiEndpoint";
import { fetchLoginDataByProposalNoAPi } from "../../Api/fetchLoginDetailsByProposalNo";
import {  storeDataLocalStorage } from "../../Utils/LocalStorage";
import Header from "../../Component/Header";

export const ProposalInfoPage = ({ route }) => {
  const { proposalNumber } = useParams(); //extract proposal number

  // const [isLoading, setLoading] = useState(false);
  const [isProposalexist, setIsProposalExist] = useState(false);
  // const [isErrorVisible, setisErrorVisible] = useState(false);
  const [proposalInfo, setProposalInfo] = useState();
  const [proposalStatusData, setProposalStatusData] = useState();

  const [isCustomerCareModalVisible, setIsCustomerCareModalVisible] =
    useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async (proposaldata) => {
    // setLoading(true);

    try {
      const getData = await fetchProposalDetails(proposaldata?.proposal_id);
      if (getData.status) {
        setProposalInfo(getData?.data);
        storeDataLocalStorage('Claim_proposalDetails',getData?.data)
        storeDataLocalStorage('proposal_no',proposalNumber)

      } else {
        // setisErrorVisible(true);
      }
    } catch (error) {
      console.error("Error fetching proposal details:", error);
      // setisErrorVisible(true);
    } finally {
      // setLoading(false);
    }
  }, [proposalNumber]);
  // Make sure to include all dependencies used within useCallback.

  const fetchProposal = useCallback(async () => {
    const response = await fetchLoginDataByProposalNoAPi(proposalNumber); // Call API function with proposal number
    if (response.status && response.pos_login_data) {
      console.log("proposalFound", response);
      setIsProposalExist(true);
      setProposalStatusData(response?.pos_login_data);
      fetchData(response.pos_login_data?.proposal_data);
      storeDataLocalStorage('Claim_loginDetails',response)

    }
  }, [proposalNumber, setIsProposalExist, setProposalStatusData, fetchData]);

  useEffect(() => {
    fetchProposal();
  }, [fetchProposal]);

  const toggleCustomerCareModal = () => {
    setIsCustomerCareModalVisible(!isCustomerCareModalVisible);
  };

  return (
    <div className="container">
                <Header /> {/* Include the Header component */}

      {" "}
      {/* Use CSS module class */}
      {isProposalexist ? (
        <div className={"optionCard"}>
          <div className={"rowlogo"}>
            <img
              className={"logoImage"}
              src={`${url}assets/front/img/partners-logos/${proposalInfo?.logo_image}`}
              alt="Proposal Logo"
            />

            <div className={"ol6"}>
              <p>
                <span className="label">Prop No:</span>{" "}
                <span className="value">{proposalInfo?.proposal_no}</span>
              </p>
              <p>
                <span className="label">Reg No:</span>{" "}
                <span className="value">{proposalInfo?.vehicle_reg_no}</span>
              </p>
              <p>
                <span className="label">IC Name:</span>{" "}
                <span className="value">{proposalInfo?.ic_name}</span>
              </p>
            </div>
          </div>
          <div className={"row"}>
            <div className={"col12"}>
              <p>
                <span className="label">Proposal No:</span>{" "}
                <span className="value">{proposalInfo?.proposal_no}</span>
              </p>
              <p>
                <span className="label">Inspection Type:</span>{" "}
                <span className="value">{proposalInfo?.inspection_type}</span>
              </p>
              <p>
                <span className="label">Registration No:</span>{" "}
                <span className="value">{proposalInfo?.vehicle_reg_no}</span>
              </p>
              <p>
                <span className="label">Registration Year:</span>{" "}
                <span className="value">{proposalInfo?.manf_year}</span>
              </p>
              <p>
                <span className="label">Make:</span>{" "}
                <span className="value">{proposalInfo?.make}</span>
              </p>
              <p>
                <span className="label">Model:</span>{" "}
                <span className="value">{proposalInfo?.make_model}</span>
              </p>
              <p>
                <span className="label">Variant:</span>{" "}
                <span className="value">{proposalInfo?.varient_name}</span>
              </p>
              <p>
                <span className="label">Engine No:</span>{" "}
                <span className="value">{proposalInfo?.engine_no}</span>
              </p>
              <p>
                <span className="label">Chassis No:</span>{" "}
                <span className="value">{proposalInfo?.chassis_no}</span>
              </p>
              {proposalStatusData?.proposal_data?.proposal_status ===
                "progress" && (
                <p>
                  <span className="label">Status:</span>
                  <span className="value">Under Review</span>
                </p>
              )}

              {proposalStatusData?.proposal_data?.proposal_status ===
                "rejected" && (
                <p>
                  <span className="label">Status:</span>
                  <span className="value">Rejected</span>
                </p>
              )}
              {proposalStatusData?.proposal_data?.proposal_status ===
                "rejected" && (
                <p>
                  <span className="label">Admin Comments:</span>
                  <span className="value">{proposalInfo?.admin_comment}</span>
                </p>
              )}
              {proposalStatusData?.proposal_data?.proposal_status ===
                "referBack" && (
                <p>
                  <span className="label">Admin Comments:</span>
                  <span className="value">{proposalInfo?.admin_comment}</span>
                </p>
              )}
              {proposalStatusData?.proposal_data?.proposal_status ===
                "referBack" && (
                <p>
                  <span className="label">Status:</span>
                  <span className="value">
                    Your Breakin has been ReferBack by admin please restart
                    Inspection
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className={"rowlogo"}>
            <button
              className={"customercare"}
              onClick={toggleCustomerCareModal}
            >
              <img src={CallIcon} alt="Call Icon" />
              <span>Call Customer Care</span>
            </button>
            {(proposalStatusData?.proposal_data?.proposal_status === "new" ||
              proposalStatusData?.proposal_data?.proposal_status ===
                "referBack") && (
              <button
                className={"StartInspection"}
                onClick={() =>     navigate('/InspectionCheckpoint', { replace: true })}
              >
                <img src={StartInspection} alt="Start Inspection Icon" />
                <span>Start Inspection</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>proposal not found</p>
      )}
    </div>
  );
};

export default ProposalInfoPage;

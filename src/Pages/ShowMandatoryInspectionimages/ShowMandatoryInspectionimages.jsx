/* eslint-disable */

import React, { useEffect, useState } from "react";
import "./ShowMandatoryInspectionimages.css"; // Import your CSS file
import { useLocation, useNavigate } from "react-router-dom";
import { convertImageToBase64, extractBase64FromDataURI } from "../../Utils/convertImageToBase64";
import { submit_inspection_Images } from "../../Api/submitInspectionQuestion";
import { fetch_Image_inspection_question } from "../../Api/fetchQuestion";
import Header from "../../Component/Header";
import { fetchDataLocalStorage } from "../../Utils/LocalStorage";
import InspectionModalRules from "../../Component/Modal/InspectionModalRules";

const ShowinspectionImages = ({ route }) => {
  const [IsInstructionModalVisible,setIsInstructionModalVisible]=useState(false)

  const [selectedImage, setSelectedImage] = useState(null);
  const [isRequestDone,setIsRequestDone]=useState(false)
  const [CurrentQuestion,setcurrentQuestion]=useState('');
  const [SubmittedQuestions,setSubmittedQuestions]=useState('');
  const [SubmittedImages,setsubmittedImages]=useState('');
  const [FailedArray,setFailedArray]=useState('');
  const [fetchedQuestion,setFetchedQuestion]=useState('');
  const [localdata, setLocaldata] = useState(null);



  const InstructioncloseModal = () => {
    setIsInstructionModalVisible(false);
    navigate('/VideoRecord',{replace:true})
  };

  const fetchDataFromLocalStorage = async () => {
    const localdata = await fetchDataLocalStorage('Claim_loginDetails')
    const proposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')

    if (localdata && proposalInfo) {
      setLocaldata(localdata?.pos_login_data)
      // setProposalInfo(proposalInfo)
    }
  }


  const [isLoading, setIsLoading] = useState(false);
const navigate =useNavigate()
  const { state } = useLocation();
  const { capturedImagesWithOverlay,proposalInfo } = state;

  const goNext=()=>{
setIsInstructionModalVisible(true)
  }



  const handleSubmit = () => {
    // setIsSubmitted(false); // Reset submitted state
    if (!isRequestDone) {
   

      FilterImages();
    }
  };

  async function submitQuestions(questionDataList) {
    const sortedList = questionDataList.sort((a, b) => {
      const questionIdA = parseInt(a.question_id, 10);
      const questionIdB = parseInt(b.question_id, 10);
      if (questionIdA < questionIdB) {
        return -1;
      } else if (questionIdA > questionIdB) {
        return 1;
      } else {
        return 0;
      }
    });
    setIsLoading(true);
    const failedSubmissionsArray = [];
    const questiondone = [];
    const questiondoneImages = [];
  
    try {
      for (const questionData of sortedList) {
        let data = {
          break_in_case_id: questionData?.break_in_case_id,
          question_id: questionData?.question_id,
          pos_id: localdata?.pos_login_data?.id,
          proposal_list_id: questionData?.proposal_list_id,
          ic_id: questionData?.ic_id,
          // answer_id: questionData?.answer_id,
          answer_id:extractBase64FromDataURI(questionData?.answer_id),

          inspection_type: questionData?.inspection_type,
          part: questionData?.part,
        };
        try {
          const submittedresponse = await submit_inspection_Images(
            data,
            'From Submit Function',
          );
          if (submittedresponse?.status) {
            setcurrentQuestion(questionData?.question_id);
            console.log(
              `Question ${questionData?.question_id} submitted successfully`,
            );
            questiondone.push(Number(questionData?.question_id));
            questiondoneImages.push(questionData?.part);
            console.log(
              questionData?.part,
              'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
            );
            setcurrentQuestion(data?.question_id)
          } else {
          }
        } catch (error) {
          console.error(
            `Error submitting question ${questionData?.question_id}: ${error.message}`,
          );
        }
        // Add delay of 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      setsubmittedImages(questiondoneImages);
      setSubmittedQuestions(questiondone);
    } catch (error) {
      console.log(`Error submitting questions: ${error.message}`);
    }
    setIsLoading(false);
    setFailedArray(failedSubmissionsArray);
    setIsRequestDone(true);
  }
  

   const fetchInspectionImages = async () => {
    if (localdata && proposalInfo) {
      setLocaldata(localdata?.pos_login_data)
    }

    const imageRes = await fetch_Image_inspection_question();
    console.log(imageRes.data);
    setFetchedQuestion(imageRes.data);
  };
  async function FilterImages() {
    const sendPOSTDATA = [];
    for (const questionId of fetchedQuestion) {
      capturedImagesWithOverlay.map(async image => {
        // console.log(questionId.name, image);
        if (image.part === questionId.name) {
          let data = {
            break_in_case_id: proposalInfo?.break_in_case_id,
            question_id: questionId?.id,
            pos_id: localdata?.pos_login_data?.id,
            proposal_list_id: proposalInfo?.id,
            ic_id: proposalInfo?.ic_id,
            answer_id: image?.uri,
            part: image.part,
            inspection_type: proposalInfo?.inspection_type,
          };

          sendPOSTDATA.push(data);
        }
      });
    }
    submitQuestions(sendPOSTDATA);
  }



  const handleImagePress = (uri) => {
    setSelectedImage(uri);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    fetchInspectionImages() ;
    fetchDataFromLocalStorage() ;}, []);
    useEffect(()=>{},[CurrentQuestion])


  return (
    <div style={{backgroundColor:'#F1FBFF'}}>
    <Header checkLocal={true}/> {/* Include the Header component */}

    <div className="container1">

      <div className="imageGrid">
        {capturedImagesWithOverlay?.map((item, index) => (
          <div key={index} className="imageContainer">
          
            <img
              className="image"
              src={item?.uri}
              alt={item?.part}
              onClick={() => handleImagePress(item.uri)}
            />
            <p className="overlayText">{item?.part}</p>
          </div>
        ))}
      </div>


      {
                  isRequestDone && FailedArray.length === 0 ? 

        <button onClick={goNext} >
          Next
        </button>
        :
        <button
        className="submitButton"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Submitting..." : "Submit"}
      </button>
        
        }

   

<InspectionModalRules
        isVisible={IsInstructionModalVisible}
        onClose={InstructioncloseModal}
        isVideo={true}
        
      />

      {isLoading && (
        <div className="loaderContainer">
          <div className="loaderContainer1">
          <div className="loader"></div>
          <p className="loaderText">{`${CurrentQuestion}/${capturedImagesWithOverlay.length+1} Submitting Question`}</p>
          </div>
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
    </div>
  );
};

export default ShowinspectionImages;

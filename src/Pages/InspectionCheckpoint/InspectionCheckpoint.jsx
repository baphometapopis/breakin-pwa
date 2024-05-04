/* eslint-disable */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./InspectionCheckpoint.css";
import { fetch_Checkpoint_inspection_question } from "../../Api/fetchQuestion";
import { submit_inspection_checkpointData } from "../../Api/submitInspectionQuestion";
import { fetchDataLocalStorage } from "../../Utils/LocalStorage";
import CommonModal from "../../Component/CommonModel";

export const InspectionCheckpoint = ({ route }) => {
  const [proposalInfo, setProposalInfo] = useState(null);
  const [localdata, setLocaldata] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("");
  const [submittedQuestion, setsubmittedQuestion] = useState([]);

  const [submissionStatus, setSubmissionStatus] = useState({}); // State to track submission status

  // const openModal = (message, type) => {
  //   setModalMessage(message);
  //   setModalType(type);
  //   setIsModalOpen(true);
  // };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [checkpointQuestion, setCheckpointQuestion] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCustomerCareModalVisible, setIsCustomerCareModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state
  const navigate = useNavigate();

  // Fetch checkpoint inspection questions
  const fetchQuestions = useCallback(async () => {
    console.log(submittedQuestion)
    const response = await fetch_Checkpoint_inspection_question();
    if (response.status) {
      setCheckpointQuestion(response.data);
      // Initialize error messages for each question
      const initialErrorMessages = {};
      response.data.forEach((question) => {
        initialErrorMessages[question.breakin_inspection_post_question_id] = "";
      });
      setErrorMessages(initialErrorMessages);
    }
   }, [submittedQuestion]);

  const getLabelForValue = (value) => {
    switch (value) {
      case 1:
        return "Safe";
      case 2:
        return "Scratch";
      case 3:
        return "Pressed";
      case 4:
        return "Broken";
      case 5:
        return "Good";
      case 6:
        return "Not Working";
      case 7:
        return "Not Available";
      default:
        return "";
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Function to handle radio button change
  const handleRadioChange = (questionId, answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });

    // Remove error message for the current question
    setErrorMessages({
      ...errorMessages,
      [questionId]: "",
    });
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    // if (allQuestionsAnswered()) {
    //   setIsSubmitting(true); // Start loading
    //   console.log("All questions answered:", selectedAnswers);
    //   await submitQuestions(selectedAnswers);
    //   openModal("All Question Submitted please click", "success")
    //   setIsSubmitting(false); // Stop loading
    // } else {
    //   // Display error messages for unanswered questions
    //   const updatedErrorMessages = {};
    //   checkpointQuestion.forEach((question) => {
    //     if (!selectedAnswers[question.breakin_inspection_post_question_id]) {
    //       updatedErrorMessages[question.breakin_inspection_post_question_id] =
    //         "This question is required";
    //     } else {
    //       updatedErrorMessages[question.breakin_inspection_post_question_id] =
    //         "";
    //     }
    //   });
    //   setErrorMessages(updatedErrorMessages);
    // }

    navigate('/camera')
  };

  // Function to submit questions
  // eslint-disable-next-line
  async function submitQuestions(questionDataList) {
    const retryArray = [];
    const failedSubmissionsArray = [];
    const questiondone = [];

    try {
      for (const [index, [questionId, answer]] of Object.entries(
        questionDataList
      ).entries()) {
        const data = {
          break_in_case_id: proposalInfo?.break_in_case_id,
          question_id: questionId,
          pos_id: localdata?.pos_login_data?.id,
          proposal_list_id: proposalInfo?.id,
          ic_id: proposalInfo?.ic_id,
          answer_id: parseInt(answer),
          inspection_type: proposalInfo?.inspection_type,
        };

        console.log(data);
        try {
          const submittedresponse = await submit_inspection_checkpointData(
            data
          );
          if (submittedresponse?.status) {
            console.log(`Question ${questionId} submitted successfully`);
            questiondone.push(Number(questionId));
            // Update submission status for this question to true
            updateSubmissionStatus(questionId, true);
          }
        } catch (error) {
          console.error(
            `Error submitting question ${questionId}: ${error.message}`
          );
          if (answer > 1) {
            retryArray.push(questionId);
          } else {
            failedSubmissionsArray.push(questionId);
          }
          // Update submission status for this question to false
          updateSubmissionStatus(questionId, false);
        }

        // Add a delay between API calls
        const delayDuration = 3000; // 3 seconds
        if (
          index < Object.entries(questionDataList).length - 1 &&
          !isSubmitting
        ) {
          await new Promise((resolve) => setTimeout(resolve, delayDuration));
        }
      }

      console.log("All questions submitted successfully", questiondone);
      setsubmittedQuestion(questiondone)
      console.log("Failed submissions:", failedSubmissionsArray);
    } catch (error) {
      console.error(`Error submitting questions: ${error.message}`);
    }
  }

  const isQuestionSubmitted = (questionId) => {
    return selectedAnswers.hasOwnProperty(questionId);
  };
  

  // Function to update submission status for a question
  const updateSubmissionStatus = (questionId, status) => {
    setSubmissionStatus({
      ...submissionStatus,
      [questionId]: status,
    });
  };

  // Function to check if all questions have been answered
  // const allQuestionsAnswered = () => {
  //   for (const question of checkpointQuestion) {
  //     if (!selectedAnswers[question.breakin_inspection_post_question_id]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // };

  const fetchDataFromLocalStorage = async () => {
    const localdata = await fetchDataLocalStorage('Claim_loginDetails')
    const proposalInfo = await fetchDataLocalStorage('Claim_proposalDetails')

    if (localdata && proposalInfo) {
      setLocaldata(localdata?.pos_login_data)
      setProposalInfo(proposalInfo)
    }
  }

  useEffect(() => {
    fetchDataFromLocalStorage()
  }, [])

  return (
    <div className="container">
      <CommonModal isOpen={isModalOpen} onClose={closeModal} message={modalMessage} type={modalType} />

      <div className={"optionCard"}>
        {checkpointQuestion.map((question) => (
          <div key={question.breakin_inspection_post_question_id}>
            <p>{question.question}</p>
            {/* Render label based on submission status */}
            <span>{isQuestionSubmitted[question.breakin_inspection_post_question_id]}</span>
            <div className="options">
              {Object.keys(question.answers_obj).map((answerId) => (
                <div key={answerId}>
                  <input
                    type="radio"
                    id={`answer_${question.breakin_inspection_post_question_id}_${answerId}`}
                    name={`question_${question.breakin_inspection_post_question_id}`} // Unique name attribute
                    value={answerId}
                    checked={
                      String(selectedAnswers[
                        question.breakin_inspection_post_question_id
                      ]) === String(answerId)
                    }
                    onChange={() =>
                      handleRadioChange(
                        question.breakin_inspection_post_question_id,
                        String(answerId)
                      )
                    }
                  />
                  <label
                    htmlFor={`answer_${question.breakin_inspection_post_question_id}_${answerId}`}
                  >
                    {getLabelForValue(question.answers_obj[answerId])}
                  </label>
                </div>
              ))}
            </div>
            <span className="error">
              {errorMessages[question.breakin_inspection_post_question_id]}
            </span>
          </div>
        ))}

        <button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default InspectionCheckpoint;

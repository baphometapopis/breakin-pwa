import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './InspectionCheckpoint.css'
import { CallIcon, StartInspection } from "../../Constant/ImageConstant";
import { fetch_Checkpoint_inspection_question } from "../../Api/fetchQuestion";

export const InspectionCheckpoint = ({ route }) => {
  const { proposalNumber } = useParams(); //extract proposal number

  const [checkpointQuestion, setCheckpointQuestion] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isCustomerCareModalVisible, setIsCustomerCareModalVisible] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const navigate = useNavigate();

  // Fetch checkpoint inspection questions
  const fetchQuestions = useCallback(async () => {
    const response = await fetch_Checkpoint_inspection_question();
    if (response.status) {
      setCheckpointQuestion(response.data);
      // Initialize error messages for each question
      const initialErrorMessages = {};
      response.data.forEach(question => {
        initialErrorMessages[question.breakin_inspection_post_question_id] = "";
      });
      setErrorMessages(initialErrorMessages);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Function to handle radio button change
  const handleRadioChange = (questionId, answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId,
    });

    console.log(selectedAnswers)
  };

  // Function to check if all questions have been answered
  const allQuestionsAnswered = () => {
    for (const question of checkpointQuestion) {
      if (!selectedAnswers[question.breakin_inspection_post_question_id]) {
        return false;
      }
    }
    return true;
  };

  // Function to handle form submission
  const handleSubmit = () => {
    if (allQuestionsAnswered()) {
      console.log("All questions answered:", selectedAnswers);
      // Proceed with further actions such as submitting data or navigating
      // Example: navigate("/next-page");
    } else {
      // Display error messages for unanswered questions
      const updatedErrorMessages = {};
      checkpointQuestion.forEach(question => {
        if (!selectedAnswers[question.breakin_inspection_post_question_id]) {
          updatedErrorMessages[question.breakin_inspection_post_question_id] = "This question is required";
        } else {
          updatedErrorMessages[question.breakin_inspection_post_question_id] = "";
        }
      });
      setErrorMessages(updatedErrorMessages);
    }
  };

  return (
    <div className="container">
      <div className={"optionCard"}>
      {checkpointQuestion.map(question => (
  <div key={question.breakin_inspection_post_question_id}>
    <p>{question.question}</p>
    <div className="options">
      {Object.keys(question.answers_obj).map(answerId => (
        <div key={answerId}>
          <input
            type="radio"
            id={`answer_${question.breakin_inspection_post_question_id}_${answerId}`}
            name={`question_${question.breakin_inspection_post_question_id}`} // Unique name attribute
            value={answerId}
            checked={selectedAnswers[question.breakin_inspection_post_question_id] === parseInt(answerId)}
            onChange={() => handleRadioChange(question.breakin_inspection_post_question_id, parseInt(answerId))}
          />
          <label htmlFor={`answer_${question.breakin_inspection_post_question_id}_${answerId}`}>
            {question.answers_obj[answerId]}
          </label>
        </div>
      ))}
    </div>
    <span className="error">{errorMessages[question.breakin_inspection_post_question_id]}</span>
  </div>
))}

      <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default InspectionCheckpoint;

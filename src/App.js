// App.js
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import CameraScreen from "./Pages/CameraScreen/CameraScreen";
import ProposalInfoPage from "./Pages/ProposalInfoPage/ProposalInfoPage";
import ShowinspectionImages from "./Pages/ShowMandatoryInspectionimages/ShowMandatoryInspectionimages";
import VideoRecorder from "./Pages/VideoRecord";
import VideoPreview from "./Pages/VideoPreview";
import InspectionCheckpoint from "./Pages/InspectionCheckpoint/InspectionCheckpoint";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/proposal-info/:proposalNumber"
          element={<ProposalInfoPage />}
        />
        <Route
          path="/InspectionCheckpoint"
          element={<InspectionCheckpoint />}
        />
        <Route path="/camera" element={<CameraScreen />} />
        <Route
          path="/ShowInspectionImages"
          element={<ShowinspectionImages />}
        />
        <Route path="/VideoRecord" element={<VideoRecorder />} />
        <Route path="/VideoPreview" element={<VideoPreview />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// App.js
import { Routes, Route, BrowserRouter } from "react-router-dom";
import HomePage from "./Pages/Home/HomePage";
import CameraScreen from "./Pages/CameraScreen/CameraScreen";
import ProposalInfoPage from "./Pages/ProposalInfoPage/ProposalInfoPage";
import ShowinspectionImages from "./Pages/ShowMandatoryInspectionimages/ShowMandatoryInspectionimages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/proposal-info/:proposalNumber"
          element={<ProposalInfoPage />}
        />
        <Route path="/camera" element={<CameraScreen />} />
        <Route path="/ShowInspectionImages" element={<ShowinspectionImages />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;

// App.js
import { Routes, Route, BrowserRouter } from "react-router-dom";
import ProposalInfoPage from "./Pages/ProposalInfoPage/ProposalInfoPage";

import HomePage from "./Pages/ProposalInfoPage/Home/HomePage";
import CameraScreen from "./Pages/ProposalInfoPage/CameraScreen";
 
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import "./App.css";
import Camera from "./Pages/CameraScreen/CameraScreen";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <h1>React Camera App</h1>
      </header> */}
      <main>
        <Camera />
      </main>
    </div>
  );
}

export default App;

// // App.js
// import { Routes, Route, BrowserRouter } from "react-router-dom";
// import HomePage from "./Pages/Home/HomePage";
// import CameraScreen from "./Pages/CameraScreen/CameraScreen";
// import ProposalInfoPage from "./Pages/ProposalInfoPage/ProposalInfoPage";
// import ShowinspectionImages from "./Pages/ShowMandatoryInspectionimages/ShowMandatoryInspectionimages";
// import VideoRecorder from "./Pages/VideoRecord";
// import VideoPreview from "./Pages/VideoPreview";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route
//           path="/proposal-info/:proposalNumber"
//           element={<ProposalInfoPage />}
//         />
//         <Route path="/camera" element={<CameraScreen />} />
//         <Route
//           path="/ShowInspectionImages"
//           element={<ShowinspectionImages />}
//         />
//         <Route path="/VideoRecord" element={<VideoRecorder />} />
//         <Route path="/VideoPreview" element={<VideoPreview />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

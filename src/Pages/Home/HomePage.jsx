import React from "react";
import "./home.css"; // Import CSS file

const HomePage = () => {
  return (
    <div className="container">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button>Search</button>
      </div>
    </div>
  );
};

export default HomePage;

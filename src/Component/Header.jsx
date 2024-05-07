/* eslint-disable */

import React from "react";
import { Logo, Logo1 } from "../Constant/ImageConstant";

const Header = () => {
  return (
    <header style={{padding:'10px',backgroundColor:'white',boxShadow:'rgba(0, 0, 0, 0.25) 0px 0.0625em 0.0625em, rgba(0, 0, 0, 0.25) 0px 0.125em 0.5em, rgba(255, 255, 255, 0.1) 0px 0px 0px 1px inset'}} className="header">
      <div className="logo-container">
       <img src={Logo1} alt="Logo" style={{width:'150px'}} />
      </div>
    </header>
  );
};

export default Header;

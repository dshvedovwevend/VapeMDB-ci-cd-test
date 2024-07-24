import React from "react";
import logo from "../Assets/your_logo.png";

const Header = () => {
  return (
    <div className="Header mt-2 mb-3">
      <div className="Logo">
        <img src={logo} alt="Logo" />
      </div>
    </div>
  );
};

export default Header;

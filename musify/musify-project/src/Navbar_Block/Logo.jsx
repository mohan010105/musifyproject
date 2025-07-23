import React from "react";
import logo from "../assets/logo-removebg-preview.png"; // Adjust path as needed

const Logo = () => {
  return (
    <div className="font-bold text-2xl flex items-center space-x-2 left-10">
      <img src={logo} alt="Musify Logo" className="h-25 w-25 ml-auto rounded-full" />
      <span>Musify</span>
    </div>
  );
};

export default Logo;


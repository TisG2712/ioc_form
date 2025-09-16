import React from "react";
import bgImage from "../../assets/images/ioc_background.png";

const Inllustration = () => {
  return (
    <div className="hidden md:block w-1/2 h-screen overflow-hidden">
      <img
        src={bgImage}
        alt="Illustration Background"
        className="w-full h-full object-cover"
        style={{ maxHeight: "100vh" }}
      />
    </div>
  );
};

export default Inllustration;

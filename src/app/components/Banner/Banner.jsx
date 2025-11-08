import React from "react";
import "./Banner.css";
import Image from "next/image";
const Banner = () => {
  return (
    <div className="sgi-home-banner">
      <div className="banner_right">
        <span>Limited time offer </span>
        <h1>
          Professional Cleaning Solution <span>For Every Business</span>
        </h1>
        <p>
          Stock up on premium cleaning supplies at wholesale prices . perfect
          for hotels, restaurants, offices, healthcare facilities, and cleaning
          services companies .
        </p>
      </div>
      <div className="banner_left"></div>
    </div>
  );
};

export default Banner;

import Image from "next/image";
import React from "react";
import "./Banner2.css";
const Banner2 = () => {
  return (
    <div className="banner2">
      <Image
        src={"/images/BannerCarWash.webp"}
        alt="banner image"
        width={3000}
        height={3000}
      />
    </div>
  );
};

export default Banner2;

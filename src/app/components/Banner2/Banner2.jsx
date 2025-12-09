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
      <div className="banner2_content">
        <h2>Lorem Ipsum is simply dummy</h2>
        <button>
          <a href="/shop">Shop Now</a>
        </button>
      </div>
    </div>
  );
};

export default Banner2;

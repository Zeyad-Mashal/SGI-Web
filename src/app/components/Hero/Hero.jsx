import React from "react";
import "./Hero.css";
import Image from "next/image";
const Hero = ({ params }) => {
  return (
    <div className="hero">
      <div className="hero_left">
        <span>B2B Solution</span>
        <h1>Premium Wholesale Cleaning & Hygiene Products For Your Business</h1>
        <p>
          Professional-grade cleaning supplies trusted by thousands of companies
          .Get sale pricing , competitive B2B pricing , and flexible credit
          options .
        </p>
        <a href="#">Shop Now</a>
      </div>
      <div className="hero_right">
        <Image
          src={"/images/B1F.jpg"}
          alt="hero section navbar"
          loading="lazy"
          width={500}
          height={500}
        />
        <Image
          src={"/images/B2F.jpg"}
          alt="hero section navbar"
          loading="lazy"
          width={500}
          height={500}
        />
      </div>
    </div>
  );
};

export default Hero;

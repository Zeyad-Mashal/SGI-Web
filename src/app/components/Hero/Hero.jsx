"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import "./Hero.css";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Hero = () => {
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    const lang = localStorage.getItem("lang") || "en";

    if (lang === "ar") {
      setTranslations(ar);
    } else {
      setTranslations(en);
    }
  }, []);
  return (
    <div className="hero">
      <div className="hero_left">
        <Image
          className="hero_lcp_image"
          src="/images/home-banner.png"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 100vw"
          quality={82}
        />
        <Image
          className="hero_mob_image"
          src="/images/hero-banner.jpeg"
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={82}
        />
        {/* <div className="hero_overlay"></div> */}
      </div>
      <div className="hero_right">
        <div className="hero_right_img1"></div>
        <div className="hero_right_img2"></div>
      </div>
    </div>
  );
};

export default Hero;

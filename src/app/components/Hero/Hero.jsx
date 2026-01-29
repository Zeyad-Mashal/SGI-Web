"use client";
import React, { useState, useEffect } from "react";
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
        <div className="hero_overlay"></div>
        <div className="hero_content">
          <span>{translations.b2bsolution}</span>
          <h1>{translations.premiumwholesalecleaninghygieneproducts}</h1>
          <p>
            {translations.professionalgradecleaningsuppliestrustedbythousands}
          </p>
          <a href="/shop">{translations.shopnow}</a>
        </div>
      </div>
      <div className="hero_right">
        <div className="hero_right_img1"></div>
        <div className="hero_right_img2"></div>
      </div>
    </div>
  );
};

export default Hero;

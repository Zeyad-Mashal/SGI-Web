"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import "./Banner2.css";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Banner2 = () => {
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
    <div className="banner2">
      <Image
        src={"/images/BannerCarWash.webp"}
        alt="banner image"
        width={3000}
        height={3000}
      />
      <div className="banner2_content">
        <h2>{translations.banner2title}</h2>
        <button>
          <a href="/shop">{translations.shopnow}</a>
        </button>
      </div>
    </div>
  );
};

export default Banner2;

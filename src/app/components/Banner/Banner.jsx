"use client";
import { useState, useEffect } from "react";
import React from "react";
import "./Banner.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt } from "@fortawesome/free-solid-svg-icons";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Banner = () => {
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
    <div className="sgi-home-banner">
      <div className="sgi-home-banner_container">
        <div className="overlay"></div>
        <div className="banner_right">
          <span>{translations.limitedtimeoffer}</span>
          <h1>
            {translations.professionalcleaningsolution}{" "}
            <span>{translations.foreverybusiness}</span>
          </h1>
          <p>
            {translations.stockuponpremiumcleaningsuppliesatwholesaleprices}
          </p>
          <div className="banner_right_imgs">
            <Image
              src={"/images/banner1-removebg-preview.png"}
              width={150}
              height={150}
              alt="banner1"
              loading="lazy"
            />
            <Image
              src={"/images/banner2-removebg-preview.png"}
              width={150}
              height={150}
              alt="banner1"
              loading="lazy"
            />
          </div>
          <div className="banner_btns">
            <button className="banner_btn1">
              <a href="/shop">{translations.shopnow}</a>
            </button>
            <button className="banner_btn2">{translations.contactus}</button>
          </div>
        </div>
        {/* <div className="banner_left">
          <div className="banner_left_free">
            <p>{translations.freeshipping}</p>
            <h3>+500$</h3>
          </div>
          <div className="banner_left_main">
            <p>
              <FontAwesomeIcon icon={faBolt} /> {translations.exclusivedeal}
            </p>
            <h1>{translations.wholesalebenefits}</h1>
            <span>{translations.premiumproductsatunbeatableprices}</span>
            <div className="banner_left_main_products">
              <div className="banner_left_main_product">
                <Image
                  src={"/images/p1.png"}
                  alt="product banner"
                  loading="lazy"
                  width={150}
                  height={150}
                />
                <div className="banner_left_main_product_info">
                  <h3>{translations.handsanitizer}</h3>
                  <span> 40{translations.aed}</span>
                </div>
              </div>
              <div className="banner_left_main_product">
                <Image
                  src={"/images/p1.png"}
                  alt="product banner"
                  loading="lazy"
                  width={150}
                  height={150}
                />
                <div className="banner_left_main_product_info">
                  <h3>{translations.handsanitizer}</h3>
                  <span>
                    {translations.from}40{translations.aed}
                  </span>
                </div>
              </div>
            </div>
            <hr />
            <div className="banner_left_main_stats">
              <div className="banner_left_main_stat">
                <h2>500+</h2>
                <span>{translations.orders}</span>
              </div>
              <div className="banner_left_main_stat">
                <h2>24h</h2>
                <span>{translations.delivery}</span>
              </div>
              <div className="banner_left_main_stat">
                <h2>100%</h2>
                <span>{translations.quality}</span>
              </div>
            </div>
          </div>

          <div className="banner_left_save">
            <p>{translations.save}</p>
            <h3>40%</h3>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Banner;

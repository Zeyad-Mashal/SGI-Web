"use client";
import React, { useState, useEffect } from "react";
import "./Featrues.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLock,
  faTruckFast,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { RiCustomerService2Line } from "react-icons/ri";
import { LiaShippingFastSolid } from "react-icons/lia";
import { TfiLoop } from "react-icons/tfi";
import { GrSecure } from "react-icons/gr";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Featrues = () => {
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
    <div className="featrues">
      <div className="features_container">
        <div className="featrues_item">
          <RiCustomerService2Line />

          <div className="featrues_item_1">
            <h2>{translations.responsive}</h2>
            <p>{translations.customerserviceavailable247}</p>
          </div>
        </div>

        <div className="featrues_item">
          <GrSecure />

          <div className="featrues_item_1">
            <h2>{translations.secure}</h2>
            <p>{translations.certifiedmarketplacesince2020}</p>
          </div>
        </div>

        <div className="featrues_item">
          <LiaShippingFastSolid />

          <div className="featrues_item_1">
            <h2>{translations.shipping}</h2>
            <p>{translations.freefastandreliableworldwide}</p>
          </div>
        </div>

        <div className="featrues_item">
          <TfiLoop />

          <div className="featrues_item_1">
            <h2>{translations.transparent}</h2>
            <p>{translations.hasslefreereturnpolicy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featrues;

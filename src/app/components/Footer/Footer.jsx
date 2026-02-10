"use client";
import React, { useState, useEffect } from "react";
import "./Footer.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXTwitter,
  faSquareFacebook,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const Footer = () => {
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
    <div className="Footer">
      <div className="Footer_container">
        <div className="Footer_logo">
          <Image
            src={"/images/logo-black.png"}
            alt="footer logo"
            loading="lazy"
            width={200}
            height={200}
          />
          <p>{translations.footerdescription}</p>
        </div>
        <div className="footer_company">
          <h3>{translations.company}</h3>
          <ul>
            <li><a href="/">{translations.home}</a></li>
            <li><a href="/shop">{translations.shop}</a></li>
            {/* <li><a href="/">{translations.aboutus}</a></li> */}
          </ul>
        </div>
        <div className="footer_company">
          <h3>{translations.support}</h3>
          <ul>
            <li><a href="tel:+971565088475" target="_blank">{translations.contactus}</a></li>
          </ul>
        </div>
        <div className="footer_company">
          <h3>{translations.resources}</h3>
          <ul>
            {/* <li>{translations.helpcenter}</li>
            <li>{translations.faqs}</li> */}
            <li><a href="/returns">{translations.termsofservice}</a></li>
            <li><a href="/Privacy">{translations.privacypolicy}</a></li>
          </ul>
        </div>
      </div>
      <hr />
      <div className="footer_copyright">
        <p>{translations.allrightsreserved}</p>
        <div className="footer_social">
          <FontAwesomeIcon icon={faXTwitter} />
          <FontAwesomeIcon icon={faSquareFacebook} />
          <FontAwesomeIcon icon={faInstagram} />
          <FontAwesomeIcon icon={faLinkedin} />
        </div>
      </div>
    </div>
  );
};

export default Footer;

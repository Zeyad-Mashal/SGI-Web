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
            <li>{translations.home}</li>
            <li>{translations.shop}</li>
            <li>{translations.aboutus}</li>
          </ul>
        </div>
        <div className="footer_company">
          <h3>{translations.support}</h3>
          <ul>
            <li>{translations.contactus}</li>
          </ul>
        </div>
        <div className="footer_company">
          <h3>{translations.resources}</h3>
          <ul>
            <li>{translations.helpcenter}</li>
            <li>{translations.faqs}</li>
            <li>{translations.termsofservice}</li>
            <li>{translations.privacypolicy}</li>
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

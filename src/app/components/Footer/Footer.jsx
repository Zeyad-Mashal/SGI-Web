"use client";
import React, { useState, useEffect } from "react";
import "./Footer.css";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faSquareFacebook,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { SOCIAL_LINKEDIN, SOCIAL_FACEBOOK, SOCIAL_INSTAGRAM } from "@/constants/contact";
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
          <a href={SOCIAL_LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
          <a href={SOCIAL_FACEBOOK} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FontAwesomeIcon icon={faSquareFacebook} />
          </a>
          <a href={SOCIAL_INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;

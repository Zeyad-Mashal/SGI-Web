"use client";
import React, { useState, useEffect } from "react";
import "./ContactUs.css";
import { FiPhone } from "react-icons/fi";
import { SlLocationPin } from "react-icons/sl";
import { AiOutlineMail } from "react-icons/ai";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";
const ContactUs = () => {
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
    <div className="ContactUs">
      <div className="contactUS_container">
        <h1>{translations.contactus}</h1>
        <p>{translations.contactustostartyourjourneytoday}</p>
        <div className="ContactUs_list">
          <div className="ContactUs_item">
            <AiOutlineMail />

            <h3>{translations.email}</h3>
            <p>{translations.office} : hello@skyline.co</p>
            <div className="ContactUs_item_btn">
              <button>
                <a href="mailto:hello@skyline.co" target="_blanck">
                  {translations.contactus}
                </a>
              </button>
              <p>*{translations.available24hrs}</p>
            </div>
          </div>
          <div className="ContactUs_item">
            <FiPhone />
            <h3>{translations.phone}</h3>
            <p>{translations.office} : +91 8932-1151-22</p>
            <div className="ContactUs_item_btn">
              <button>
                <a href="tel:+201205222331" target="_blanck">
                  {translations.contactus}
                </a>
              </button>
              <p>*{translations.available24hrs}</p>
            </div>
          </div>
          <div className="ContactUs_item">
            <SlLocationPin />

            <h3>{translations.location}</h3>
            <p>{translations.office} : 123 Maple Street, Springfield</p>
            <div className="ContactUs_item_btn">
              <button>
                <a
                  href="https://maps.app.goo.gl/9hJnb1rssfoAHoYPA"
                  target="_blanck"
                >
                  {translations.contactus}
                </a>
              </button>
              <p>*{translations.available24hrs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

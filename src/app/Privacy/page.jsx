"use client";
import React, { useState, useEffect } from "react";
import "./Privacy.css";
import en from "../../translation/en.json";
import ar from "../../translation/ar.json";
import {
  CONTACT_PHONE,
  CONTACT_EMAIL,
  CONTACT_WHATSAPP_URL,
} from "@/constants/contact";

const Privacy = () => {
  const [translations, setTranslations] = useState(en);
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);

    if (savedLang === "ar") {
      setTranslations(ar);
    } else {
      setTranslations(en);
    }
  }, []);

  // Convert newlines to <br> tags
  const formatContent = (content) => {
    return content.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Format contact content: email → mailto, phone → WhatsApp, phone in dir="ltr" for RTL
  const formatContentWithPhone = (content) => {
    const regex = new RegExp(
      `(${CONTACT_EMAIL.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|\\+971\\s*565088475)`,
      "g",
    );
    return content.split("\n").map((line, index) => {
      const parts = line.split(regex).filter(Boolean);
      return (
        <React.Fragment key={index}>
          {parts.map((part, i) => {
            if (part === CONTACT_EMAIL) {
              return (
                <a key={i} href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              );
            }
            if (part.replace(/\s/g, "") === "+971565088475") {
              return (
                <a
                  key={i}
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span dir="ltr">{CONTACT_PHONE}</span>
                </a>
              );
            }
            return <React.Fragment key={i}>{part}</React.Fragment>;
          })}
          {index < content.split("\n").length - 1 && <br />}
        </React.Fragment>
      );
    });
  };

  return (
    <div className="privacy">
      <div className="privacy_container">
        {/* Terms & Conditions Section */}
        <section className="privacy_section">
          <h1 className="privacy_main_title">{translations.termsTitle}</h1>

          <div className="privacy_item">
            <h2>{translations.terms.whoWeAre.title}</h2>
            <p>{formatContent(translations.terms.whoWeAre.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.acceptance.title}</h2>
            <p>{formatContent(translations.terms.acceptance.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.eligibility.title}</h2>
            <p>{formatContent(translations.terms.eligibility.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.platformUse.title}</h2>
            <p>{formatContent(translations.terms.platformUse.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.orders.title}</h2>
            <p>{formatContent(translations.terms.orders.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.shipping.title}</h2>
            <p>{formatContent(translations.terms.shipping.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.returns.title}</h2>
            <p>{formatContent(translations.terms.returns.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.promotions.title}</h2>
            <p>{formatContent(translations.terms.promotions.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.reviews.title}</h2>
            <p>{formatContent(translations.terms.reviews.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.intellectualProperty.title}</h2>
            <p>
              {formatContent(translations.terms.intellectualProperty.content)}
            </p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.thirdParty.title}</h2>
            <p>{formatContent(translations.terms.thirdParty.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.platformUseDesc.title}</h2>
            <p>{formatContent(translations.terms.platformUseDesc.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.amendments.title}</h2>
            <p>{formatContent(translations.terms.amendments.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.governingLaw.title}</h2>
            <p>{formatContent(translations.terms.governingLaw.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.terms.contact.title}</h2>
            <p>{formatContentWithPhone(translations.terms.contact.content)}</p>
          </div>
        </section>

        {/* Privacy Policy Section */}
        <section className="privacy_section">
          <h1 className="privacy_main_title">{translations.privacyTitle}</h1>

          <div className="privacy_item">
            <h2>{translations.privacy.overview.title}</h2>
            <p>{formatContent(translations.privacy.overview.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.dataWeCollect.title}</h2>
            <p>{formatContent(translations.privacy.dataWeCollect.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.howWeCollect.title}</h2>
            <p>{formatContent(translations.privacy.howWeCollect.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.whyWeUse.title}</h2>
            <p>{formatContent(translations.privacy.whyWeUse.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.dataSharing.title}</h2>
            <p>{formatContent(translations.privacy.dataSharing.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.cookies.title}</h2>
            <p>{formatContent(translations.privacy.cookies.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.dataRetention.title}</h2>
            <p>{formatContent(translations.privacy.dataRetention.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.informationSecurity.title}</h2>
            <p>
              {formatContent(translations.privacy.informationSecurity.content)}
            </p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.yourRights.title}</h2>
            <p>{formatContent(translations.privacy.yourRights.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.policyUpdates.title}</h2>
            <p>{formatContent(translations.privacy.policyUpdates.content)}</p>
          </div>

          <div className="privacy_item">
            <h2>{translations.privacy.contact.title}</h2>
            <p>
              {formatContentWithPhone(translations.privacy.contact.content)}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;

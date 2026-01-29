"use client";
import React, { useState, useEffect } from 'react';
import "./returns.css";
import en from "../../translation/en.json";
import ar from "../../translation/ar.json";

const Returns = () => {
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
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className='returns'>
      <div className="returns_container">
        <section className="returns_section">
          <h1 className="returns_main_title">{translations.returnsTitle}</h1>
          
          <div className="returns_item">
            <h2>{translations.returns.policyObjective.title}</h2>
            <p>{formatContent(translations.returns.policyObjective.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.whenCanRequest.title}</h2>
            <p>{formatContent(translations.returns.whenCanRequest.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.casesAccepted.title}</h2>
            <p>{formatContent(translations.returns.casesAccepted.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.casesNotAccepted.title}</h2>
            <p>{formatContent(translations.returns.casesNotAccepted.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.howToSubmit.title}</h2>
            <p>{formatContent(translations.returns.howToSubmit.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.returnSteps.title}</h2>
            <p>{formatContent(translations.returns.returnSteps.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.exchanges.title}</h2>
            <p>{formatContent(translations.returns.exchanges.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.feesShipping.title}</h2>
            <p>{formatContent(translations.returns.feesShipping.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.refundProcess.title}</h2>
            <p>{formatContent(translations.returns.refundProcess.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.refundDelayed.title}</h2>
            <p>{formatContent(translations.returns.refundDelayed.content)}</p>
          </div>

          <div className="returns_item">
            <h2>{translations.returns.contact.title}</h2>
            <p>{formatContent(translations.returns.contact.content)}</p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Returns;

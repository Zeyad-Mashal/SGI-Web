"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./SuccessModal.css";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";

const SuccessModal = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);

  useEffect(() => {
    // Get language from localStorage
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);

    // Listen for language changes
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      setLang(newLang);
      setTranslations(newLang === "ar" ? ar : en);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check periodically for language changes
    const interval = setInterval(() => {
      const currentLang = localStorage.getItem("lang") || "en";
      if (currentLang !== lang) {
        setLang(currentLang);
        setTranslations(currentLang === "ar" ? ar : en);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [lang]);

  useEffect(() => {
    if (isOpen) {
      // Auto-close and redirect after 5 seconds
      const timer = setTimeout(() => {
        onClose();
        router.push("/");
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose, router]);

  const handleGoHome = () => {
    onClose();
    router.push("/");
  };

  if (!isOpen) return null;

  return (
    <div className="success-modal-overlay" onClick={handleGoHome}>
      <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="success-modal-icon">
          <svg
            className="checkmark"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 52 52"
          >
            <circle
              className="checkmark-circle"
              cx="26"
              cy="26"
              r="25"
              fill="none"
            />
            <path
              className="checkmark-check"
              fill="none"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>
        <h2 className="success-modal-title">{translations.yourRequestSetSuccessfully}</h2>
        <p className="success-modal-message">
          {translations.weTakeItIntoConsideration}
        </p>
        <button className="success-modal-button" onClick={handleGoHome}>
          {translations.goToHome}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;


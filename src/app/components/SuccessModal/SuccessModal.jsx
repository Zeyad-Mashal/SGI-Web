"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import "./SuccessModal.css";
import en from "../../../translation/en.json";
import ar from "../../../translation/ar.json";

const SuccessModal = ({
  isOpen,
  onClose,
  title,
  message,
  autoCloseDelay = 2800,
  redirectOnClose = true,
}) => {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [translations, setTranslations] = useState(en);
  const [closing, setClosing] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeTimeoutRef = useRef(null);

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);
    setTranslations(savedLang === "ar" ? ar : en);
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      setLang(newLang);
      setTranslations(newLang === "ar" ? ar : en);
    };
    window.addEventListener("storage", handleStorageChange);
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
      setClosing(false);
      setVisible(true);
      const timer = setTimeout(() => {
        setClosing(true);
        closeTimeoutRef.current = setTimeout(() => {
          onClose?.();
          if (redirectOnClose) router.push("/");
          setVisible(false);
        }, 420);
      }, autoCloseDelay);
      return () => {
        clearTimeout(timer);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      };
    } else {
      setVisible(false);
      setClosing(false);
    }
  }, [isOpen, autoCloseDelay, onClose, redirectOnClose, router]);

  const handleGoHome = () => {
    setClosing(true);
    setTimeout(() => {
      onClose?.();
      if (redirectOnClose) router.push("/");
      setVisible(false);
    }, 380);
  };

  if (!isOpen && !visible) return null;

  const displayTitle = title ?? translations.yourRequestSetSuccessfully;
  const displayMessage = message ?? translations.weTakeItIntoConsideration;

  return (
    <div
      className={`success-modal-overlay ${closing ? "success-modal-overlay--exit" : ""}`}
      onClick={handleGoHome}
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div
        className={`success-modal-content ${closing ? "success-modal-content--exit" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
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
        <h2 id="success-modal-title" className="success-modal-title">
          {displayTitle}
        </h2>
        <p className="success-modal-message">{displayMessage}</p>
        <div className="success-modal-progress" />
        <button className="success-modal-button" onClick={handleGoHome}>
          {translations.goToHome}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;

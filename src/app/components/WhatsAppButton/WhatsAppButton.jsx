"use client";
import { useEffect, useState } from "react";
import "./WhatsAppButton.css";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
  const [lang, setLang] = useState("en");
  const phoneNumber = "201205222331";
  const whatsappUrl = `https://wa.me/${phoneNumber}`;

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") || "en";
    setLang(savedLang);

    // الاستماع لتغييرات اللغة
    const handleStorageChange = () => {
      const newLang = localStorage.getItem("lang") || "en";
      setLang(newLang);
    };

    window.addEventListener("storage", handleStorageChange);
    
    // فحص اللغة كل 500ms للتحديث الفوري
    const interval = setInterval(() => {
      const currentLang = localStorage.getItem("lang") || "en";
      if (currentLang !== lang) {
        setLang(currentLang);
      }
    }, 500);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [lang]);

  const handleClick = () => {
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className={`whatsapp_button ${lang === "ar" ? "rtl" : "ltr"}`}
      onClick={handleClick}
      title="Contact us on WhatsApp"
    >
      <FaWhatsapp className="whatsapp_icon" />
    </div>
  );
};

export default WhatsAppButton;


"use client";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import { usePathname } from "next/navigation";
import { ToastProvider } from "@/context/ToastContext";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [lang, setLang] = useState("en");

  // الصفحات اللي مش عايز يظهر فيها navbar/footer
  const hiddenPaths = ["/login", "/register"];
  const hideLayout = hiddenPaths.includes(pathname);

  useEffect(() => {
    let savedLang = localStorage.getItem("lang");

    if (!savedLang) {
      savedLang = "en";
      localStorage.setItem("lang", "en");
    }

    setLang(savedLang);

    // 🌟 إضافة اتجاه الصفحة حسب اللغة
    if (savedLang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
      document.documentElement.setAttribute("lang", "ar");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
      document.documentElement.setAttribute("lang", "en");
    }
  }, []);

  return (
    <ToastProvider>
      {!hideLayout && <Navbar />}
      {children}
      {!hideLayout && <Footer />}
      <WhatsAppButton />
    </ToastProvider>
  );
}


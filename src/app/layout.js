"use client";
import { useEffect, useState } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
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
    <html>
      <body className="antialiased">
        {!hideLayout && <Navbar />}
        {children}
        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}

'use client'
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

  // الصفحات اللي مش عايز يظهر فيها navbar/footer
  const hiddenPaths = ["/login", "/register"];

  const hideLayout = hiddenPaths.includes(pathname);

  return (
    <html lang="en">
      <body className="antialiased">
        {!hideLayout && <Navbar />}

        {children}

        {!hideLayout && <Footer />}
      </body>
    </html>
  );
}

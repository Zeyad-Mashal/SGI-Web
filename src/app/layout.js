import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./components/HeartAnimation.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  });

// Use custom favicon from public/images/logo-ico.ico
export const metadata = {
  icons: {
    icon: "/images/logo-ico.ico",
    shortcut: "/images/logo-ico.ico",
    apple: "/images/logo-ico.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

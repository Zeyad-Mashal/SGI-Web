import { Roboto } from "next/font/google";
import Script from "next/script";
import { SITE_URL } from "@/constants/site";
import "./globals.css";
import "./components/HeartAnimation.css";
import ClientLayout from "./ClientLayout";

const roboto = Roboto({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  adjustFontFallback: true,
});

// Use custom favicon from public/images/logo-ico.ico
export const metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: "/images/logo-ico.ico",
    shortcut: "/images/logo-ico.ico",
    apple: "/images/logo-ico.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.className} antialiased`}>
        <Script
          id="html-js-flag"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js');",
          }}
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

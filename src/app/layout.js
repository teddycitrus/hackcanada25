
//import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
}); */

/* const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

export const metadata = {
  title: "MedPal",
  description: "A simple but powerful assistant for family physicians",
  charset: "UTF-8",
  author: "Huang, Mannully & Yan",
  keywords: "nextjs, coding, react, family physician, ai, agent, assistant, medicine, healthcare"
};

export const generateViewport = () => ({
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

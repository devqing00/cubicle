import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import { Toaster } from "sonner";

const freigeist = localFont({
  src: [
    {
      path: "../../public/fonts/Freigeist-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Freigeist-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Freigeist-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Freigeist-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Freigeist-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-freigeist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cubicle | Online Tutoring with a Personal Touch",
  description:
    "Book a one-on-one tutoring lesson with a passionate instructor. Flexible scheduling, video calls, and personalised sessions — all in a few clicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={freigeist.variable}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}

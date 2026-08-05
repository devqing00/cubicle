import type { Metadata } from "next";
import { Lora, Dancing_Script } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
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
    <html lang="en" className={`${lora.variable} ${dancingScript.variable}`}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

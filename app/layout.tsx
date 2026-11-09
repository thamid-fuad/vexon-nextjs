import type { Metadata } from "next";
import { Orbitron, Manrope, Hind_Siliguri } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind",
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Vexon — AI & Robotics",
  description:
    "Vexon builds AI and robotics solutions: machine learning, AI technology, robotic solutions, tech solutions and data analytics.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${manrope.variable} ${hindSiliguri.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

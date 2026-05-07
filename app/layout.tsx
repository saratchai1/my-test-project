import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IEAT AI-Enhanced Digital Twin",
  description: "Infrastructure asset management digital twin for IEAT",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

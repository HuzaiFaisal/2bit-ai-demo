import type { Metadata } from "next";
import "./globals.css";
import { Shell } from "@/components/dashboard";

export const metadata: Metadata = {
  title: "2BIT AI | AI Customer System",
  description: "2Bit Motors Saudi customer operations dashboard",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body><Shell>{children}</Shell></body>
    </html>
  );
}

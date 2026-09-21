import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "2BIT AI",
  description: "AI-powered customer and sales platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Sidebar />

        <div className="ml-64 min-h-screen">
          <TopBar />

          <main className="p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
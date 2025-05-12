import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProvider from "@/components/ClientProvider";
import { AuthContextProvider } from "@/contexts/AuthContext";
import AuthCheck from "@/components/Auth/AuthCheck";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LentesBrasileiras",
  description: "Torneios de fotografia e muito mais!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <ClientProvider>
          <AuthContextProvider>
            <AuthCheck>
              <Navbar />
              <div className="pt-20">
                <main>
                  {children}
                </main>
              </div>
            </AuthCheck>
          </AuthContextProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Bricolage_Grotesque, Mona_Sans } from "next/font/google";
import "./globals.css";

const monaSans = Mona_Sans({
  subsets: ["latin"],
  variable: "--font-mona-sans",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
  display: "swap",
});


export const metadata: Metadata = {
  title: "SMS Número Virtual - Envía SMS a todo el mundo",
  description: "Plataforma para enviar SMS internacionales. Compra créditos y envía mensajes a cualquier país de forma rápida y segura.",
  manifest: "/manifest.json",
  themeColor: "#2E2E2E",
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192x192.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${monaSans.variable} ${bricolageGrotesque.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMS Número Virtual - Envía SMS a todo el mundo",
  description: "Plataforma para enviar SMS internacionales. Compra créditos y envía mensajes a cualquier país de forma rápida y segura.",
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.png',
    apple: '/icon-192x192.png',
  },
};

export const viewport: Viewport = {
  themeColor: "#2E2E2E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

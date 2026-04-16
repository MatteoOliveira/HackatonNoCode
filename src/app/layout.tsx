import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Solimouv' – Le festival du sport pour tous",
    template: "%s | Solimouv'",
  },
  description:
    "Solimouv' est le festival du sport inclusif organisé par Up Sport! à Paris. Initiations sportives, ateliers de sensibilisation, et célébration de la mixité et du vivre-ensemble.",
  keywords: [
    "festival sport inclusif",
    "Solimouv",
    "Up Sport Paris",
    "sport pour tous",
    "handicap sport",
    "sport réfugiés",
  ],
  authors: [{ name: "Up Sport!" }],
  creator: "Up Sport!",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Solimouv'",
    title: "Solimouv' – Le festival du sport pour tous",
    description:
      "Le festival du sport inclusif à Paris – initiations, ateliers, rencontres.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Solimouv' – Le festival du sport pour tous",
    description:
      "Le festival du sport inclusif à Paris – initiations, ateliers, rencontres.",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Solimouv'",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#013bb8",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}

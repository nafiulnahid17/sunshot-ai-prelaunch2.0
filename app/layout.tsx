import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sunshot AI — Intelligence Beyond Borders",
  description: "Meet Sunshot AI: advanced reasoning, legal intelligence, source-aware research and Bangla-first multimodal AI, engineered in Bangladesh.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sunshot AI — Intelligence Beyond Borders",
    description: "Engineered in Bangladesh. Built for global competition.",
    images: ["/sunshot-logo.jpg"],
  },
  icons: {
    icon: "/sunshot-logo.jpg",
    shortcut: "/sunshot-logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

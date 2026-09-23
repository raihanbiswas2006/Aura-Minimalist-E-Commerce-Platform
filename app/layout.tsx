import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/auth/session-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Aura Living",
    default: "Aura Living | Modern Minimalist Commerce",
  },
  description:
    "Curated home furniture, architectural lighting, and organic textiles crafted for intentional living spaces.",
  metadataBase: new URL("https://aura-living.demo"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF9F6] text-[#14171A]">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}

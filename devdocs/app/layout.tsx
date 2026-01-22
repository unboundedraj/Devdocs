import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SessionProvider from '@/components/SessionProvider';
import { getThemeSettings } from '@/lib/queries';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevDocs - Developer Documentation Portal",
  description: "A centralized hub for developer documentation",
};

// Helper function to extract hex value
function getHexColor(color: any, fallback: string): string {
  if (!color) return fallback;
  if (typeof color === 'string') return color;
  if (color.hex) return color.hex;
  return fallback;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch theme settings
  const theme = await getThemeSettings();
  
  // Extract hex values from color picker objects
  const colors = {
    primary_color: getHexColor(theme?.primary_color, '#3B82F6'),
    secondary_color: getHexColor(theme?.secondary_color, '#8B5CF6'),
    accent_color: getHexColor(theme?.accent_color, '#10B981'),
    background_color: getHexColor(theme?.background_color, '#F9FAFB'),
    card_background: getHexColor(theme?.card_background, '#FFFFFF'),
    text_primary: getHexColor(theme?.text_primary, '#111827'),
    text_secondary: getHexColor(theme?.text_secondary, '#6B7280'),
    border_color: getHexColor(theme?.border_color, '#E5E7EB'),
  };

  console.log('=== FINAL COLORS ===', colors);

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --color-primary: ${colors.primary_color};
              --color-secondary: ${colors.secondary_color};
              --color-accent: ${colors.accent_color};
              --color-background: ${colors.background_color};
              --color-card: ${colors.card_background};
              --color-text-primary: ${colors.text_primary};
              --color-text-secondary: ${colors.text_secondary};
              --color-border: ${colors.border_color};
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <Header />
          {children}
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster as SonnerToaster } from 'sonner';
import GlobalClientEffects from '@/components/GlobalClientEffects';

import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LUWAK Manager - Sistema POS',
  description: 'Sistema de gestión para cafetería LUWAK',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <>
      {children}
      <SonnerToaster position="top-right" richColors />
      <GlobalClientEffects />
    </>
  );

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{content}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

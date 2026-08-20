import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Newsreader, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';
import AuthProvider from '@/components/providers/AuthProvider';
import ToastProvider from '@/components/ui/Toast';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ForcePasswordChangeModal from '@/components/auth/ForcePasswordChangeModal';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Hirium',
  description:
    'The unified operating system for your people, shift attendance, leave balances, and automated payroll disbursements.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-screen flex flex-col bg-bg-light text-ink antialiased font-sans selection:bg-accent/20 selection:text-ink">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
            <ToastProvider />
            <ForcePasswordChangeModal />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

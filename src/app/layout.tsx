import type { Metadata } from 'next';
import { Inter, PT_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileNav from '@/components/layout/mobile-nav';
import PageTransitionWrapper from '@/components/layout/page-transition-wrapper';
import { ScrollToTop } from '@/components/scroll-to-top';
import { ExtensionErrorHandler } from '@/components/extension-error-handler';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
});

const ptSans = PT_Sans({
  weight: ['400', '700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-pt-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bikir-Climat',
  description: 'Современный интернет-магазин и лендинг услуг по кондиционированию в Приднестровье и Молдове.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn('scroll-smooth', inter.variable, ptSans.variable)}>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <ExtensionErrorHandler />
        <Header />
        <PageTransitionWrapper>
          <main className="pb-20 md:pb-0">{children}</main>
        </PageTransitionWrapper>
        <Footer />
        <ScrollToTop />
        <MobileNav />
        <Toaster />
      </body>
    </html>
  );
}

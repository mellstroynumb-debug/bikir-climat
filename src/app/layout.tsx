import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import MobileNav from '@/components/layout/mobile-nav';
import PageTransitionWrapper from '@/components/layout/page-transition-wrapper';
import { FirebaseClientProvider } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <script src="https://api-maps.yandex.ru/2.1/?apikey=ВАШ_API_КЛЮЧ&lang=ru_RU" type="text/javascript"></script>
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <FirebaseClientProvider>
          <FirebaseErrorListener />
          <Header />
          <PageTransitionWrapper>
            <main className="pb-20 md:pb-0">{children}</main>
          </PageTransitionWrapper>
          <Footer />
          <MobileNav />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

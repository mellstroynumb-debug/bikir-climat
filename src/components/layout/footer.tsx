import Link from 'next/link';
import { Instagram, Send } from 'lucide-react';

const footerNav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/services', label: 'Услуги' },
  { href: '/portfolio', label: 'Наши работы' },
  { href: '/contacts', label: 'Контакты' },
];

export default function Footer() {
  return (
    <footer className="bg-secondary/50 border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-lg font-headline">Bikir Climat</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Создаем комфортный и здоровый климат в ваших домах и офисах в Приднестровье и Молдове.
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="font-bold text-lg font-headline">Навигация</h3>
            <ul className="mt-2 space-y-2">
              {footerNav.map(item => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
               <li>
                  <Link href="/admin" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Админ
                  </Link>
                </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="font-bold text-lg font-headline">Мы в соцсетях</h3>
            <div className="flex justify-center md:justify-start items-center mt-3 space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Send className="h-6 w-6" />
              </a>
               <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-6 w-6"
                >
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.23-.16 1.74.03 1.48 1.14 2.57 2.5 2.51.91-.03 1.78-.39 2.34-1.05.53-.64.82-1.5.86-2.32.03-.78.05-1.56.05-2.34l.04-1.38Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Bikir Climat. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}

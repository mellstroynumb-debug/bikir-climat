import Link from 'next/link';
import { Instagram, Send, Facebook } from 'lucide-react';

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
                <Facebook className="h-6 w-6" />
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

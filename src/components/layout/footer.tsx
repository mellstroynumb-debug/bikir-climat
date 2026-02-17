import Link from 'next/link';
import { Instagram, Send } from 'lucide-react';

const footerNav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/services', label: 'Услуги' },
  { href: '/delivery', label: 'Доставка и оплата' },
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
                    <path d="M17.8673 4.44667C16.9956 3.49276 16.5152 2.26793 16.5153 1H12.574V16.1556C12.5442 16.9759 12.1831 17.7531 11.5667 18.3232C10.9504 18.8932 10.127 19.2116 9.27041 19.2111C7.45918 19.2111 5.95408 17.7933 5.95408 16.0333C5.95408 13.9311 8.07143 12.3544 10.2526 13.0022V9.14C5.85204 8.57778 2 11.8533 2 16.0333C2 20.1033 5.52041 23 9.25765 23C13.2628 23 16.5153 19.8833 16.5153 16.0333V8.34556C18.1135 9.44537 20.0324 10.0355 22 10.0322V6.25556C22 6.25556 19.602 6.36556 17.8673 4.44667Z" />
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

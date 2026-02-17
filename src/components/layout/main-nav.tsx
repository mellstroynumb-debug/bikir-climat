'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


export function MainNav() {
  const pathname = usePathname();

  const navLinkClasses = (href: string) => cn(
    'transition-colors hover:text-primary',
    pathname === href ? 'text-primary font-semibold' : 'text-foreground/80'
  );

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <Link href="/#quiz" className={navLinkClasses('/#quiz')}>
            Подбор кондиционера
        </Link>
        <Link href="/services" className={navLinkClasses('/services')}>
            Монтаж
        </Link>
        <Link href="/about" className={navLinkClasses('/about')}>
            О нас
        </Link>
        <Link href="/delivery" className={navLinkClasses('/delivery')}>
            Доставка и оплата
        </Link>
        <Link href="/contacts" className={navLinkClasses('/contacts')}>
            Контакты
        </Link>
    </nav>
  );
}

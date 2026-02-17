'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react';

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
        <DropdownMenu>
            <DropdownMenuTrigger className={cn(navLinkClasses('#'), "flex items-center gap-1 outline-none")}>
                О нас
                <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem asChild>
                    <Link href="/portfolio">Наши работы</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/#faq">Частые вопросы</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/delivery" className={navLinkClasses('/delivery')}>
            Доставка и оплата
        </Link>
        <Link href="/contacts" className={navLinkClasses('/contacts')}>
            Контакты
        </Link>
    </nav>
  );
}

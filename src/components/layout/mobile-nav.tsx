'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Wrench, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/catalog', label: 'Каталог', icon: LayoutGrid },
  { href: '/services', label: 'Услуги', icon: Wrench },
  { href: '/contacts', label: 'Контакты', icon: Phone },
];

export default function MobileNav() {
  const pathname = usePathname();
  
  // Hydration safety
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t z-40">
      <nav className="h-full">
        <ul className="h-full grid grid-cols-4">
          {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href} className="h-full">
                <Link href={item.href} className={cn(
                    "flex flex-col items-center justify-center w-full h-full text-xs gap-1 transition-colors",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                )}>
                    <div className="relative">
                        <item.icon className="h-5 w-5" />
                    </div>
                    <span>{item.label}</span>
                </Link>
                </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

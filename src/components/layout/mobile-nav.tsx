'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Wrench, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export default function MobileNav() {
  const pathname = usePathname();
  const { region } = useStore();
  const phone = region === 'PMR' ? '+373 777 12345' : '+373 68 123456';

  const navItems = [
    { href: '/', label: 'Главная', icon: Home },
    { href: '/catalog', label: 'Каталог', icon: LayoutGrid },
    { href: '/services', label: 'Услуги', icon: Wrench },
    { href: `tel:${phone.replace(/\s/g, '')}`, label: 'Позвонить', icon: Phone },
  ];
  
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
              const isTelLink = item.href.startsWith('tel:');

              const linkContent = (
                <>
                  <div className="relative">
                      <item.icon className="h-5 w-5" />
                  </div>
                  <span>{item.label}</span>
                </>
              );

              return (
                <li key={item.label} className="h-full">
                {isTelLink ? (
                   <a href={item.href} className={cn(
                    "flex flex-col items-center justify-center w-full h-full text-xs gap-1 transition-colors",
                    "text-muted-foreground hover:text-primary"
                   )}>
                     {linkContent}
                   </a>
                ) : (
                  <Link href={item.href} className={cn(
                      "flex flex-col items-center justify-center w-full h-full text-xs gap-1 transition-colors",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                  )}>
                      {linkContent}
                  </Link>
                )}
                </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Heart, Scale, ShoppingCart, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';

export default function MobileNav() {
  const pathname = usePathname();
  const { getCartCount } = useStore();
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const cartCount = getCartCount();

  const navItems = [
    { href: '/catalog', label: 'Каталог', icon: LayoutGrid },
    { href: '#', label: 'Избранное', icon: Heart, count: 0 },
    { href: '#', label: 'Сравнение', icon: Scale, count: 0 },
    { href: '/cart', label: 'Корзина', icon: ShoppingCart, count: isClient ? cartCount : 0 },
    { href: '/contacts', label: 'Контакты', icon: MapPin },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t z-40">
      <nav className="h-full">
        <ul className="h-full grid grid-cols-5">
          {navItems.map((item) => {
              const isActive = item.href !== '#' && pathname.startsWith(item.href);

              return (
                <li key={item.label} className="h-full">
                  <Link href={item.href} className={cn(
                      "flex flex-col items-center justify-center w-full h-full text-xs gap-1 transition-colors",
                      isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                  )}>
                      <div className="relative">
                          <item.icon className="h-6 w-6" />
                          {item.count !== undefined && item.count > 0 && (
                              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                                  {item.count > 9 ? '9+' : item.count}
                              </span>
                          )}
                      </div>
                      <span className="text-[10px] mt-0.5">{item.label}</span>
                  </Link>
                </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

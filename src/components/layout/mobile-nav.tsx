'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Wrench, ShoppingCart, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useEffect, useState } from 'react';

const navItems = [
  { href: '/', label: 'Главная', icon: Home },
  { href: '/catalog', label: 'Каталог', icon: LayoutGrid },
  { href: '/services', label: 'Услуги', icon: Wrench },
  { href: '/cart', label: 'Корзина', icon: ShoppingCart },
  { href: '/contacts', label: 'Контакты', icon: Phone },
];

export default function MobileNav() {
  const pathname = usePathname();
  const cartCount = useStore(state => state.getCartCount());

  // Hydration safety
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-t z-40">
      <nav className="h-full">
        <ul className="h-full grid grid-cols-5">
          {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
              return (
                <li key={item.href} className="h-full">
                <Link href={item.href} className={cn(
                    "flex flex-col items-center justify-center w-full h-full text-xs gap-1 transition-colors",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground hover:text-primary"
                )}>
                    <div className="relative">
                        <item.icon className="h-5 w-5" />
                        {item.href === '/cart' && isClient && cartCount > 0 && (
                            <span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                                {cartCount}
                            </span>
                        )}
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

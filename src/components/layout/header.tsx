'use client';

import Link from 'next/link';
import { MainNav } from './main-nav';
import { RegionSwitcher } from '../region-switcher';
import { CartIcon } from '../cart-icon';
import { useStore } from '@/store/useStore';
import { Phone, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { SearchDialog } from '@/components/search-dialog';

export default function Header() {
  const region = useStore(state => state.region);
  const phone = region === 'PMR' ? '+373 777 12345' : '+373 68 123456';
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);


  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block font-headline text-lg">
              Bikir Climat
            </span>
          </Link>
          <MainNav />
          <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)} aria-label="Поиск">
                <Search className="h-5 w-5" />
            </Button>
            <div className="hidden items-center space-x-2 md:flex">
               <Phone className="h-4 w-4 text-primary" />
               <a href={`tel:${phone.replace(/\s/g, '')}`} className="font-medium text-sm hover:text-primary transition-colors">{phone}</a>
            </div>
            <RegionSwitcher />
            <CartIcon />
          </div>
        </div>
      </header>
      <SearchDialog isOpen={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </>
  );
}

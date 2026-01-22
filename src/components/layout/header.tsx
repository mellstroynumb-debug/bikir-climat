'use client';

import Link from 'next/link';
import { MainNav } from './main-nav';
import { RegionSwitcher } from '../region-switcher';
import { CartIcon } from '../cart-icon';
import { useStore } from '@/store/useStore';
import { Phone, Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const region = useStore(state => state.region);
  
  const phoneDisplay = region === 'PMR' ? '0775 28 405' : '+373 68 123456';
  const phoneCall = region === 'PMR' ? '+37377528405' : '+37368123456';
  
  const router = useRouter();
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => firestore ? query(collection(firestore, 'products')) : null, [firestore]);
  const { data: products, isLoading } = useCollection<Product>(productsCollection);
  const currency = region === 'PMR' ? 'руб.' : 'лей';

  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const filteredProducts = useMemo(() => {
      if (!products || !searchTerm) {
          return [];
      }
      return products.filter(product =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [products, searchTerm]);

  const handleSelect = (path: string) => {
      router.push(path);
      setIsPopoverOpen(false);
  };

  // Reset search term when popover closes
  useEffect(() => {
      if (!isPopoverOpen) {
          setTimeout(() => setSearchTerm(''), 150);
      }
  }, [isPopoverOpen]);

  // Keyboard shortcut to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsPopoverOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block font-headline text-lg">
              Bikir Climat
            </span>
          </Link>
          <MainNav />
          <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
            
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Поиск">
                        <Search className="h-5 w-5" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] sm:w-[400px] lg:w-[500px] p-0">
                    <div className="flex items-center px-4 border-b">
                        <Search className="h-5 w-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Поиск по названию товара..."
                            className="w-full h-12 border-0 shadow-none focus-visible:ring-0 focus-visible:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="py-4 overflow-y-auto max-h-[70vh]">
                        {isLoading && (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        )}
                        {!isLoading && searchTerm && filteredProducts.length === 0 && (
                            <p className="text-center text-muted-foreground p-8">Ничего не найдено.</p>
                        )}
                        {!isLoading && !searchTerm && (
                            <p className="text-center text-muted-foreground p-8">Начните вводить название товара.</p>
                        )}
                        <ul className="divide-y">
                            {filteredProducts.map((product) => {
                                const price = region === 'PMR' ? product.price_pmr : product.price_md;
                                return (
                                    <li key={product.id}>
                                        <button onClick={() => handleSelect(`/catalog/${product.id}`)} className="w-full text-left p-4 hover:bg-accent transition-colors flex items-center gap-4">
                                            <Image
                                                src={product.images[0]}
                                                alt={product.title}
                                                width={50}
                                                height={50}
                                                className="rounded-md object-cover border"
                                            />
                                            <div className="flex-1">
                                                <p className="font-semibold">{product.title}</p>
                                                {price && <p className="text-sm text-primary">{new Intl.NumberFormat('ru-RU').format(price)} {currency}</p>}
                                            </div>
                                        </button>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </PopoverContent>
            </Popover>

            <div className="hidden items-center space-x-2 md:flex">
               <Phone className="h-4 w-4 text-primary" />
               <a href={`tel:${phoneCall}`} className="font-medium text-sm hover:text-primary transition-colors">{phoneDisplay}</a>
            </div>
            <RegionSwitcher />
            <CartIcon />
          </div>
        </div>
      </header>
    </>
  );
}

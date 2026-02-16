'use client';

import Link from 'next/link';
import {
  Heart,
  Instagram,
  Loader2,
  Menu,
  Phone,
  Scale,
  Search,
  Send,
  ShoppingCart,
} from 'lucide-react';
import { MainNav } from './main-nav';
import { RegionSwitcher } from '../region-switcher';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { useState, useMemo, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';

function ActionLink({
  href,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  count?: number;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      <div className="relative">
        <Icon className="h-6 w-6" />
        {count !== undefined && count > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {count}
          </span>
        )}
      </div>
      <span>{label}</span>
    </Link>
  );
}

export default function Header() {
  const { region } = useStore();
  const [isClient, setIsClient] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const phoneDisplay = region === 'PMR' ? '0775 28 405' : '+373 68 123456';
  const phoneCall = region === 'PMR' ? '+37377528405' : '+37368123456';

  const router = useRouter();
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products')) : null),
    [firestore]
  );
  const { data: products, isLoading } = useCollection<Product>(
    productsCollection
  );
  const currency = region === 'PMR' ? 'руб.' : 'лей';

  const [searchTerm, setSearchTerm] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!products || !searchTerm) {
      return [];
    }
    const searchWords = searchTerm.toLowerCase().split(' ').filter(Boolean);
    if (searchWords.length === 0) {
      return [];
    }
    return products.filter((product) => {
      const productTitleLower = product.title.toLowerCase();
      return searchWords.every((word) => productTitleLower.includes(word));
    });
  }, [products, searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsPopoverOpen(false);
    }
  };

  const handleSelect = (path: string) => {
    router.push(path);
    setIsPopoverOpen(false);
  };
  
  useEffect(() => {
    if (!isPopoverOpen) {
      setTimeout(() => setSearchTerm(''), 150);
    }
  }, [isPopoverOpen]);


  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur-sm">
      {/* Top Bar */}
      <div className="hidden bg-secondary/50 text-sm text-muted-foreground md:block">
        <div className="container mx-auto flex h-10 items-center justify-between px-4">
          <div>
            <span>Мы работаем пн-пт с 9:00 - 18:00</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
            <RegionSwitcher />
          </div>
        </div>
      </div>

      {/* Main Header - DESKTOP */}
      <div className="container mx-auto hidden h-24 items-center gap-4 px-4 md:flex md:gap-8">
        <div className="hidden lg:flex">
             <Link href="/" className="flex flex-col">
                <span className="font-bold font-headline text-2xl">Bikir Climat</span>
                <span className="text-xs text-muted-foreground">
                    №1 по установке кондиционеров
                </span>
            </Link>
        </div>
       
        <div className="flex-1">
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <div className="relative w-full max-w-lg cursor-text">
                    <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                        <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                     <input
                        type="text"
                        placeholder="Поиск по сайту..."
                        className="h-11 w-full rounded-md border border-input bg-background/50 pl-10 pr-4 text-sm focus:outline-none"
                        onFocus={() => setIsPopoverOpen(true)}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <div className="overflow-y-auto py-2 max-h-[60vh]">
                 {isLoading && (
                    <div className="flex items-center justify-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                )}
                {!isLoading && searchTerm && filteredProducts.length === 0 && (
                    <p className="text-center text-muted-foreground p-4 text-sm">Ничего не найдено.</p>
                )}
                {!isLoading && !searchTerm && (
                    <p className="text-center text-muted-foreground p-4 text-sm">Начните вводить название товара.</p>
                )}
                <ul className="divide-y">
                    {filteredProducts.slice(0, 7).map((product) => {
                        const price = region === 'PMR' ? product.price_pmr : product.price_md;
                        return (
                            <li key={product.id}>
                                <button onClick={() => handleSelect(`/catalog/${product.id}`)} className="w-full text-left p-2 hover:bg-accent transition-colors flex items-center gap-3">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        width={40}
                                        height={40}
                                        className="rounded-md object-cover border"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-sm leading-tight">{product.title}</p>
                                        {price && <p className="text-xs text-primary">{new Intl.NumberFormat('ru-RU').format(price)} {currency}</p>}
                                    </div>
                                </button>
                            </li>
                        )
                    })}
                </ul>
              </div>
                 {searchTerm && <div className="border-t p-2">
                    <Button onClick={handleSearchSubmit} className="w-full" variant="secondary">Показать все результаты</Button>
                </div>}
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="hidden text-right lg:block">
            <a
                href={`tel:${phoneCall}`}
                className="font-bold text-lg transition-colors hover:text-primary"
            >
                {phoneDisplay}
            </a>
            <p className="text-xs text-muted-foreground">пн-пт с 9:00 - 18:00</p>
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <ActionLink href="#" icon={Heart} label="Избранное" count={0}/>
          <ActionLink href="#" icon={Scale} label="Сравнить" count={0}/>
        </div>
      </div>
      
      {/* Main Header - MOBILE */}
      <div className="container mx-auto flex h-16 items-center justify-between px-2 md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0">
             <div className="p-6">
                <SheetClose asChild>
                    <Link href="/" className="flex flex-col mb-8">
                        <span className="font-bold font-headline text-2xl">Bikir Climat</span>
                        <span className="text-xs text-muted-foreground">№1 по установке кондиционеров</span>
                    </Link>
                </SheetClose>
                <nav className="flex flex-col gap-4">
                    <SheetClose asChild><Link href="/#quiz" className="font-medium text-lg">Подбор кондиционера</Link></SheetClose>
                    <SheetClose asChild><Link href="/services" className="font-medium text-lg">Монтаж</Link></SheetClose>
                    <SheetClose asChild><Link href="/portfolio" className="font-medium text-lg">Наши работы</Link></SheetClose>
                    <SheetClose asChild><Link href="/#faq" className="font-medium text-lg">Частые вопросы</Link></SheetClose>
                    <SheetClose asChild><Link href="/checkout" className="font-medium text-lg">Доставка и оплата</Link></SheetClose>
                    <SheetClose asChild><Link href="/contacts" className="font-medium text-lg">Контакты</Link></SheetClose>
                </nav>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
                <div className="flex justify-between items-center mb-6">
                     <a href={`tel:${phoneCall}`} className="font-bold text-lg">{phoneDisplay}</a>
                     <RegionSwitcher />
                </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <span className="font-bold font-headline text-xl">Bikir Climat</span>
        </Link>
        
        <div className="flex items-center gap-0">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                 <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Поиск</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-screen max-w-[calc(100vw-2rem)] p-0" align="end">
                 <div className="flex items-center border-b">
                    <Search className="h-5 w-5 text-muted-foreground ml-4" />
                    <form onSubmit={handleSearchSubmit} className="flex-1">
                        <input
                            type="text"
                            placeholder="Найти кондиционер..."
                            className="w-full h-12 border-0 bg-transparent px-3 text-base placeholder:text-muted-foreground focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </form>
                 </div>
                 <div className="overflow-y-auto py-2 max-h-[60vh]">
                    {/* ... results */}
                </div>
                {searchTerm && <div className="border-t p-2">
                    <Button onClick={handleSearchSubmit} className="w-full" variant="secondary">Показать все результаты</Button>
                </div>}
              </PopoverContent>
            </Popover>
            <Button asChild variant="ghost" size="icon">
              <a href={`tel:${phoneCall}`}>
                  <Phone className="h-5 w-5" />
                  <span className="sr-only">Позвонить</span>
              </a>
            </Button>
        </div>
      </div>


      {/* Bottom Nav (Desktop) */}
       <div className="hidden border-t bg-background md:block">
        <div className="container mx-auto flex h-14 items-center gap-6 px-4">
            <Button asChild className="bg-primary hover:bg-primary/90 font-bold">
              <Link href="/catalog">
                <Menu className="mr-2 h-5 w-5" />
                Каталог
              </Link>
            </Button>
            <MainNav />
        </div>
      </div>
    </header>
  );
}

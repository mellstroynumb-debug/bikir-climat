'use client';

import Link from 'next/link';
import {
  Menu,
  Phone,
  Search,
  Instagram,
  Send,
} from 'lucide-react';
import { MainNav } from './main-nav';
import { RegionSwitcher } from '../region-switcher';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/sheet';
import { CallbackRequestDialog } from '../callback-request-dialog';
import { CartPopover } from './CartPopover';
import { FavoritesPopover } from './FavoritesPopover';
import { ComparePopover } from './ComparePopover';

function TiktokIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            {...props}
        >
            <path d="M17.8673 4.44667C16.9956 3.49276 16.5152 2.26793 16.5153 1H12.574V16.1556C12.5442 16.9759 12.1831 17.7531 11.5667 18.3232C10.9504 18.8932 10.127 19.2116 9.27041 19.2111C7.45918 19.2111 5.95408 17.7933 5.95408 16.0333C5.95408 13.9311 8.07143 12.3544 10.2526 13.0022V9.14C5.85204 8.57778 2 11.8533 2 16.0333C2 20.1033 5.52041 23 9.25765 23C13.2628 23 16.5153 19.8833 16.5153 16.0333V8.34556C18.1135 9.44537 20.0324 10.0355 22 10.0322V6.25556C22 6.25556 19.602 6.36556 17.8673 4.44667Z" />
        </svg>
    );
}

export default function Header() {
  const { region } = useStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  
  const phoneDisplay = region === 'PMR' ? '0775 28 405' : '+373 68 123456';
  const phoneCall = region === 'PMR' ? '+37377528405' : '+37368123456';
  const currency = region === 'PMR' ? 'руб.' : 'лей';

  const router = useRouter();
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products')) : null),
    [firestore]
  );
  const { data: products, isLoading } = useCollection<Product>(
    productsCollection
  );

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
      // Check that every search word is present in the title
      return searchWords.every(word => productTitleLower.includes(word));
    });
  }, [products, searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchTerm.trim())}`);
      setIsPopoverOpen(false);
      setSearchTerm('');
    }
  };

  const handleSelect = (path: string) => {
    router.push(path);
    setIsPopoverOpen(false);
    setSearchTerm('');
  };
  
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
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <TiktokIcon className="h-5 w-5" />
              </a>
            </div>
            <RegionSwitcher />
          </div>
        </div>
      </div>
      
       {/* Middle Bar */}
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
              <form onSubmit={handleSearchSubmit} className="flex w-full max-w-lg items-stretch">
                <input
                    type="text"
                    placeholder="Поиск по сайту..."
                    className="h-11 w-full rounded-l-md rounded-r-none border-y border-l border-input bg-background/50 pl-4 pr-4 text-sm outline-none ring-0 focus-visible:z-10 focus-visible:ring-0"
                    onFocus={() => setIsPopoverOpen(true)}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                            e.preventDefault();
                            (e.target as HTMLInputElement).focus();
                        }
                    }}
                />
                 <Button type="submit" className="h-11 rounded-l-none rounded-r-md border-y border-r border-input bg-background px-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Поиск">
                    <Search className="h-5 w-5" />
                </Button>
              </form>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              {searchTerm && (
                <div className="flex flex-col">
                    {isLoading ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">Загрузка...</div>
                    ) : filteredProducts.length > 0 ? (
                    <>
                        <div className="max-h-[400px] overflow-y-auto">
                        {filteredProducts.slice(0, 7).map((product) => {
                            const price = region === 'PMR' ? product.price_pmr : product.price_md;
                            return (
                                <div
                                    key={product.id}
                                    className="flex cursor-pointer items-center gap-3 p-3 hover:bg-accent"
                                    onClick={() => handleSelect(`/catalog/${product.id}`)}
                                >
                                    <Image
                                        src={product.images[0]}
                                        alt={product.title}
                                        width={40}
                                        height={40}
                                        className="rounded-md border object-cover"
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium truncate">{product.title}</p>
                                        <p className="text-xs text-primary font-semibold">
                                            {price ? `${new Intl.NumberFormat('ru-RU').format(price)} ${currency}` : 'Цена не указана'}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                        {filteredProducts.length > 0 && (
                        <div className="border-t p-2">
                            <Button
                            variant="ghost"
                            className="w-full justify-center"
                            onClick={handleSearchSubmit}
                            >
                            Показать все результаты ({filteredProducts.length})
                            </Button>
                        </div>
                        )}
                    </>
                    ) : (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        Ничего не найдено.
                    </div>
                    )}
                </div>
                )}
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
          <FavoritesPopover />
          <ComparePopover />
          <CartPopover />
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

      {/* Main Header - MOBILE */}
      <div className="container mx-auto flex h-16 items-center justify-between px-2 md:hidden">
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Открыть меню</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 flex flex-col">
            <SheetHeader className="p-6">
                <SheetTitle className='sr-only'>Главное меню</SheetTitle>
                <Link href="/" onClick={() => setIsSheetOpen(false)} className="flex flex-col text-left">
                    <span className="font-bold font-headline text-2xl">Bikir Climat</span>
                    <span className="text-xs text-muted-foreground">№1 по установке кондиционеров</span>
                </Link>
            </SheetHeader>
            <div className="p-6 pt-2 flex-1">
                <nav className="flex flex-col gap-4">
                    <Link href="/#quiz" onClick={() => setIsSheetOpen(false)} className="font-medium text-lg">Подбор кондиционера</Link>
                    <Link href="/services" onClick={() => setIsSheetOpen(false)} className="font-medium text-lg">Монтаж</Link>
                    <Link href="/portfolio" onClick={() => setIsSheetOpen(false)} className="font-medium text-lg">Наши работы</Link>
                    <Link href="/#faq" onClick={() => setIsSheetOpen(false)} className="font-medium text-lg">Частые вопросы</Link>
                    <Link href="/checkout" onClick={() => setIsSheetOpen(false)} className="font-medium text-lg">Доставка и оплата</Link>
                    <Link href="/contacts" onClick={() => setIsSheetOpen(false)} className="font-medium text-lg">Контакты</Link>
                </nav>
            </div>
            <div className="p-6 border-t mt-auto">
                <div className="flex justify-between items-center">
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
                  <form onSubmit={handleSearchSubmit} className="flex w-full items-stretch p-3">
                    <input
                        type="text"
                        placeholder="Поиск по сайту..."
                        className="h-11 w-full rounded-l-md rounded-r-none border-y border-l border-input bg-background/50 pl-4 pr-4 text-sm outline-none ring-0 focus-visible:z-10 focus-visible:ring-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                     <Button type="submit" className="h-11 rounded-l-none rounded-r-md border-y border-r border-input bg-background px-4 text-muted-foreground hover:bg-accent hover:text-accent-foreground" aria-label="Поиск">
                        <Search className="h-5 w-5" />
                    </Button>
                  </form>
                  {searchTerm && (
                    <div className="flex flex-col border-t">
                        {isLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Загрузка...</div>
                        ) : filteredProducts.length > 0 ? (
                        <>
                            <div className="max-h-[400px] overflow-y-auto">
                            {filteredProducts.slice(0, 7).map((product) => {
                                const price = region === 'PMR' ? product.price_pmr : product.price_md;
                                return (
                                    <div
                                        key={product.id}
                                        className="flex cursor-pointer items-center gap-3 p-3 hover:bg-accent"
                                        onClick={() => handleSelect(`/catalog/${product.id}`)}
                                    >
                                        <Image
                                            src={product.images[0]}
                                            alt={product.title}
                                            width={40}
                                            height={40}
                                            className="rounded-md border object-cover"
                                        />
                                        <div className="flex-1 overflow-hidden">
                                            <p className="text-sm font-medium truncate">{product.title}</p>
                                            <p className="text-xs text-primary font-semibold">
                                                {price ? `${new Intl.NumberFormat('ru-RU').format(price)} ${currency}` : 'Цена не указана'}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            </div>
                            {filteredProducts.length > 0 && (
                            <div className="border-t p-2">
                                <Button
                                variant="ghost"
                                className="w-full justify-center"
                                onClick={handleSearchSubmit}
                                >
                                Показать все результаты ({filteredProducts.length})
                                </Button>
                            </div>
                            )}
                        </>
                        ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Ничего не найдено.
                        </div>
                        )}
                    </div>
                    )}
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
      <CallbackRequestDialog isOpen={isCallbackOpen} onOpenChange={setIsCallbackOpen} />
    </header>
  );
}

'use client';
import { useStore } from '@/store/useStore';
import ProductList from '@/components/product-list';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
    const { favorites } = useStore();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold">Избранные товары</h1>
            </div>
            {favorites.length > 0 ? (
                <ProductList products={favorites} />
            ) : (
                <div className="text-center py-20">
                     <Heart className="mx-auto h-24 w-24 text-muted-foreground" />
                    <h2 className="mt-4 text-xl font-semibold">Список избранного пуст</h2>
                    <p className="mt-2 text-muted-foreground">Добавляйте товары, нажимая на сердечко</p>
                    <Button asChild className="mt-6">
                        <Link href="/catalog">Перейти в каталог</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}

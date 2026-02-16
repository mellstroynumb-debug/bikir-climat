'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const staticCategories = [
    {
        name: 'Инверторные кондиционеры',
        image: 'https://hi-tech.md/images/thumbnails/800/800/detailed/167/a291079e2c4ae79d677df98f62c0e86b.jpg',
        link: '/catalog',
        count: 87,
    },
    {
        name: 'On/Off кондиционеры',
        image: 'https://hi-tech.md/images/thumbnails/800/800/detailed/162/a949b251147a752251a31d999086111f.jpg',
        link: '/catalog',
        count: 16,
    },
    {
        name: 'Кондиционеры мультисплит',
        image: 'https://hi-tech.md/images/thumbnails/800/800/detailed/172/2920272b1584c5a93945a05b38fcc50f.jpg',
        link: '/catalog',
        count: 37,
    },
    {
        name: 'Мобильные кондиционеры',
        image: 'https://hi-tech.md/images/thumbnails/800/800/detailed/148/f531d9b7366d4826f043684a0b387431.jpg',
        link: '/catalog',
        count: 3,
    },
    {
        name: 'Комплектующие',
        image: 'https://hi-tech.md/images/thumbnails/800/800/detailed/164/e33d264b1897f1f3a2c26359b380a0f5.jpg',
        link: '/services',
        count: 7,
    },
    {
        name: 'Аксессуары для монтажа',
        image: 'https://hi-tech.md/images/thumbnails/800/800/detailed/164/59a6857187c71e847c5d01a357b98d36.jpg',
        link: '/services',
        count: 0,
    },
];


export function CategoryGrid() {
    return (
        <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center font-headline mb-12">
                    Кондиционеры
                </h1>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                    {staticCategories.map((category) => (
                        <Link href={category.link} key={category.name} className="group block">
                            <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full">
                                <CardContent className="p-4 text-center flex flex-col h-full">
                                    <div className="relative aspect-video w-full mb-4">
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="mt-auto">
                                        <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors">{category.name}</h3>
                                        {category.count > 0 && <p className="text-sm text-muted-foreground">Товаров: {category.count}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

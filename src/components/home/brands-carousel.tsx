'use client';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

const brands = [
    'MIDEA', 'GREE', 'Cooper&Hunter', 'LG', 'Samsung', 'Electrolux', 'Ballu', 'HEINNER', 'ONE AIR'
];

export function BrandsCarousel() {
    return (
        <section className="py-12 md:py-16 bg-secondary/50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center font-headline mb-12">
                    Популярные бренды
                </h2>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <CarouselContent className="-ml-4">
                        {brands.map((brand, index) => (
                            <CarouselItem key={index} className="basis-1/3 md:basis-1/4 lg:basis-1/6 pl-4">
                                <div className="p-1">
                                    <Card>
                                        <CardContent className="flex aspect-video items-center justify-center p-6">
                                            <span className="text-lg md:text-xl font-semibold text-muted-foreground">{brand}</span>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="hidden sm:flex" />
                    <CarouselNext className="hidden sm:flex" />
                </Carousel>
            </div>
        </section>
    );
}

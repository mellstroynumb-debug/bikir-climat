'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import React from "react";


const slides = [
    {
        title: "Эстетичный монтаж",
        description: "Гарантия на все виды работ. Убираем за собой.",
        image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1920",
        imageHint: "modern living-room",
        link: "/services"
    },
    {
        title: "Лучшие бренды",
        description: "Официальный дилер GREE, Cooper&Hunter, MIDEA и других.",
        image: "https://images.unsplash.com/photo-1642018929698-8d86f43ffcd5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhaXIlMjBjb25kaXRpb25lcnxlbnwwfHx8fDE3Njg5MTYzNDR8MA&ixlib=rb-4.1.0&q=80&w=1920",
        imageHint: "air conditioner",
        link: "/catalog"
    },
    {
        title: "Работаем в ПМР и Молдове",
        description: "Быстрая доставка и установка в любом регионе.",
        image: "https://images.unsplash.com/photo-1558286084-5176c113f338?auto=format&fit=crop&q=80&w=1920",
        imageHint: "clean installation",
        link: "/contacts"
    }
];

export function HeroCarousel() {
    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    return (
        <section className="w-full py-8 md:py-12">
          <div className="container mx-auto px-4">
            <Carousel
                plugins={[plugin.current]}
                opts={{ loop: true }}
                className="w-full rounded-lg overflow-hidden"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div className="relative aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3.2/1]">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    data-ai-hint={slide.imageHint}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center">
                                    <div className="container mx-auto px-4 md:px-8 text-white">
                                        <div className="max-w-md">
                                            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold font-headline">{slide.title}</h2>
                                            <p className="mt-2 md:mt-4 text-sm md:text-lg">{slide.description}</p>
                                            <Button asChild className="mt-4 md:mt-6" size="lg">
                                                <Link href={slide.link}>Подробнее</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden sm:flex" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex" />
            </Carousel>
          </div>
        </section>
    );
}

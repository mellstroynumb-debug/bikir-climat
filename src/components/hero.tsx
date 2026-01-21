'use client';

import { Button } from './ui/button';
import { useStore } from '@/store/useStore';

function HeroSubtitle() {
  const region = useStore(state => state.region);
  const text = region === 'PMR' 
    ? "Эксклюзивные цены и быстрая установка в Приднестровье." 
    : "Лучшие предложения и профессиональный монтаж по всей Молдове.";

  return (
    <p
      key={region}
      className="mt-4 max-w-xl text-lg text-muted-foreground"
    >
      {text}
    </p>
  );
}

export default function Hero() {
  return (
    <section className="w-full bg-background flex items-center justify-center text-center py-24 sm:py-32">
      <div className="px-4">
        <h1 
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline"
        >
          Климат вашего дома под ключ
        </h1>
        <HeroSubtitle />
        <div
          className="mt-8"
        >
          <Button 
            size="lg" 
            className="font-bold"
          >
            Подобрать кондиционер
          </Button>
        </div>
      </div>
    </section>
  );
}

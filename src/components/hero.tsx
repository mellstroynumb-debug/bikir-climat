'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

function HeroSubtitle() {
  const region = useStore(state => state.region);
  const text = region === 'PMR' 
    ? "Эксклюзивные цены и быстрая установка в Приднестровье." 
    : "Лучшие предложения и профессиональный монтаж по всей Молдове.";

  return (
    <motion.p
      key={region}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4 max-w-xl text-lg text-slate-300"
    >
      {text}
    </motion.p>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center text-center text-white overflow-hidden">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.imageHint}
        />
      )}
      <div className="absolute inset-0 bg-slate-900/60" />
      <div className="relative z-10 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl font-headline"
        >
          Климат вашего дома под ключ
        </motion.h1>
        <HeroSubtitle />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8"
        >
          <Button 
            size="lg" 
            className="font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out shadow-[0_0_15px_rgba(56,189,248,0.5)] hover:shadow-[0_0_25px_rgba(56,189,248,0.8)]"
          >
            Подобрать кондиционер
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from './ui/button';
import { HeroBackground } from './hero-background';

function HeroSubtitle() {
  const region = useStore(state => state.region);
  const text = region === 'PMR' 
    ? "Эксклюзивные цены и быстрая установка в Приднестровье." 
    : "Лучшие предложения и профессиональный монтаж по всей Молдове.";

  return (
    <p
      key={region}
      className="mt-4 max-w-xl mx-auto text-lg text-foreground/80"
    >
      {text}
    </p>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center text-center overflow-hidden">
      {/* Generative Animated Background */}
      <HeroBackground />

      {/* Content */}
      <div className="relative z-10 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline"
        >
          Климат вашего дома под ключ
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
            <HeroSubtitle />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="mt-8"
        >
          <Button asChild size="lg" className="font-bold shadow-lg">
            <a href="#quiz">Подобрать кондиционер</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

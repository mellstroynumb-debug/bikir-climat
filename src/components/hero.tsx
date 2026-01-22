'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from './ui/button';

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
    <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center text-center overflow-hidden bg-background">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 z-0"
      >
        {/* This video shows abstract white lines flowing on a white background, creating a sense of clean air and technology */}
        <source src="https://videos.pexels.com/video-files/8571708/8571708-hd_1920_1080_30fps.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm z-10" />

      {/* Content */}
      <div className="relative z-20 px-4">
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

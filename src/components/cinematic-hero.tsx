'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from './ui/button';

// The generative background is included here for a self-contained component.
function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-white">
      <motion.div
        className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[rgba(56,189,248,0.4)] blur-[100px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, 200, 0, -100, 0],
          y: [0, 100, 250, 100, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{
          duration: 22,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[rgba(129,140,248,0.25)] blur-[100px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: [0, -200, 0, 100, 0],
          y: [0, -100, -250, -100, 0],
          scale: [1, 0.8, 1, 1.2, 1],
        }}
        transition={{
          duration: 28,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
          delay: 0.5,
        }}
      />
       <motion.div
        className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-[rgba(203,213,225,0.5)] blur-[100px]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          x: ['-50%', '0%', '-50%', '-100%', '-50%'],
          y: ['-50%', '-100%', '-50%', '0%', '-50%'],
          rotate: [0, 45, 90, 180, 360],
        }}
        transition={{
          duration: 35,
          ease: 'linear',
          repeat: Infinity,
          delay: 1,
        }}
      />
    </div>
  );
}


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

// Variants for the blur reveal effect
const revealVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
  },
};

export default function CinematicHero() {
  return (
    <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center text-center overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 px-4">
        <motion.h1 
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline"
        >
          Климат вашего дома под ключ
        </motion.h1>
        
        <motion.div
          variants={revealVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
            <HeroSubtitle />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 15 }}
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

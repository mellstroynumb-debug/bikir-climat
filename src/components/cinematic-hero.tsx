'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button } from './ui/button';

// The generative background is included here for a self-contained component.
function AnimatedBackground() {
  return (
    <motion.div 
      aria-hidden="true" 
      className="absolute inset-0 -z-10 overflow-hidden bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Blob 1 - Brand Blue */}
      <motion.div
        className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[rgba(56,189,248,0.6)] blur-[100px]"
        animate={{
          x: [0, 200, 0, -100, 0],
          y: [0, 100, 250, 100, 0],
          scale: [1, 1.2, 1, 0.8, 1],
        }}
        transition={{
          duration: 18,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
      {/* Blob 2 - Soft Indigo */}
      <motion.div
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[rgba(129,140,248,0.4)] blur-[100px]"
        animate={{
          x: [0, -200, 0, 100, 0],
          y: [0, -100, -250, -100, 0],
          scale: [1, 0.8, 1, 1.2, 1],
        }}
        transition={{
          duration: 22,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
       {/* Blob 3 - Pale Grey */}
       <motion.div
        className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-[rgba(203,213,225,0.7)] blur-[100px]"
        animate={{
          x: ['-50%', '0%', '-50%', '-100%', '-50%'],
          y: ['-50%', '-100%', '-50%', '0%', '-50%'],
          rotate: [0, 45, 90, 180, 360],
        }}
        transition={{
          duration: 30,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
    </motion.div>
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

// Variants for Staggered Word Reveal
const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}


export default function CinematicHero() {
  const headline = "Климат вашего дома под ключ";
  const words = headline.split(" ");

  return (
    <section className="relative w-full h-[60vh] min-h-[450px] flex items-center justify-center text-center overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 px-4">
        <motion.h1 
          variants={sentenceVariants}
          initial="hidden"
          animate="visible"
          className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl font-headline"
        >
          {words.map((word, index) => (
            <motion.span
              key={word + "-" + index}
              variants={wordVariants}
              className="inline-block mr-[0.25em]" // Use className for spacing
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        
        <motion.div
          variants={subtitleVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
        >
            <HeroSubtitle />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200, damping: 15 }}
          whileHover={{ scale: 1.05 }}
          className="mt-8"
        >
          <Button asChild size="lg" className="font-bold shadow-lg relative overflow-hidden">
            <a href="#quiz">
                <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
                    initial={{ x: "-150%" }}
                    animate={{ x: "150%" }}
                    transition={{
                        delay: 2.5,
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 3,
                        ease: "linear",
                    }}
                />
                <span className="relative">Подобрать кондиционер</span>
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

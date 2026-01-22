'use client';

import { motion } from 'framer-motion';

export function HeroBackground() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-white">
      <motion.div
        className="absolute top-0 left-0 h-96 w-96 rounded-full bg-[rgba(56,189,248,0.3)] blur-[100px]"
        animate={{
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
        className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[rgba(129,140,248,0.15)] blur-[100px]"
        animate={{
          x: [0, -200, 0, 100, 0],
          y: [0, -100, -250, -100, 0],
          scale: [1, 0.8, 1, 1.2, 1],
        }}
        transition={{
          duration: 28,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />
       <motion.div
        className="absolute top-1/2 left-1/2 h-80 w-80 rounded-full bg-[rgba(203,213,225,0.4)] blur-[100px]"
        animate={{
          x: ['-50%', '0%', '-50%', '-100%', '-50%'],
          y: ['-50%', '-100%', '-50%', '0%', '-50%'],
          rotate: [0, 45, 90, 180, 360],
        }}
        transition={{
          duration: 35,
          ease: 'linear',
          repeat: Infinity,
        }}
      />
    </div>
  );
}

'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    tag: 'Монтаж',
    title: 'Профессиональный\nмонтаж',
    description:
      'Эстетичная установка кондиционеров с гарантией на все виды работ. Убираем за собой.',
    image: '/banners/slide-install.jpg',
    link: '/services',
    cta: 'Наши услуги',
  },
  {
    tag: 'Каталог',
    title: 'Лучшие мировые\nбренды',
    description:
      'Официальный дилер GREE, Cooper&Hunter, MIDEA и других ведущих производителей.',
    image: '/banners/slide-brands.jpg',
    link: '/catalog',
    cta: 'Перейти в каталог',
  },
  {
    tag: 'Доставка',
    title: 'Работаем по\nвсему региону',
    description:
      'Быстрая доставка и установка в Приднестровье и Молдове. Выезд в день заказа.',
    image: '/banners/slide-delivery.jpg',
    link: '/contacts',
    cta: 'Контакты',
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent((prev) => {
        let next = prev + newDirection;
        if (next < 0) next = slides.length - 1;
        if (next >= slides.length) next = 0;
        return next;
      });
    },
    []
  );

  const goToSlide = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  // Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [paginate]);

  const slide = slides[current];

  const imageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '8%' : '-8%',
      opacity: 0,
      scale: 1.1,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-8%' : '8%',
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const textVariants = {
    enter: { opacity: 0, y: 30 },
    center: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <section className="relative w-full overflow-hidden bg-foreground">
      {/* Main container */}
      <div className="relative h-[480px] sm:h-[520px] md:h-[560px] lg:h-[620px]">
        {/* Background image */}
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={current === 0}
              sizes="100vw"
            />
            {/* Dark overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/60 to-foreground/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 flex h-full items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.div key={current} className="space-y-5">
                  {/* Tag */}
                  <motion.div
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={0.1}
                  >
                    <span className="inline-flex items-center rounded-full border border-primary-foreground/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary-foreground/80">
                      {slide.tag}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={0.2}
                    className="text-3xl font-bold leading-tight tracking-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl font-headline whitespace-pre-line text-balance"
                  >
                    {slide.title}
                  </motion.h1>

                  {/* Description */}
                  <motion.p
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={0.35}
                    className="max-w-lg text-sm leading-relaxed text-primary-foreground/70 sm:text-base md:text-lg"
                  >
                    {slide.description}
                  </motion.p>

                  {/* CTA */}
                  <motion.div
                    variants={textVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={0.5}
                    className="flex items-center gap-4 pt-2"
                  >
                    <Button
                      asChild
                      size="lg"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 text-base font-semibold"
                    >
                      <Link href={slide.link}>
                        {slide.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom bar: dots + arrows */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between border-t border-primary-foreground/10 py-5">
              {/* Slide indicator dots */}
              <div className="flex items-center gap-3">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="group relative h-2 cursor-pointer overflow-hidden rounded-full transition-all duration-500"
                    style={{ width: index === current ? 48 : 8 }}
                  >
                    <span
                      className={cn(
                        'absolute inset-0 rounded-full transition-colors duration-300',
                        index === current
                          ? 'bg-primary-foreground/30'
                          : 'bg-primary-foreground/20 group-hover:bg-primary-foreground/40'
                      )}
                    />
                    {index === current && (
                      <motion.span
                        className="absolute inset-y-0 left-0 rounded-full bg-primary-foreground"
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 6, ease: 'linear' }}
                        key={`progress-${current}`}
                      />
                    )}
                  </button>
                ))}
                <span className="ml-3 text-xs tabular-nums text-primary-foreground/50">
                  {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                </span>
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => paginate(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/60 transition-colors hover:border-primary-foreground/50 hover:text-primary-foreground"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => paginate(1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary-foreground/20 text-primary-foreground/60 transition-colors hover:border-primary-foreground/50 hover:text-primary-foreground"
                  aria-label="Next slide"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

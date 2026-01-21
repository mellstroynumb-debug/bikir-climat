'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building, Briefcase, ChevronRight, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { cn } from '@/lib/utils';

type RoomType = 'house' | 'apartment' | 'office';

const roomTypes = [
  { id: 'house', label: 'Дом', icon: Home },
  { id: 'apartment', label: 'Квартира', icon: Building },
  { id: 'office', label: 'Офис', icon: Briefcase },
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [roomType, setRoomType] = useState<RoomType | null>(null);
  const [roomSize, setRoomSize] = useState([30]);

  const nextStep = () => {
    setDirection(1);
    setStep(prev => prev + 1);
  };

  const selectRoomType = (type: RoomType) => {
    setRoomType(type);
    nextStep();
  };

  return (
    <div className="w-full bg-background py-16 sm:py-24">
      <div className="max-w-2xl mx-auto text-center px-4">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Не знаете, что выбрать?</h2>
        <p className="mt-4 text-lg text-muted-foreground">Ответьте на 2 простых вопроса, и мы подберем идеальный кондиционер для вас.</p>
      </div>

      <div className="max-w-2xl mx-auto mt-10 px-4">
        <Card className="overflow-hidden relative min-h-[300px] bg-card/50 backdrop-blur-sm border-border">
          <AnimatePresence initial={false} custom={direction}>
            {step === 0 && (
              <motion.div
                key="step0"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
                className="absolute w-full"
              >
                <CardHeader>
                  <CardTitle>1. Тип помещения?</CardTitle>
                  <CardDescription>Где будет установлен кондиционер?</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {roomTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => selectRoomType(type.id as RoomType)}
                      className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <type.icon className="w-10 h-10 mb-2 text-primary" />
                      <span className="font-medium">{type.label}</span>
                    </button>
                  ))}
                </CardContent>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
                className="absolute w-full"
              >
                <CardHeader>
                  <CardTitle>2. Площадь помещения?</CardTitle>
                  <CardDescription>Укажите примерную площадь в квадратных метрах.</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <div className="text-center text-4xl font-bold text-primary mb-6">{roomSize[0]} м²</div>
                  <Slider
                    defaultValue={[30]}
                    max={150}
                    step={5}
                    onValueChange={setRoomSize}
                  />
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={nextStep}>
                    Показать результат <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: 'spring', stiffness: 300, damping: 30, duration: 0.3 }}
                className="absolute w-full flex flex-col items-center justify-center h-[300px]"
              >
                <Check className="w-16 h-16 text-green-500 mb-4" />
                <CardTitle>Спасибо!</CardTitle>
                <CardDescription className="mt-2">Мы подбираем для вас лучшие варианты...</CardDescription>
                 <Button variant="link" className="mt-4" onClick={() => setStep(0)}>Начать заново</Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

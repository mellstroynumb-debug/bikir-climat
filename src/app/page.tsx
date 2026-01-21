'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from "@/components/hero";
import ProductList from "@/components/product-list";
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';

function Quiz() {
  const [step, setStep] = useState(1);
  const [roomType, setRoomType] = useState('');
  const [area, setArea] = useState([25]);
  const [submitted, setSubmitted] = useState(false);

  const firestore = useFirestore();
  
  const productsQuery = useMemoFirebase(() => {
    if (!firestore || !submitted) return null;
    
    let q = query(collection(firestore, 'products'));
    
    if (roomType === 'bedroom') {
        q = query(q, where('specs.inverter', '==', 'Да'));
    }

    const selectedArea = area[0];
    if (selectedArea <= 25) {
        q = query(q, where('specs.power', '<=', 9000));
    } else if (selectedArea > 25 && selectedArea <= 40) {
        q = query(q, where('specs.power', '>', 7000), where('specs.power', '<=', 12000));
    } else { // > 40
        q = query(q, where('specs.power', '>', 12000));
    }
    return q;

  }, [firestore, submitted, roomType, area]);

  const { data: quizResults } = useCollection<Product>(productsQuery);


  const handleNextStep = () => {
    if (step === 1 && roomType) {
      setStep(2);
    }
  };

  const handleQuizSubmit = () => {
    setSubmitted(true);
    const resultsElement = document.getElementById('quiz-results');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };
  
  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <section id="quiz" className="w-full scroll-mt-20">
      <Card className="max-w-3xl mx-auto overflow-hidden">
        <CardHeader className="text-center px-4 pt-6 md:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold font-headline">Не знаете что выбрать?</CardTitle>
          <CardDescription className="mt-2 text-sm sm:text-base">Ответьте на 2 вопроса и мы подберем идеальный кондиционер для вас.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6 md:p-6 md:pt-0">
          <div className="relative flex items-start justify-center min-h-[300px] md:min-h-[250px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                >
                  <div className="space-y-4 pt-2">
                    <Label className="text-base sm:text-lg font-semibold text-center block">1. Куда вы хотите установить кондиционер?</Label>
                    <RadioGroup
                      value={roomType}
                      onValueChange={setRoomType}
                      className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
                    >
                      <Label htmlFor="bedroom" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="bedroom" id="bedroom" className="sr-only" />
                        <span className="text-base sm:text-lg">Спальня</span>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-1">Тихий и комфортный сон</span>
                      </Label>
                      <Label htmlFor="living_room" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="living_room" id="living_room" className="sr-only" />
                        <span className="text-base sm:text-lg">Гостиная / Офис</span>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-1">Мощное охлаждение</span>
                      </Label>
                    </RadioGroup>
                    <div className="flex justify-end pt-4">
                      <Button onClick={handleNextStep} disabled={!roomType}>Далее <ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  className="absolute w-full"
                >
                  <div className="space-y-6 pt-2">
                     <Label htmlFor="area-slider" className="text-base sm:text-lg font-semibold text-center block">2. Какая площадь помещения?</Label>
                     <div className="p-4">
                        <Slider
                            id="area-slider"
                            min={10}
                            max={60}
                            step={5}
                            value={area}
                            onValueChange={setArea}
                        />
                        <p className="text-center text-xl sm:text-2xl font-bold mt-4 text-primary">{area[0]} м²</p>
                     </div>
                     <div className="flex justify-center pt-2">
                        <Button size="lg" onClick={handleQuizSubmit}>Подобрать <Sparkles className="ml-2 h-4 w-4"/></Button>
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      
      {submitted && (
        <motion.div 
          id="quiz-results"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 scroll-mt-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-4 font-headline">Рекомендуемые модели</h2>
          {quizResults && quizResults.length > 0 ? (
             <ProductList products={quizResults} />
          ) : (
            <p className="text-center text-muted-foreground">К сожалению, по вашим критериям ничего не найдено. Попробуйте изменить параметры.</p>
          )}
        </motion.div>
      )}
    </section>
  );
}

export default function Home() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => query(collection(firestore, 'products')), [firestore]);
  const { data: products } = useCollection<Product>(productsCollection);

  return (
    <>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-24">
          <Quiz />
        </div>
        <div className="py-24 border-t">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-12 font-headline">Все популярные модели</h2>
          <ProductList products={products || []} />
        </div>
      </div>
    </>
  );
}

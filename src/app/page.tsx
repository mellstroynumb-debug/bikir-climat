'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';

import CinematicHero from "@/components/cinematic-hero";
import ProductList from "@/components/product-list";
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Sparkles, Loader2, Lightbulb, Moon, Wind, CheckCircle2 } from 'lucide-react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { Advantages } from '@/components/advantages';
import { FaqSection } from '@/components/faq-section';

// Helper function to get price based on region
const getPrice = (product: Product, region: 'PMR' | 'MD') => {
  return region === 'PMR' ? product.price_pmr : product.price_md;
};


function Quiz({ allProducts }: { allProducts: Product[] }) {
  const [step, setStep] = useState(1);
  const [priority, setPriority] = useState('');
  const [area, setArea] = useState([25]);
  const [budget, setBudget] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, { title: string; description: string; products: Product[] }>>({});

  const handleNextStep = () => {
    if (step === 1 && priority) setStep(2);
    if (step === 2 && area) setStep(3);
  };

  const handleQuizSubmit = () => {
    const { region } = useStore.getState();

    // 1. Filter by Area
    const filteredByArea = allProducts.filter(p => {
      const productArea = Number(p.specs.area_sq_m) || 0;
      if (productArea === 0) return false; // Don't recommend products without area spec

      // Looser filter logic
      if (area[0] <= 20) return productArea <= 25;
      if (area[0] >= 50) return productArea >= 45;
      
      return productArea >= area[0] - 7 && productArea <= area[0] + 7;
    });

    // 2. Group by type and quality
    const groups = {
      optimal: { title: 'Оптимальный выбор', products: [] as Product[], description: 'Надежные и тихие инверторные модели. Экономят электроэнергию и создают комфортный климат. Лучшее соотношение цены и качества.' },
      budget: { title: 'Бюджетные модели', products: [] as Product[], description: 'Отличный выбор, если вам нужно простое и эффективное решение для охлаждения без лишних затрат. Идеально для дачи или небольшой комнаты.' },
      premium: { title: 'Премиум-класс', products: [] as Product[], description: 'Флагманские модели от ведущих брендов с максимальным набором функций, стильным дизайном и высочайшей энергоэффективностью.' },
    };

    const priceRangesPMR = { budget: 4500, premium: 8500 };
    const priceRangesMD = { budget: 4500, premium: 8500 };
    const priceRanges = region === 'PMR' ? priceRangesPMR : priceRangesMD;
    const premiumBrands = ['Mitsubishi', 'Daikin', 'Cooper&Hunter', 'Gree'];

    filteredByArea.forEach(p => {
      const price = getPrice(p, region);
      if (!price) return;

      const isPremiumBrand = premiumBrands.some(brand => p.brand.toLowerCase().includes(brand.toLowerCase()));

      if (isPremiumBrand && price > priceRanges.budget) {
        groups.premium.products.push(p);
      } else if (p.specs.inverter === 'Да' && price > priceRanges.budget) {
        groups.optimal.products.push(p);
      } else {
        groups.budget.products.push(p);
      }
    });
    
    // If user wants quietness, boost inverter models
    if (priority === 'quiet') {
        groups.optimal.products.sort((a, b) => {
            if (a.specs.inverter === 'Да' && b.specs.inverter !== 'Да') return -1;
            if (a.specs.inverter !== 'Да' && b.specs.inverter === 'Да') return 1;
            return 0;
        });
    }

    // 3. Reorder and filter groups based on user's budget preference
    let finalGroups: Record<string, any> = {};
    if (budget === 'premium') {
        finalGroups = { premium: groups.premium, optimal: groups.optimal, budget: groups.budget };
    } else if (budget === 'base') {
        finalGroups = { optimal: groups.optimal, premium: groups.premium, budget: groups.budget };
    } else { // 'eco'
        finalGroups = { budget: groups.budget, optimal: groups.optimal, premium: groups.premium };
    }
    
    const nonEmptyGroups = Object.fromEntries(
      Object.entries(finalGroups).filter(([, group]) => group.products.length > 0)
    );

    setResults(nonEmptyGroups);
    setSubmitted(true);
    setStep(4); // Move to the "results ready" view
  };

  const handleViewResults = () => {
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
          <CardDescription className="mt-2 text-sm sm:text-base">Пройдите наш мини-тест и получите персональную подборку за 1 минуту.</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-6 md:p-6 md:pt-0">
          <div className="relative flex items-start justify-center min-h-[300px] md:min-h-[250px]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="absolute w-full">
                  <div className="space-y-4 pt-2">
                    <Label className="text-base sm:text-lg font-semibold text-center block">1. Что для вас важнее всего в работе кондиционера?</Label>
                    <RadioGroup value={priority} onValueChange={setPriority} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <Label htmlFor="quiet" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="quiet" id="quiet" className="sr-only" />
                        <Moon className="h-6 w-6 mb-2"/>
                        <span className="text-base sm:text-lg font-semibold">Тишина и комфорт</span>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">Для спальни, детской или кабинета</span>
                      </Label>
                      <Label htmlFor="power" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary">
                        <RadioGroupItem value="power" id="power" className="sr-only" />
                         <Wind className="h-6 w-6 mb-2"/>
                        <span className="text-base sm:text-lg font-semibold">Мощность</span>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">Для гостиной, офиса или магазина</span>
                      </Label>
                    </RadioGroup>
                    <div className="flex justify-end pt-4">
                      <Button onClick={handleNextStep} disabled={!priority}>Далее <ArrowRight className="ml-2 h-4 w-4"/></Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="absolute w-full">
                  <div className="space-y-6 pt-2">
                     <Label htmlFor="area-slider" className="text-base sm:text-lg font-semibold text-center block">2. Какая площадь помещения?</Label>
                     <div className="p-4">
                        <Slider id="area-slider" min={10} max={60} step={5} value={area} onValueChange={setArea} />
                        <p className="text-center text-xl sm:text-2xl font-bold mt-4 text-primary">{area[0]} м²</p>
                     </div>
                     <div className="flex justify-between items-center pt-2">
                        <Button variant="ghost" onClick={() => setStep(1)}>Назад</Button>
                        <Button onClick={handleNextStep}>Далее <ArrowRight className="ml-2 h-4 w-4"/></Button>
                     </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="absolute w-full">
                  <div className="space-y-4 pt-2">
                    <Label className="text-base sm:text-lg font-semibold text-center block">3. Какой у вас бюджет?</Label>
                    <RadioGroup value={budget} onValueChange={setBudget} className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-4 pt-2">
                       <Label htmlFor="eco" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary h-24">
                        <RadioGroupItem value="eco" id="eco" className="sr-only" />
                        <span className="text-base sm:text-lg">Эконом</span>
                      </Label>
                       <Label htmlFor="base" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary h-24">
                        <RadioGroupItem value="base" id="base" className="sr-only" />
                        <span className="text-base sm:text-lg">Базовый</span>
                      </Label>
                       <Label htmlFor="premium" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer [&:has([data-state=checked])]:border-primary h-24">
                        <RadioGroupItem value="premium" id="premium" className="sr-only" />
                        <span className="text-base sm:text-lg">Премиум</span>
                      </Label>
                    </RadioGroup>
                    <div className="flex justify-between items-center pt-4">
                        <Button variant="ghost" onClick={() => setStep(2)}>Назад</Button>
                        <Button size="lg" onClick={handleQuizSubmit} disabled={!budget}>Подобрать <Sparkles className="ml-2 h-4 w-4"/></Button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" transition={{ duration: 0.3 }} className="absolute w-full flex flex-col items-center justify-center text-center h-full">
                    <div className="space-y-4">
                        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                        <h3 className="text-xl font-bold">Отлично! Ваша подборка готова.</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">Мы проанализировали ваши ответы и подобрали лучшие варианты кондиционеров.</p>
                        <div className="pt-4">
                            <Button size="lg" onClick={handleViewResults}>
                                Посмотреть результаты
                            </Button>
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
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-center mb-10 font-headline">Вот что мы подобрали для вас:</h2>
          {Object.keys(results).length > 0 ? (
            <div className="space-y-12">
              {Object.entries(results).map(([key, groupData]) => (
                <div key={key}>
                  <h3 className="text-xl sm:text-2xl font-bold font-headline mb-3">{groupData.title}</h3>
                  <div className="flex items-start bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md mb-6">
                      <Lightbulb className="h-6 w-6 text-blue-500 mr-4 mt-1 flex-shrink-0" />
                      <p className="text-sm text-blue-800">{groupData.description}</p>
                  </div>
                  <ProductList products={groupData.products} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">К сожалению, по вашим критериям ничего не найдено. Попробуйте изменить параметры или <a href="/catalog" className="text-primary hover:underline">посмотрите все наши модели</a>.</p>
          )}
        </motion.div>
      )}
    </section>
  );
}

export default function Home() {
  const firestore = useFirestore();
  const productsCollection = useMemoFirebase(() => firestore ? query(collection(firestore, 'products')) : null, [firestore]);
  const { data: allProducts, isLoading } = useCollection<Product>(productsCollection);

  const conditionerProducts = useMemo(() => {
    if (!allProducts) return [];
    return allProducts.filter(p => p.category === 'cond');
  }, [allProducts]);

  const featuredProducts = useMemo(() => {
    if (!conditionerProducts) return [];
    const { region } = useStore.getState();
    return conditionerProducts.filter(p => getPrice(p, region)).slice(0, 4);
  }, [conditionerProducts]);

  return (
    <>
      <CinematicHero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured Products Section */}
        <section id="featured-products" className="py-24 scroll-mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">
              Популярные модели
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
              Наш выбор лучших кондиционеров по соотношению цены и качества.
            </p>
          </div>
          {isLoading ? (
             <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <ProductList products={featuredProducts} />
          )}
          { allProducts && allProducts.length > 4 && (
            <div className="text-center mt-12">
              <Button asChild size="lg" variant="outline">
                <Link href="/catalog">Смотреть все модели</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Quiz Section */}
        <section className="py-24 border-t">
          {isLoading && !allProducts ? (
            <div className="flex items-center justify-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4 text-muted-foreground">Загружаем наш умный подборщик...</p>
            </div>
          ) : (
             allProducts && <Quiz allProducts={conditionerProducts} />
          )}
        </section>

        <section className="py-24 border-t">
            <FaqSection />
        </section>
      </div>
      <Advantages />
    </>
  );
}

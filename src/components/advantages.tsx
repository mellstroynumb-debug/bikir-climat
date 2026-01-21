
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Landmark, Paintbrush, ShieldCheck, Users } from "lucide-react";
import { motion } from 'framer-motion';

const advantages = [
  {
    icon: <Paintbrush className="h-8 w-8 text-primary" />,
    title: "Эстетичный монтаж",
    description: "Мы заботимся о вашем интерьере. Прокладываем коммуникации максимально скрыто и используем качественные короба.",
  },
  {
    icon: <Landmark className="h-8 w-8 text-primary" />,
    title: "Две валюты",
    description: "Оплачивайте как вам удобно — в рублях ПМР или молдавских леях. Цены всегда актуальны для вашего региона.",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Опытная команда",
    description: "Наши специалисты имеют многолетний опыт, проходят регулярное обучение и знают все тонкости климатической техники.",
  },
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Гарантия качества",
    description: "Мы предоставляем официальную гарантию на все оборудование и выполненные нами монтажные работы.",
  },
];

const cardVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.3,
      duration: 0.8,
      delay: i * 0.1,
    }
  })
};

export function Advantages() {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">
            Почему выбирают нас
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
            Мы не просто продаем кондиционеры, мы создаем комфортный климат.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={advantage.title}
              custom={index}
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <Card className="h-full text-center hover:shadow-xl transition-shadow duration-300 bg-card">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    {advantage.icon}
                  </div>
                  <CardTitle className="text-lg">{advantage.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{advantage.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

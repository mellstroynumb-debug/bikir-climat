'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { motion } from 'framer-motion';

const advantages = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: "Гарантия на работы 1 год",
    description: "Мы уверены в качестве наших услуг и предоставляем полную гарантию на все выполненные монтажные работы.",
  },
  {
    icon: <Wrench className="h-8 w-8 text-primary" />,
    title: "Профессиональный инструмент",
    description: "Используем только современное и проверенное оборудование, что гарантирует аккуратность и точность на каждом этапе.",
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Опытные мастера",
    description: "Наши специалисты имеют многолетний опыт, проходят регулярное обучение и знают все тонкости климатической техники.",
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Убираем за собой",
    description: "После завершения всех работ мы производим тщательную уборку, оставляя после себя только чистоту и комфорт.",
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

export function ServiceAdvantages() {
  return (
    <section className="w-full py-16 md:py-24 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight font-headline">
            Наш подход к работе
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-muted-foreground">
            Качество, надежность и чистота — наши главные приоритеты.
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
